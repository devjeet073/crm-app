<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssignRoleToTeamRequest;
use App\Http\Requests\AssignRoleToUserRequest;
use App\Http\Requests\AssignUserToTeamRequest;
use App\Http\Requests\RevokeRoleFromTeamRequest;
use App\Http\Requests\RevokeRoleFromUserRequest;
use App\Http\Requests\RevokeUserFromTeamRequest;
use App\Models\Role;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

/**
 * Handles assign/revoke operations for:
 *  - roles  ↔ users
 *  - roles  ↔ teams
 *  - teams  ↔ users
 */
class AccessManagementController extends Controller
{
    // ── Role ↔ User ─────────────────────────────────────────────────────────

    public function assignRoleToUser(AssignRoleToUserRequest $request, Role $role): RedirectResponse
    {
        $role->users()->syncWithoutDetaching($request->validated('user_ids'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role assigned to users.')]);

        return back();
    }

    public function revokeRoleFromUser(RevokeRoleFromUserRequest $request, Role $role): RedirectResponse
    {
        $role->users()->detach($request->validated('user_id'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role revoked from user.')]);

        return back();
    }

    // ── Role ↔ Team ─────────────────────────────────────────────────────────

    public function assignRoleToTeam(AssignRoleToTeamRequest $request, Role $role): RedirectResponse
    {
        $role->teams()->syncWithoutDetaching([$request->validated('team_id')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role assigned to team.')]);

        return back();
    }

    public function revokeRoleFromTeam(RevokeRoleFromTeamRequest $request, Role $role): RedirectResponse
    {
        $role->teams()->detach($request->validated('team_id'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role revoked from team.')]);

        return back();
    }

    // ── Team ↔ User ─────────────────────────────────────────────────────────

    public function assignUserToTeam(AssignUserToTeamRequest $request, Team $team): RedirectResponse
    {
        $team->users()->syncWithoutDetaching([
            $request->validated('user_id') => ['role' => $request->validated('role')],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User added to team.')]);

        return back();
    }

    public function revokeUserFromTeam(RevokeUserFromTeamRequest $request, Team $team): RedirectResponse
    {
        $team->users()->detach($request->validated('user_id'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User removed from team.')]);

        return back();
    }
}
