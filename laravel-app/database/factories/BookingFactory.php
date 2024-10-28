<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition()
    {
        return [
            'room_id' => Room::factory(),
            'user_id' => User::factory(),
            'user_name' => $this->faker->name,
            'start_time' => $this->faker->time,
            'end_time' => $this->faker->time,
            'date' => $this->faker->date,
            'status' => Booking::STATUS_RESERVED,
        ];
    }
}
