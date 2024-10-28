<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use DatabaseTransactions;

    public function test_register_success()
    {
        $user = User::factory()->make()->getAttributes();

        $response = $this->postJson('/api/register', $user);
        $response->assertSuccessful();
    }

    public function test_if_user_name_size_min_validation()
    {
        $data = User::factory()->make(['name' => 'jo'])->getAttributes();

        $response = $this->postJson('/api/register', $data);
        $response->assertUnprocessable();
    }

    public function test_user_email_validation()
    {
        $data = User::factory()->make(['email' => '128653'])->getAttributes();

        $response = $this->postJson('/api/register', $data);
        $response->assertUnprocessable();
    }
}
