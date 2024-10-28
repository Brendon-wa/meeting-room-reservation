<?php

namespace App\Repository\Contracts;

use Illuminate\Http\Request;

interface AuthInterface
{
    public function login(Request $request);
}
