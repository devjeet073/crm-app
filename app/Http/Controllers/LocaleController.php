<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class LocaleController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $supportedLocales = config('app.available_locales', [
            'en' => 'English',
            'es' => 'Spanish',
            'fr' => 'French',
        ]);

        $validated = $request->validate([
            'locale' => ['required', 'string', 'in:'.implode(',', array_keys($supportedLocales))],
        ]);

        $locale = $validated['locale'];

        session()->put('locale', $locale);
        App::setLocale($locale);

        return back()->withCookie(cookie()->forever('locale', $locale));
    }
}
