<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'website' => fake()->optional()->url(),
            'type' => fake()->randomElement(['Customer', 'Investor', 'Partner', 'Reseller']),
            'industry' => fake()->optional()->randomElement(['Technology', 'Manufacturing', 'Healthcare', 'Retail', 'Finance']),
            'sic_code' => fake()->optional()->numerify('####'),
            'billing_address_street' => fake()->streetAddress(),
            'billing_address_city' => fake()->city(),
            'billing_address_state' => fake()->state(),
            'billing_address_country' => fake()->country(),
            'billing_address_postal_code' => fake()->postcode(),
            'shipping_address_street' => fake()->streetAddress(),
            'shipping_address_city' => fake()->city(),
            'shipping_address_state' => fake()->state(),
            'shipping_address_country' => fake()->country(),
            'shipping_address_postal_code' => fake()->postcode(),
            'description' => fake()->optional()->paragraph(),
            'is_locked' => false,
            'stream_updated_at' => null,
            'campaign_id' => null,
            'created_by_id' => User::factory(),
            'modified_by_id' => User::factory(),
            'assigned_user_id' => User::factory(),
            'version_number' => 0,
        ];
    }

    /**
     * Indicate that the account is locked from further edits.
     */
    public function locked(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_locked' => true,
        ]);
    }
}
