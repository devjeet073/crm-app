<?php

namespace Database\Factories;

use App\Models\Reminder;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Reminder>
 */
class ReminderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'remind_at' => fake()->dateTimeBetween('now', '+1 week'),
            'start_at' => fn (array $attributes) => Carbon::parse($attributes['remind_at'])->addMinutes(15),
            'type' => fake()->randomElement(['Popup', 'Email']),
            'seconds' => fake()->randomElement([0, 300, 900, 3600]),
            'is_submitted' => false,
            'user_id' => User::factory(),
            'entity_id' => null,
            'entity_type' => null,
        ];
    }

    /**
     * Indicate that the reminder has already been dispatched.
     */
    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_submitted' => true,
        ]);
    }
}
