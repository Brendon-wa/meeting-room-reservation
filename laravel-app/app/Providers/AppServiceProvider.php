<?php

namespace App\Providers;

use App\Repository\Business\AuthRepository;
use App\Repository\Business\BookingRepository;
use App\Repository\Business\RoomRepository;
use App\Repository\Business\UserRepository;
use App\Repository\Contracts\AuthInterface;
use App\Repository\Contracts\BookingInterface;
use App\Repository\Contracts\RoomInterface;
use App\Repository\Contracts\UserInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->bind(AuthInterface::class, AuthRepository::class);
        $this->app->bind(UserInterface::class, UserRepository::class);
        $this->app->bind(BookingInterface::class, BookingRepository::class);
        $this->app->bind(RoomInterface::class, RoomRepository::class);
    }
}
