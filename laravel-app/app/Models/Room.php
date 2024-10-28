<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'value',
        'photos',
        'is_available'
    ];

    public function getValue($value)
    {
        return number_format($value, 2, ',', '.');
    }

    public static function availableTimes()
    {
        return ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
