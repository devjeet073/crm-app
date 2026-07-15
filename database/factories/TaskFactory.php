<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'status' => 'Not Started',
            'priority' => fake()->randomElement(['Low', 'Normal', 'High', 'Urgent']),
            'date_start' => fake()->optional()->dateTimeBetween('-1 week', 'now'),
            'date_end' => fake()->optional()->dateTimeBetween('now', '+2 weeks'),
            'date_start_date' => null,
            'date_end_date' => null,
            'date_completed' => null,
            'description' => fake()->optional()->paragraph(),
            'stream_updated_at' => null,
            'parent_id' => null,
            'parent_type' => null,
            'account_id' => null,
            'contact_id' => null,
            'email_id' => null,
            'created_by_id' => User::factory(),
            'modified_by_id' => User::factory(),
            'assigned_user_id' => User::factory(),
            'version_number' => 0,
        ];
    }

    /**
     * Indicate that the task has been completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Completed',
            'date_completed' => fake()->dateTimeBetween('-1 week', 'now'),
        ]);
    }
}
