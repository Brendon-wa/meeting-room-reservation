<?php

namespace App\Repository\Contracts;

use App\Http\Requests\BookingRequest;

interface BookingInterface
{
    public function index();
    public function show($room_id, $booking_id);
    public function showAdmin();
    public function store(BookingRequest $request);
    public function update(BookingRequest $request, $booking_id);
    public function cancel($booking_id);
}
