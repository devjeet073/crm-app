<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAutomatedGreetingRequest;
use App\Http\Requests\UpdateAutomatedGreetingRequest;
use App\Mail\GreetingMail;
use App\Models\AutomatedGreeting;
use App\Models\EmailConfiguration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

class AutomatedGreetingController extends Controller
{
    public function store(StoreAutomatedGreetingRequest $request): RedirectResponse
    {
        AutomatedGreeting::create($request->validated() + [
            'created_by_id' => $request->user()?->id,
        ]);

        return back()->with('success', 'Greeting template saved successfully.');
    }

    public function update(UpdateAutomatedGreetingRequest $request, AutomatedGreeting $automatedGreeting): RedirectResponse
    {
        $automatedGreeting->update($request->validated());

        return back()->with('success', 'Greeting template updated successfully.');
    }

    public function destroy(AutomatedGreeting $automatedGreeting): RedirectResponse
    {
        $automatedGreeting->delete();

        return back()->with('success', 'Greeting template deleted.');
    }

    public function trigger(): RedirectResponse
    {
        Artisan::call('crm:send-greetings', ['--force' => true]);

        return back()->with('success', 'Automated greetings campaign dispatched successfully.');
    }

    public function test(Request $request, AutomatedGreeting $automatedGreeting): RedirectResponse
    {
        $user = $request->user();
        if (! $user || ! $user->email) {
            return back()->with('error', 'User has no valid email.');
        }

        $subject = '[TEST PREVIEW] '.str_replace(['{name}', '{first_name}'], [$user->name, explode(' ', $user->name)[0]], $automatedGreeting->template_subject);
        $body = str_replace(['{name}', '{first_name}'], [$user->name, explode(' ', $user->name)[0]], $automatedGreeting->template_body);

        $bodyHtml = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;'>
                <div style='text-align: center; margin-bottom: 24px;'>
                    <h1 style='color: #4f46e5; margin-bottom: 8px;'>🎉 {$automatedGreeting->title}</h1>
                    <span style='background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold;'>TEST PREVIEW</span>
                </div>
                <div style='font-size: 16px; line-height: 1.6; color: #334155;'>
                    ".nl2br(e($body)).'
                </div>
            </div>
        ';

        $emailConfig = EmailConfiguration::where('is_active', true)->first();

        if ($emailConfig) {
            $emailConfig->sendMail($user->email, $subject, $bodyHtml);
        } else {
            Mail::to($user->email)->send(new GreetingMail($subject, $bodyHtml));
        }

        return back()->with('success', "Test greeting email sent to {$user->email}.");
    }
}
