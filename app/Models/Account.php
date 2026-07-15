<?php

namespace App\Models;

use Database\Factories\AccountFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $name
 * @property string|null $website
 * @property string|null $type
 * @property string|null $industry
 * @property string|null $sic_code
 * @property string|null $billing_address_street
 * @property string|null $billing_address_city
 * @property string|null $billing_address_state
 * @property string|null $billing_address_country
 * @property string|null $billing_address_postal_code
 * @property string|null $shipping_address_street
 * @property string|null $shipping_address_city
 * @property string|null $shipping_address_state
 * @property string|null $shipping_address_country
 * @property string|null $shipping_address_postal_code
 * @property string|null $description
 * @property bool $is_locked
 * @property Carbon|null $stream_updated_at
 * @property int|null $campaign_id
 * @property int|null $created_by_id
 * @property int|null $modified_by_id
 * @property int|null $assigned_user_id
 * @property int $version_number
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'name', 'website', 'type', 'industry', 'sic_code',
    'billing_address_street', 'billing_address_city', 'billing_address_state',
    'billing_address_country', 'billing_address_postal_code',
    'shipping_address_street', 'shipping_address_city', 'shipping_address_state',
    'shipping_address_country', 'shipping_address_postal_code',
    'description', 'is_locked', 'stream_updated_at', 'campaign_id',
    'created_by_id', 'modified_by_id', 'assigned_user_id', 'version_number',
])]
class Account extends Model
{
    /** @use HasFactory<AccountFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_locked' => 'boolean',
            'stream_updated_at' => 'datetime',
            'version_number' => 'integer',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function modifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'modified_by_id');
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function calls(): HasMany
    {
        return $this->hasMany(Call::class);
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Leads converted into this account.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'created_account_id');
    }
}
