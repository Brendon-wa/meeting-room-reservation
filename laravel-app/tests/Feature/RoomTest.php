<?php

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class RoomTest extends TestCase
{
    use DatabaseTransactions;

    public function testIndexReturnsAvailableTimesForToday()
    {
        $room = Room::factory()->create();

        Booking::factory()->create([
            'room_id' => $room->id,
            'date' => now()->toDateString(),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
        ]);

        $response = $this->getJson('api/rooms?date=' . now()->toDateString() . '&room_id=' . $room->id);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'room_id',
                    'room_name',
                    'available_times',
                ],
            ]
        ]);
    }

    public function testEndTimeReturnsAvailableEndTimes()
    {
        $room = Room::factory()->create();

        Booking::factory()->create([
            'room_id' => $room->id,
            'date' => now()->toDateString(),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
        ]);

        $response = $this->getJson('/api/rooms/endTime?room_id=' . $room->id . '&date=' . now()->toDateString() . '&start_time=' . '11:00:00');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'room_id',
                    'room_name',
                    'available_times',
                ]
            ]
        ]);
    }

    public function testShowReturnsRoomDetails()
    {
        $room = Room::factory()->create();

        $response = $this->getJson('/api/room/' . $room->id);

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'id' => $room->id,
                'name' => $room->name,
                'description' => $room->description,
                'value' => $room->value,
                'photos' => $room->photos,
            ],
        ]);
    }

    public function testShowReturns404ForNonExistentRoom()
    {
        $response = $this->getJson('/api/room/' . 999);

        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'Sala não encontrada',
        ]);
    }
}
