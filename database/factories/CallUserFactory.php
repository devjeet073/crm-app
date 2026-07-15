<?php

namespace Database\Factories;

use App\Models\Call;
use App\Models\CallUser;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CallUser>
 */
class CallUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'call_id' => Call::factory(),
            'status' => fake()->randomElement(['None', 'Accepted', 'Declined', 'Tentative']),
        ];
    }
}
