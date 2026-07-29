<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule daily automated greetings and critical risk compliance reminders
Schedule::command('crm:send-greetings')->dailyAt('08:00');
Schedule::command('crm:process-reminders')->dailyAt('08:30');
