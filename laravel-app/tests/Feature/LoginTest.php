<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use DatabaseTransactions;

    public function test_user_login_validation()
    {
        $user = User::factory()->make()->getAttributes();

        $response = $this->postJson('/api/register', $user);
        $response->assertSuccessful();

        $responseLogin = $this->postJson('/api/login', ['email' => $user['email'], 'password' => '123456789']);
        $responseLogin->assertSuccessful();
    }

    public function test_user_login_invalid()
    {
        $user = User::factory()->make()->getAttributes();

        $response = $this->postJson('/api/register', $user);
        $response->assertSuccessful();

        $responseLogin = $this->postJson('/api/login', ['email' => $user['email'], 'password' => 'incorrect']);
        $responseLogin->assertUnauthorized();
    }


    public function testLoginReturnsTokenForValidCredentials()
    {
        $user = User::factory()->create([
            'password' => bcrypt($password = 'password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'token_type' => 'Bearer',
                'expires_in' => 60 * 24,
            ])
            ->assertJsonStructure(['access_token']);
    }

    public function testLoginReturns404ForNonExistentUser()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(404)
            ->assertJson(['message' => 'User not found']);
    }

    public function testLoginReturns401ForInvalidPassword()
    {
        $user = User::factory()->create([
            'password' => bcrypt($password = 'password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Unauthorized']);
    }

    public function testLoginReturnsCorrectTokenStructure()
    {
        $user = User::factory()->create(['password' => bcrypt('password')]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'expires_in',
            ]);
    }
}
