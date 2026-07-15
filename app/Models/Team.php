<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property array|null $position_list  List of valid position labels for team_user.role
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable(['name', 'position_list', 'description'])]
class Team extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'position_list' => 'array',
        ];
    }

    /**
     * Users who are members of this team.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user')
            ->using(TeamUser::class)
            ->withPivot('role')
            ->wherePivotNull('deleted_at');
    }

    /**
     * Roles assigned to this whole team.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_team')
            ->using(RoleTeam::class)
            ->wherePivotNull('deleted_at');
    }
}
