<?php

namespace App\Providers;

use App\Models\AuthLogRecord;
use App\Services\ActivityLogService;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerAuthLogListeners();
    }

    /**
     * Wire AuthLogRecord creation into authentication events.
     */
    protected function registerAuthLogListeners(): void
    {
        Event::listen(
            Login::class,
            function (Login $event) {
                AuthLogRecord::create([
                    'username' => $event->user->email,
                    'ip_address' => request()->ip(),
                    'is_denied' => false,
                    'denial_reason' => null,
                    'request_time' => microtime(true),
                    'request_url' => request()->fullUrl(),
                    'request_method' => request()->method(),
                    'authentication_method' => 'Espo',
                    'user_id' => $event->user->id,
                ]);

                ActivityLogService::log(
                    action: 'login',
                    subject: $event->user,
                    description: 'User logged in',
                    event: 'login'
                );
            }
        );

        Event::listen(
            Failed::class,
            function (Failed $event) {
                AuthLogRecord::create([
                    'username' => $event->credentials['email'] ?? ($event->user?->email ?? null),
                    'ip_address' => request()->ip(),
                    'is_denied' => true,
                    'denial_reason' => 'Invalid credentials',
                    'request_time' => microtime(true),
                    'request_url' => request()->fullUrl(),
                    'request_method' => request()->method(),
                    'authentication_method' => 'Espo',
                    'user_id' => $event->user?->id,
                ]);

                ActivityLogService::log(
                    action: 'failed_login',
                    description: 'Failed login attempt for '.($event->credentials['email'] ?? 'unknown'),
                    event: 'failed_login'
                );
            }
        );

        Event::listen(
            Logout::class,
            function (Logout $event) {
                if ($event->user) {
                    ActivityLogService::log(
                        action: 'logout',
                        subject: $event->user,
                        description: 'User logged out',
                        event: 'logout'
                    );
                }
            }
        );
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
