<?php

namespace App\Models;

use Database\Factories\LeadFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $salutation_name
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string|null $middle_name
 * @property string|null $title
 * @property string $status
 * @property string|null $source
 * @property string|null $industry
 * @property float|null $opportunity_amount
 * @property string|null $opportunity_amount_currency
 * @property string|null $website
 * @property string|null $address_street
 * @property string|null $address_city
 * @property string|null $address_state
 * @property string|null $address_country
 * @property string|null $address_postal_code
 * @property bool $do_not_call
 * @property string|null $description
 * @property Carbon|null $converted_at
 * @property string|null $account_name
 * @property Carbon|null $stream_updated_at
 * @property int|null $campaign_id
 * @property int|null $created_account_id
 * @property int|null $created_contact_id
 * @property int|null $created_opportunity_id
 * @property int|null $created_by_id
 * @property int|null $modified_by_id
 * @property int|null $assigned_user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'salutation_name', 'first_name', 'last_name', 'middle_name', 'title',
    'status', 'source', 'industry', 'opportunity_amount', 'opportunity_amount_currency',
    'website', 'address_street', 'address_city', 'address_state', 'address_country', 'address_postal_code',
    'do_not_call', 'description', 'converted_at', 'account_name', 'stream_updated_at',
    'campaign_id', 'created_account_id', 'created_contact_id', 'created_opportunity_id',
    'created_by_id', 'modified_by_id', 'assigned_user_id',
])]
class Lead extends Model
{
    /** @use HasFactory<LeadFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'opportunity_amount' => 'float',
            'do_not_call' => 'boolean',
            'converted_at' => 'datetime',
            'stream_updated_at' => 'datetime',
        ];
    }

    /**
     * The account created from this lead on conversion.
     */
    public function createdAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'created_account_id');
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

    public function calls(): BelongsToMany
    {
        return $this->belongsToMany(Call::class, 'call_lead')
            ->using(CallLead::class)
            ->withPivot('status')
            ->wherePivotNull('deleted_at');
    }

    public function meetings(): BelongsToMany
    {
        return $this->belongsToMany(Meeting::class, 'lead_meeting')
            ->using(LeadMeeting::class)
            ->withPivot('status')
            ->wherePivotNull('deleted_at');
    }
}
