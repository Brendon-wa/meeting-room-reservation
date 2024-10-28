<?php

namespace App\Providers;

use App\Repository\Business\AuthRepository;
use App\Repository\Business\UserRepository;
use App\Repository\Contracts\AuthInterface;
use App\Repository\Contracts\UserInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->app->bind(AuthInterface::class, AuthRepository::class);
        $this->app->bind(UserInterface::class, UserRepository::class);
    }
}
