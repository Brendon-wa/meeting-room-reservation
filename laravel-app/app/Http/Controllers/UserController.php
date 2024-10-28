<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Service\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    private UserService $user_service;

    public function __construct(UserService $user_service)
    {
        $this->user_service = $user_service;
    }

    public function index(Request $request)
    {
        return $this->user_service->index($request);
    }

    public function show()
    {
        return $this->user_service->show();
    }

    public function register(RegisterRequest $request)
    {
        return $this->user_service->register($request);
    }
}
