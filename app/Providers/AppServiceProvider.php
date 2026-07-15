<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
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
        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Auth\Events\Login::class,
            function (\Illuminate\Auth\Events\Login $event) {
                \App\Models\AuthLogRecord::create([
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
            }
        );

        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Auth\Events\Failed::class,
            function (\Illuminate\Auth\Events\Failed $event) {
                \App\Models\AuthLogRecord::create([
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
