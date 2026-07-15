<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * ACL Role: a named bundle of permission levels and per-entity/per-field
 * access-control data, assignable to users and teams.
 *
 * Permission column values: 'not-set' | 'yes' | 'no' | 'team' | 'own' | 'all'
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $assignment_permission
 * @property string $user_permission
 * @property string $message_permission
 * @property string $portal_permission
 * @property string $group_email_account_permission
 * @property string $export_permission
 * @property string $mass_update_permission
 * @property string $data_privacy_permission
 * @property string $follower_management_permission
 * @property string $audit_permission
 * @property string $mention_permission
 * @property string $user_calendar_permission
 * @property string $lock_permission
 * @property array|null $data       Per-entity CRUD ACL (e.g. {"Account":{"read":"all","create":"yes"}})
 * @property array|null $field_data Per-field ACL (e.g. {"Account":{"amount":{"read":"yes","edit":"no"}}})
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'name', 'description',
    'assignment_permission', 'user_permission', 'message_permission',
    'portal_permission', 'group_email_account_permission', 'export_permission',
    'mass_update_permission', 'data_privacy_permission', 'follower_management_permission',
    'audit_permission', 'mention_permission', 'user_calendar_permission', 'lock_permission',
    'data', 'field_data',
])]
class Role extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data'       => 'array',
            'field_data' => 'array',
        ];
    }

    /**
     * Users directly assigned this role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user')
            ->using(RoleUser::class)
            ->wherePivotNull('deleted_at');
    }

    /**
     * Teams assigned this role.
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'role_team')
            ->using(RoleTeam::class)
            ->wherePivotNull('deleted_at');
    }

    /**
     * All permission column names.
     *
     * @return string[]
     */
    public static function permissionColumns(): array
    {
        return [
            'assignment_permission',
            'user_permission',
            'message_permission',
            'portal_permission',
            'group_email_account_permission',
            'export_permission',
            'mass_update_permission',
            'data_privacy_permission',
            'follower_management_permission',
            'audit_permission',
            'mention_permission',
            'user_calendar_permission',
            'lock_permission',
        ];
    }

    /**
     * Valid permission level values.
     *
     * @return string[]
     */
    public static function permissionLevels(): array
    {
        return ['not-set', 'yes', 'no', 'team', 'own', 'all'];
    }
}
