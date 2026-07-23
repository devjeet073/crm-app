<?php

namespace App\Traits;

use App\Services\ActivityLogService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function (Model $model) {
            static::logActivity($model, 'created');
        });

        static::updated(function (Model $model) {
            static::logActivity($model, 'updated');
        });

        static::deleted(function (Model $model) {
            static::logActivity($model, 'deleted');
        });

        if (method_exists(static::class, 'restored')) {
            static::restored(function (Model $model) {
                static::logActivity($model, 'restored');
            });
        }
    }

    protected static function logActivity(Model $model, string $action)
    {
        $oldValues = null;
        $newValues = null;

        $ignoredAttributes = $model->getLogIgnoredAttributes();

        if ($action === 'updated') {
            $changes = $model->getChanges();
            $old = Arr::only($model->getOriginal(), array_keys($changes));

            $oldValues = Arr::except($old, $ignoredAttributes);
            $newValues = Arr::except($changes, $ignoredAttributes);
        }

        $className = class_basename($model);
        $description = "{$className} {$action}";

        ActivityLogService::log(
            action: $action,
            subject: $model,
            description: $description,
            oldValues: $oldValues,
            newValues: $newValues
        );
    }

    public function getLogIgnoredAttributes(): array
    {
        return property_exists($this, 'logIgnoredAttributes')
            ? $this->logIgnoredAttributes
            : ['password', 'remember_token', 'two_factor_secret', 'two_factor_recovery_codes'];
    }
}
