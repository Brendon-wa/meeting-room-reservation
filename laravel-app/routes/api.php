<?php

use Illuminate\Support\Facades\Route;

Route::post('/login', [\App\Http\Controllers\Auth\AuthController::class, 'login'])->name('login');
Route::post('/register', [\App\Http\Controllers\UserController::class, 'register'])->name('account');

Route::get('/rooms/all', [\App\Http\Controllers\RoomController::class, 'indexAll'])->name('indexAll');
Route::get('/rooms', [\App\Http\Controllers\RoomController::class, 'index'])->name('index');
Route::get('/room/{room_id}', [\App\Http\Controllers\RoomController::class, 'show'])->name('show');
Route::get('/rooms/endTime', [\App\Http\Controllers\RoomController::class, 'endTime'])->name('endTime');

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::group(['middleware' => ['auth.admin']], function ($route) {
        Route::get('/users', [\App\Http\Controllers\UserController::class, 'index'])->name('index');

        Route::post('/room', [\App\Http\Controllers\RoomController::class, 'store'])->name('store');
        Route::put('/room/{room_id}', [\App\Http\Controllers\RoomController::class, 'update'])->name('update');
        Route::delete('/room/{room_id}', [\App\Http\Controllers\RoomController::class, 'destroy'])->name('destroy');

        Route::get('/bookings/admin', [\App\Http\Controllers\BookingController::class, 'showAdmin'])->name('showAdmin');
    });

    Route::get('/user', [\App\Http\Controllers\UserController::class, 'show'])->name('show');

    Route::get('/bookings', [\App\Http\Controllers\BookingController::class, 'index'])->name('index');
    Route::post('/booking', [\App\Http\Controllers\BookingController::class, 'store'])->name('store');
    Route::put('/booking/{booking_id}', [\App\Http\Controllers\BookingController::class, 'update'])->name('update');
    Route::put('/booking/cancel/{booking_id}', [\App\Http\Controllers\BookingController::class, 'cancel'])->name('cancel');
    Route::get('/bookings/{room_id}/{booking_id}', [\App\Http\Controllers\BookingController::class, 'show'])->name('show');
});

