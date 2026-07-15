<?php

namespace Database\Factories;

use App\Models\LeadMeeting;
use App\Models\Meeting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LeadMeeting>
 */
class LeadMeetingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // No `Lead` model exists in this app yet; fake a plausible foreign id.
            'lead_id' => fake()->numberBetween(1, 1000),
            'meeting_id' => Meeting::factory(),
            'status' => fake()->randomElement(['None', 'Accepted', 'Declined', 'Tentative']),
        ];
    }
}
