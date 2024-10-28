<?php

declare(strict_types=1);

namespace App\Service;

use App\Repository\Contracts\UserInterface;
use Illuminate\Http\Request;

class UserService
{
    private UserInterface $userRepository;

    public function __construct(UserInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function index(Request $request)
    {
        return $this->userRepository->index($request);
    }

    public function show()
    {
        return $this->userRepository->show();
    }

    public function register(Request $request)
    {
        return $this->userRepository->register($request);
    }
}
