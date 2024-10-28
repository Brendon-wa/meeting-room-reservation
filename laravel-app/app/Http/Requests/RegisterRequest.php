<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'name' => ['required', 'min: 3', 'max:255'],
            'email' => ['required', 'max:255', 'unique:users,email', 'email'],
            'photo' => [
                'nullable',
                'image',
                'max:1048',
                'mimes:png,jpeg,jpg'
            ],
            'password' => ['required', 'min:8']
        ];
    }
}
