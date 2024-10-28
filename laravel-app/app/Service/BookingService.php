<?php

declare(strict_types=1);

namespace App\Service;

use App\Http\Requests\BookingRequest;
use App\Repository\Contracts\BookingInterface;

class BookingService
{
    private BookingInterface $bookingRepository;

    public function __construct(BookingInterface $bookingRepository)
    {
        $this->bookingRepository = $bookingRepository;
    }

    public function index()
    {
        return $this->bookingRepository->index();
    }

    public function show($room_id, $booking_id)
    {
        return $this->bookingRepository->show($room_id, $booking_id);
    }

    public function showAdmin()
    {
        return $this->bookingRepository->showAdmin();
    }

    public function store(BookingRequest $request)
    {
        return $this->bookingRepository->store($request);
    }

    public function update(BookingRequest $request, $booking_id)
    {
        return $this->bookingRepository->update($request, $booking_id);
    }

    public function cancel($booking_id)
    {
        return $this->bookingRepository->cancel($booking_id);
    }
}
