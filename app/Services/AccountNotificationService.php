<?php

namespace App\Services;

use App\Models\Account;
use App\Models\User;
use App\Notifications\AccountActivityNotification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Notification;

class AccountNotificationService
{
    /**
     * Resolve all distinct users who are admins or superiors.
     *
     * @return Collection<int, User>
     */
    public static function getAdminsAndSuperiors(?User $actor = null, ?Account $account = null): Collection
    {
        // 1. Admin users (type === 'admin')
        $admins = User::where('type', 'admin')->where('is_active', true)->get();

        // 2. Users with Manager/Admin/Leader roles
        $managers = User::where('is_active', true)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'like', '%Manager%')
                    ->orWhere('name', 'like', '%Leader%')
                    ->orWhere('name', 'like', '%Superior%')
                    ->orWhere('name', 'like', '%Admin%');
            })->get();

        // 3. Team superiors for actor or assigned user
        $teamSuperiors = collect();
        $relevantUserIds = array_filter([
            $actor?->id,
            $account?->assigned_user_id,
            $account?->created_by_id,
        ]);

        if (! empty($relevantUserIds)) {
            $teamSuperiors = User::where('is_active', true)
                ->whereHas('teams', function ($query) use ($relevantUserIds) {
                    $query->whereHas('users', function ($q) use ($relevantUserIds) {
                        $q->whereIn('users.id', $relevantUserIds);
                    })->whereIn('team_user.role', ['manager', 'leader', 'superior', 'head', 'lead', 'Manager', 'Leader']);
                })->get();
        }

        return $admins
            ->merge($managers)
            ->merge($teamSuperiors)
            ->unique('id')
            ->values();
    }

    /**
     * Dispatch account activity notifications to all admins and superiors.
     */
    public static function notifyAccountActivity(string $action, Account $account, ?User $actor = null): void
    {
        $actor = $actor ?? auth()->user();
        $recipients = self::getAdminsAndSuperiors($actor, $account);

        if ($recipients->isNotEmpty()) {
            Notification::send($recipients, new AccountActivityNotification($action, $account, $actor));
        }
    }
}
