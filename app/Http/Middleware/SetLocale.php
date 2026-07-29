<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supportedLocales = config('app.available_locales', [
            'en' => 'English',
            'es' => 'Spanish',
            'fr' => 'French',
        ]);

        $localeKeys = array_keys($supportedLocales);

        $locale = $request->input('lang')
            ?? $request->cookie('locale')
            ?? $request->session()->get('locale')
            ?? $request->getPreferredLanguage($localeKeys)
            ?? config('app.locale', 'en');

        if (! in_array($locale, $localeKeys, true)) {
            $locale = config('app.locale', 'en');
        }

        App::setLocale($locale);
        $request->session()->put('locale', $locale);

        return $next($request);
    }
}
