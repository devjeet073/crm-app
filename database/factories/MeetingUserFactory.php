<?php

namespace Database\Factories;

use App\Models\Meeting;
use App\Models\MeetingUser;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MeetingUser>
 */
class MeetingUserFactory extends Factory
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
            'meeting_id' => Meeting::factory(),
            'status' => fake()->randomElement(['None', 'Accepted', 'Declined', 'Tentative']),
        ];
    }
}
