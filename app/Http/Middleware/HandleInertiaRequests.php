<?php

namespace App\Http\Middleware;

use App\Services\NavigationService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $navigationService = app(NavigationService::class);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'role_name' => $request->user()->roles()->count() > 0
                        ? $request->user()->roles->pluck('name')->join(', ')
                        : ucfirst($request->user()->type),
                ]) : null,
                'isAdmin' => $request->user()?->isAdmin() ?? false,
                'module_permissions' => $request->user() ? collect(['Accounts', 'Contacts', 'Leads', 'Tasks', 'Documents'])
                    ->mapWithKeys(function ($module) use ($request) {
                        $user = $request->user();

                        return [$module => [
                            'view' => $user->canViewModule($module),
                            'insert' => $user->canInsertModule($module),
                            'update' => $user->canUpdateModule($module),
                            'delete' => $user->canDeleteModule($module),
                        ]];
                    })->toArray() : null,
            ],
            'sidebarMenu' => $navigationService->getMenuForUser($request->user()),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => app()->getLocale(),
            'locales' => config('app.available_locales', ['en' => 'English']),
            'translations' => $this->getTranslations(app()->getLocale()),
        ];
    }

    /**
     * Load JSON and PHP translation strings for the given locale.
     */
    protected function getTranslations(string $locale): array
    {
        $translations = [];

        $jsonFile = lang_path("{$locale}.json");
        if (file_exists($jsonFile)) {
            $jsonContent = json_decode((string) file_get_contents($jsonFile), true);
            if (is_array($jsonContent)) {
                $translations = array_merge($translations, $jsonContent);
            }
        }

        $phpDir = lang_path($locale);
        if (is_dir($phpDir)) {
            foreach (glob("{$phpDir}/*.php") as $file) {
                $group = pathinfo($file, PATHINFO_FILENAME);
                $content = require $file;
                if (is_array($content)) {
                    foreach (Arr::dot($content) as $key => $value) {
                        $translations["{$group}.{$key}"] = $value;
                    }
                }
            }
        }

        return $translations;
    }
}
