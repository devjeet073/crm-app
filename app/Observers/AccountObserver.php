<?php

namespace App\Observers;

use App\Models\Account;
use App\Services\AccountNotificationService;

class AccountObserver
{
    /**
     * Handle the Account "created" event.
     */
    public function created(Account $account): void
    {
        AccountNotificationService::notifyAccountActivity('created', $account);
    }

    /**
     * Handle the Account "updated" event.
     */
    public function updated(Account $account): void
    {
        // Don't trigger if only stream_updated_at or non-substantive timestamp changed
        $dirty = array_keys($account->getDirty());
        if (count($dirty) === 1 && in_array('stream_updated_at', $dirty, true)) {
            return;
        }

        AccountNotificationService::notifyAccountActivity('modified', $account);
    }

    /**
     * Handle the Account "deleted" event.
     */
    public function deleted(Account $account): void
    {
        AccountNotificationService::notifyAccountActivity('deleted', $account);
    }
}
