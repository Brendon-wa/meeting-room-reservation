<?php

namespace App\Repository\Contracts;

use App\Http\Requests\RoomRequest;
use Illuminate\Http\Request;

interface RoomInterface
{
    public function indexAll();
    public function index(Request $request);
    public function endTime(Request $request);
    public function show($room_id);
    public function store(RoomRequest $request);
    public function update(RoomRequest $request, $room_id);
    public function destroy($room_id);
}
