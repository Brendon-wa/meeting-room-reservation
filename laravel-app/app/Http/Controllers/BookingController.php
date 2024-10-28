<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingRequest;
use App\Service\BookingService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    private BookingService $booking_service;

    public function __construct(BookingService $booking_service)
    {
        $this->booking_service = $booking_service;
    }

    public function index(Request $request)
    {
        return $this->booking_service->index($request);
    }

    public function show($room_id, $booking_id)
    {
        return $this->booking_service->show($room_id, $booking_id);
    }

    public function showAdmin()
    {
        return $this->booking_service->showAdmin();
    }

    public function store(BookingRequest $request)
    {
        return $this->booking_service->store($request);
    }

    public function update(BookingRequest $request, $booking_id)
    {
        return $this->booking_service->update($request, $booking_id);
    }

    public function cancel($booking_id)
    {
        return $this->booking_service->cancel($booking_id);
    }
}
