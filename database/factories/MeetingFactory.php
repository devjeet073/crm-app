<?php

namespace Database\Factories;

use App\Models\Meeting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Meeting>
 */
class MeetingFactory extends Factory
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
            'date_end' => fn (array $attributes) => Carbon::parse($attributes['date_start'])->addHour(),
            'is_all_day' => false,
            'description' => fake()->optional()->paragraph(),
            'uid' => fake()->optional()->uuid(),
            'join_url' => fake()->optional()->url(),
            'external_service' => fake()->optional()->randomElement(['Zoom', 'Google Meet', 'Teams']),
            'date_start_date' => null,
            'date_end_date' => null,
            'stream_updated_at' => null,
            'parent_id' => null,
            'parent_type' => null,
            'account_id' => null,
            'created_by_id' => User::factory(),
            'modified_by_id' => User::factory(),
            'assigned_user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the meeting spans the whole day.
     */
    public function allDay(): static
    {
        return $this->state(function (array $attributes) {
            $date = Carbon::parse($attributes['date_start'])->startOfDay();

            return [
                'is_all_day' => true,
                'date_start' => $date,
                'date_end' => $date->copy()->endOfDay(),
                'date_start_date' => $date->toDateString(),
                'date_end_date' => $date->toDateString(),
            ];
        });
    }
}
