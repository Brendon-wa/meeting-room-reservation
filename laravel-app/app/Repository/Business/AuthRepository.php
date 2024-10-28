<?php

namespace App\Repository\Business;

use App\Models\User;
use App\Repository\Contracts\AuthInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthRepository implements AuthInterface
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $request->email)->first();

        if (!$user) return response()->json(['message' => 'User not found'], 404);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('MeetRoomBooking')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 60 * 24,
            ]);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }

    protected function respondWithToken($token)
    {
        dd($token);
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60
        ]);
    }
}
