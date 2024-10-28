<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Repository\Contracts\AuthInterface;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(AuthInterface $interface, Request $request)
    {
        return $interface->login($request);
    }
}
