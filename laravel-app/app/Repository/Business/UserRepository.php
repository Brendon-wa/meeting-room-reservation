<?php

namespace App\Repository\Business;

use App\Models\User;
use App\Repository\Contracts\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserRepository implements UserInterface
{
    protected $model = User::class;

    public function index(Request $request)
    {
        try {
            $users = User::all()->except(1);
            return response()->json(['data' => $users], 200);
        } catch (\Throwable $th) {
            return response()->json(['Error' => $th->getMessage()], 500);
        }
    }

    public function show()
    {
        $user = Auth::user();
        if ($user) return response()->json(['data' => $user], 200);
        return response()->json(['Error' => 'Unauthorized'], 401);
    }

    public function register(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->all();
            $model = new $this->model();
            $model->fill($data);
            $model->save();
            DB::commit();

            return response()->json(['data' => $model, 'message' => 'Salvo com sucesso'], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['Error' => $th->getMessage()], 500);
        }
    }
}
