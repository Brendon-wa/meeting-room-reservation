<?php

declare(strict_types=1);

namespace App\Service;

use App\Http\Requests\RoomRequest;
use App\Repository\Contracts\RoomInterface;
use Illuminate\Http\Request;

class RoomService
{
    private RoomInterface $roomRepository;

    public function __construct(RoomInterface $roomRepository)
    {
        $this->roomRepository = $roomRepository;
    }

    public function indexAll()
    {
        return $this->roomRepository->indexAll();
    }

    public function index(Request $request)
    {
        return $this->roomRepository->index($request);
    }

    public function endTime(Request $request)
    {
        return $this->roomRepository->endTime($request);
    }

    public function show($room_id)
    {
        return $this->roomRepository->show($room_id);
    }

    public function store(RoomRequest $request)
    {
        return $this->roomRepository->store($request);
    }

    public function update(RoomRequest $request, $room_id)
    {
        return $this->roomRepository->update($request, $room_id);
    }

    public function destroy($room_id)
    {
        return $this->roomRepository->destroy($room_id);
    }
}
