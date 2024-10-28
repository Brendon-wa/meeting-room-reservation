<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    const STATUS_RESERVED = 'reserved';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'room_id',
        'room_name',
        'user_id',
        'user_name',
        'start_time',
        'end_time',
        'date',
        'status',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isAvailable($date, $startTime, $endTime)
    {
        return !self::where('room_id', $this->room_id)
            ->where('date', $date)
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where(function ($subQuery) use ($startTime, $endTime) {
                    $subQuery->where('start_time', '<', $endTime)
                        ->where('end_time', '>', $startTime);
                });
            })
            ->exists();
    }
}
