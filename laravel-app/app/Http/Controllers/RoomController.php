<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomRequest;
use App\Service\RoomService;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    private RoomService $room_service;

    public function __construct(RoomService $room_service)
    {
        $this->room_service = $room_service;
    }

    public function indexAll()
    {
        return $this->room_service->indexAll();
    }

    public function index(Request $request)
    {
        return $this->room_service->index($request);
    }

    public function endTime(Request $request)
    {
        return $this->room_service->endTime($request);
    }

    public function show($room_id)
    {
        return $this->room_service->show($room_id);
    }

    public function store(RoomRequest $request)
    {
        return $this->room_service->store($request);
    }

    public function update(RoomRequest $request, $room_id)
    {
        return $this->room_service->update($request, $room_id);
    }

    public function destroy($room_id)
    {
        return $this->room_service->destroy($room_id);
    }
}
