<?php

namespace Database\Factories;

use App\Models\ContactMeeting;
use App\Models\Meeting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactMeeting>
 */
class ContactMeetingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // No `Contact` model exists in this app yet; fake a plausible foreign id.
            'contact_id' => fake()->numberBetween(1, 1000),
            'meeting_id' => Meeting::factory(),
            'status' => fake()->randomElement(['None', 'Accepted', 'Declined', 'Tentative']),
        ];
    }
}
