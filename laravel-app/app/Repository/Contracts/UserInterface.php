<?php

namespace App\Repository\Contracts;

use Illuminate\Http\Request;

interface UserInterface
{
    public function index(Request $request);
    public function show();
    public function register(Request $request);
}
