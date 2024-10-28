<?php

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use DatabaseTransactions;

    protected $user;

    public function testIndexReturnsUserBookings()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        Booking::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->getJson('/api/bookings');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data' => [['id', 'room_id', 'user_id', 'start_time', 'end_time', 'date', 'status']]]);
    }

    public function testShowReturnsBookingDetails()
    {
        $user = User::factory()->create();
        $booking = Booking::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user);

        $response = $this->getJson('/api/bookings/' . strval($booking->room_id) . '/' . strval($booking->id));

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'id' => $booking->id,
                'room_id' => $booking->room_id,
                'user_id' => $booking->user_id,
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
                'date' => $booking->date,
                'status' => $booking->status,
            ],
        ]);
    }

    public function testStoreCreatesNewBooking()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $room = Room::factory()->create();

        $data = [
            'room_id' => $room->id,
            'date' => Carbon::tomorrow()->toDateString(),
            'start_time' => '18:00',
            'end_time' => '19:00'
        ];

        $response = $this->postJson('/api/booking', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('bookings', [
            'room_id' => $room->id,
            'user_id' => $user->id,
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'date' => $data['date'],
            'status' => Booking::STATUS_RESERVED,
        ]);
    }

    public function testCancelSuccessfullyChangesBookingStatus()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'start_time' => '18:00:00',
            'end_time' => '20:00:00',
            'date' => Carbon::today()->toDateString(),
            'status' => Booking::STATUS_RESERVED,
        ]);

        $response = $this->putJson('/api/booking/cancel/' . $booking->id);

        $response->assertStatus(200);
        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => Booking::STATUS_CANCELLED,
        ]);
    }

    public function testCancelReturnsNotFoundForInvalidBooking()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->putJson('/api/booking/cancel/999'); // ID inexistente

        $response->assertStatus(404);
        $this->assertEquals('Reserva não encontrada.', $response->json('message'));
    }

    public function testCancelReturnsForbiddenForUnauthorizedUser()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create(); // Outro usuário
        $this->actingAs($user1);

        $booking = Booking::factory()->create(['user_id' => $user2->id]);

        $response = $this->putJson('/api/booking/cancel/' . $booking->id);

        $response->assertStatus(403);
        $this->assertEquals('Você não tem permissão para cancelar esta reserva.', $response->json('message'));
    }

    public function testCancelReturnsErrorForPastReservation()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Criar uma reserva com data no passado
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'start_time' => '18:00:00',
            'end_time' => '20:00:00',
            'date' => Carbon::yesterday()->toDateString(), // Data no passado
            'status' => Booking::STATUS_RESERVED,
        ]);

        $response = $this->putJson('/api/booking/cancel/' . $booking->id);

        $response->assertStatus(422);
        $this->assertEquals('Não é possível cancelar a reserva, pois a data já passou.', $response->json('error'));
    }
}
