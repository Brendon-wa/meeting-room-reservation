<?php

namespace App\Repository\Business;

use App\Http\Requests\RoomRequest;
use App\Models\Booking;
use App\Models\Room;
use App\Repository\Contracts\RoomInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoomRepository implements RoomInterface
{
    protected $model = Room::class;

    public function indexAll()
    {
        $rooms = Room::orderBy('id')->get();

        return response()->json(['data' => $rooms, 200]);
    }

    public function index(Request $request)
    {
        $room = Room::find($request->room_id);
        $availableSlots = [];

        $validTimes = Room::availableTimes();

        $bookings = Booking::where('room_id', $room->id)
            ->where('date', $request->date)
            ->where('status', '!=', 'cancelled')
            ->get();

        $availableTimes = $validTimes;

        date_default_timezone_set('America/Sao_Paulo');

        $today = date('Y-m-d');
        $isToday = ($request->date === $today);
        $now = time();

        foreach ($bookings as $booking) {
            $startTime = strtotime($booking->start_time);
            $endTime = strtotime($booking->end_time);

            $availableTimes = array_filter($availableTimes, function ($time) use ($startTime, $endTime) {
                $timeStamp = strtotime($time);
                return !($timeStamp >= $startTime && $timeStamp < $endTime);
            });
        }

        $availableTimes = array_filter($availableTimes, function ($time) {
            return $time !== '20:00';
        });


        if ($isToday) {
            $availableTimes = array_filter($availableTimes, function ($time) use ($now) {
                return strtotime($time) > $now;
            });
        }

        $availableSlots[] = [
            'room_id' => $room->id,
            'room_name' => $room->name,
            'available_times' => array_values(array_unique($availableTimes)),
        ];

        return response()->json(['data' => $availableSlots], 200);
    }

    public function endTime(Request $request)
    {
        $roomId = $request->query('room_id');
        $date = $request->query('date');
        $startTime = $request->query('start_time');

        $startDateTime = Carbon::parse("$date $startTime");

        $bookings = Booking::where('room_id', $roomId)
            ->where('date', $date)
            ->where('status', 'reserved')
            ->get();

        Log::info("Bookings for $date: ", $bookings->toArray());

        $possibleEndTimes = collect(range(7, 20))->map(function ($hour) use ($date) {
            return Carbon::parse("$date $hour:00:00");
        });

        $limitTime = Carbon::parse("$date 20:00:00");

        $nextBooking = $bookings->filter(function ($booking) use ($startDateTime) {
            $bookingStart = Carbon::parse("{$booking->date} {$booking->start_time}");
            return $bookingStart->gt($startDateTime);
        })->first();

        if ($nextBooking) {
            $nextBookingStart = Carbon::parse("{$nextBooking->date} {$nextBooking->start_time}");
            $limitTime = $nextBookingStart;
        }

        $availableEndTimes = $possibleEndTimes->filter(function ($endTime) use ($startDateTime, $limitTime, $bookings) {
            if ($endTime->gt($startDateTime) && $endTime->lte($limitTime)) {
                foreach ($bookings as $booking) {
                    $bookingStart = Carbon::parse("{$booking->date} {$booking->start_time}");
                    $bookingEnd = Carbon::parse("{$booking->date} {$booking->end_time}");

                    if ($endTime->gte($bookingStart) && $endTime->lt($bookingEnd)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        })->map(function ($time) {
            return $time->format('H:i');
        });

        if (!$nextBooking) {
            if (!$availableEndTimes->contains('18:00')) {
                $availableEndTimes->push('18:00');
            }
        }

        if ($limitTime->format('H:i') != '20:00' && !$availableEndTimes->contains($limitTime->format('H:i'))) {
            $availableEndTimes->push($limitTime->format('H:i'));
        }

        $availableSlots[] = [
            'room_id' => $roomId,
            'room_name' => $date,
            'available_times' => $availableEndTimes->unique()->values(),
        ];

        return response()->json(['data' => $availableSlots], 200);
    }

    public function show($room_id)
    {
        $room = $this->model::find($room_id);
        if (!$room) return response()->json(['message' => 'Sala não encontrada'], 404);

        return response()->json(['data' => $room], 200);
    }

    public function store(RoomRequest $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->all();
            $model = new $this->model();
            $model->fill($data);
            $model->save();
            DB::commit();

            return response()->json(['data' => $model, 'message' => 'Salvo com sucesso'], 201);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['Error' => $th->getMessage()], 500);
        }
    }

    public function update(RoomRequest $request, $room_id)
    {
        try {
            DB::beginTransaction();
            $model = $this->model::find($room_id);
            $model->fill($request->all());
            $model->save();
            DB::commit();

            return response()->json(['data' => $model, 'message' => 'Atualizado com sucesso'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['Error' => $th->getMessage()], 500);
        }
    }

    public function destroy($room_id)
    {
        $room = $this->model::find($room_id);
        if (!$room) return response()->json(['Erro' => 'Sala informada não consta em nossa base de dados!'], 400);

        $futureReservations = Booking::where('room_id', $room_id)->where('date', '>', now())->exists();

        if ($futureReservations) {
            return response()->json(['Erro' => 'Não é possível excluir a sala, pois existem reservas futuras!'], 400);
        }

        try {
            DB::beginTransaction();
            $room->delete();
            DB::commit();

            return response()->json(['message' => 'Sala removida com sucesso'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['Error' => $th->getMessage()], 500);
        }
    }
}
