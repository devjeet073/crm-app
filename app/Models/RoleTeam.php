<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Pivot model for the role_team junction table.
 *
 * @property int $id
 * @property int $role_id
 * @property int $team_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 */
class RoleTeam extends Pivot
{
    use SoftDeletes;

    public $incrementing = true;

    protected $table = 'role_team';
}
