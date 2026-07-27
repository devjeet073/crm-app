<?php

use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::inertia('/', 'welcome')->name('home');

if (app()->environment('local', 'testing')) {
    Route::post('/demo-login', [\App\Http\Controllers\DemoLoginController::class, 'login'])->name('demo.login');
}

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('calendar', [CalendarController::class, 'index'])->name('calendar.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/crm.php';
