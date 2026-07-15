<?php

namespace Database\Factories;

use App\Models\Call;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Call>
 */
class CallFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(4),
            'status' => 'Planned',
            'date_start' => fake()->dateTimeBetween('-1 week', '+2 weeks'),
            'date_end' => fn (array $attributes) => Carbon::parse($attributes['date_start'])->addMinutes(30),
            'direction' => fake()->randomElement(['Inbound', 'Outbound']),
            'description' => fake()->optional()->paragraph(),
            'uid' => fake()->optional()->uuid(),
            'parent_id' => null,
            'parent_type' => null,
            'account_id' => null,
            'created_by_id' => User::factory(),
            'modified_by_id' => User::factory(),
            'assigned_user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the call has already taken place.
     */
    public function held(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Held',
            'date_start' => fake()->dateTimeBetween('-2 weeks', '-1 day'),
        ]);
    }
}
