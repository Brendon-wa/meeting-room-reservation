<?php

namespace App\Repository\Business;

use App\Http\Requests\BookingRequest;
use App\Models\Booking;
use App\Models\Room;
use App\Repository\Contracts\BookingInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingRepository implements BookingInterface
{
    protected $model = Booking::class;

    public function index()
    {
        $bookings = Booking::where('user_id', Auth::id())->orderBy('id')->get();

        if ($bookings->isEmpty()) {
            return response()->json(['message' => 'Sem agendamentos'], 404);
        }

        return response()->json(['data' => $bookings]);
    }

    public function show($room_id, $booking_id)
    {
        $bookings = $this->model::orderBy('id')->where(['user_id' => Auth::id(), 'room_id' => $room_id, 'id' => $booking_id])->first();

        if (!$bookings) return response()->json(['message' => 'Sem agendamentos'], 404);

        return response()->json(['data' => $bookings]);
    }

    public function showAdmin()
    {
        $bookings = $this->model::orderBy('id')->get();

        if (!$bookings) return response()->json(['message' => 'Sem agendamentos'], 404);

        return response()->json(['data' => $bookings]);
    }

    public function store(BookingRequest $request)
    {
        $user = Auth::user();

        $booking = new Booking();
        $booking->room_id = $request->room_id;
        $booking->user_id = $user->id;

        $room = Room::find($request->room_id);
        $validTimes = Room::availableTimes();
        $now = Carbon::now();

        $requestedDateTime = Carbon::createFromFormat('Y-m-d H:i', $request->date . ' ' . $request->start_time);
        if ($requestedDateTime < $now) {
            return response()->json(['error' => 'Não é possível reservar horários no passado.'], 400);
        }

        if (!in_array($request->start_time, $validTimes) || !in_array($request->end_time, $validTimes)) {
            return response()->json(['error' => 'Os horários informados não são válidos.'], 400);
        }

        if (!$booking->isAvailable($request->date, $request->start_time, $request->end_time)) {
            return response()->json(['error' => 'O horário solicitado já está reservado.'], 400);
        }

        try {
            DB::beginTransaction();
            $reservation = Booking::create([
                'room_id' => $request->room_id,
                'room_name' => $room->name,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'date' => $request->date,
                'status' => Booking::STATUS_RESERVED,
            ]);
            DB::commit();

            return response()->json(['data' => $reservation, 'message' => 'Reserva realizada com sucesso'], 201);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['Error' => $th->getMessage()], 500);
        }
    }

    public function update(BookingRequest $request, $booking_id)
    {
        $user = Auth::user();
        $reservation = Booking::find($booking_id);

        if (!$reservation) return response()->json(['message' => 'Reserva não encontrada.'], 404);
        if ($reservation->user_id !== Auth::id()) return response()->json(['message' => 'Você não tem permissão para atualizar esta reserva.'], 403);
        if ($reservation->status == Booking::STATUS_CANCELLED) return response()->json(['message' => 'Não é possivel atualizar essa reserva, a mesma já se encontra cancelada.'], 404);

        $reservationStart = $request->start_time;
        $reservationEnd = $request->end_time;

        $overlap = $this->model::where('room_id', $request->room_id)
            ->where('id', '!=', $booking_id)
            ->where('status', '!=', Booking::STATUS_CANCELLED)
            ->where(function ($query) use ($reservationStart, $reservationEnd) {
                $query->whereBetween('start_time', [$reservationStart, $reservationEnd])
                    ->orWhereBetween('end_time', [$reservationStart, $reservationEnd]);
            })
            ->exists();

        if ($overlap) return response()->json(['message' => 'A sala já está reservada para a data/horário informado.'], 422);


        try {
            DB::beginTransaction();
            $reservation->update([
                'room_id' => $request->room_id,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'date' => $request->date,
                'status' => Booking::STATUS_RESERVED,
                'start_time' => $reservationStart,
                'end_time' => $reservationEnd,
            ]);
            DB::commit();

            return response()->json(['data' => $reservation, 'message' => 'Reserva atualizada com sucesso'], 201);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['Error' => $th->getMessage()], 500);
        }
    }

    public function cancel($booking_id)
    {
        $reservation = Booking::find($booking_id);
        $currentDateTime = Carbon::now('America/Sao_Paulo');

        if (!$reservation) return response()->json(['message' => 'Reserva não encontrada.'], 404);

        if ($reservation->user_id !== Auth::id()) return response()->json(['message' => 'Você não tem permissão para cancelar esta reserva.'], 403);

        if (empty($reservation->start_time) || empty($reservation->end_time)) {
            return response()->json(['message' => 'Horários de reserva inválidos.'], 400);
        }

        $reservationStart = Carbon::createFromFormat('Y-m-d H:i:s', $reservation->date . ' ' . $reservation->start_time, 'America/Sao_Paulo');

        $reservationEnd = Carbon::createFromFormat('Y-m-d H:i:s', $reservation->date . ' ' . $reservation->end_time, 'America/Sao_Paulo');

        if ($reservationStart->lessThanOrEqualTo($currentDateTime) && $reservationEnd->lessThanOrEqualTo($currentDateTime)) {
            return response()->json(['error' => 'Não é possível cancelar a reserva, pois a data já passou.'], 422);
        }

        try {
            DB::beginTransaction();
            $reservation->update(['status' => Booking::STATUS_CANCELLED]);
            DB::commit();

            return response()->json(['data' => $reservation, 'message' => 'Reserva cancelada com sucesso.'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
