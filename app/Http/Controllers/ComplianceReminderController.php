<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreComplianceReminderRequest;
use App\Http\Requests\UpdateComplianceReminderRequest;
use App\Models\ComplianceReminder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Artisan;

class ComplianceReminderController extends Controller
{
    public function store(StoreComplianceReminderRequest $request): RedirectResponse
    {
        ComplianceReminder::create($request->validated() + [
            'status' => 'pending',
            'created_by_id' => $request->user()?->id,
        ]);

        return back()->with('success', 'Compliance reminder created successfully.');
    }

    public function update(UpdateComplianceReminderRequest $request, ComplianceReminder $complianceReminder): RedirectResponse
    {
        $complianceReminder->update($request->validated());

        return back()->with('success', 'Compliance reminder updated successfully.');
    }

    public function markAsCompleted(ComplianceReminder $complianceReminder): RedirectResponse
    {
        $complianceReminder->update(['status' => 'completed']);

        // Handle recurring creation if needed
        if ($complianceReminder->recurring_frequency !== 'none') {
            $nextDueDate = match ($complianceReminder->recurring_frequency) {
                'monthly' => $complianceReminder->due_date->addMonth(),
                'quarterly' => $complianceReminder->due_date->addMonths(3),
                'yearly' => $complianceReminder->due_date->addYear(),
                default => null,
            };

            if ($nextDueDate) {
                ComplianceReminder::create([
                    'title' => $complianceReminder->title,
                    'category' => $complianceReminder->category,
                    'due_date' => $nextDueDate,
                    'amount' => $complianceReminder->amount,
                    'risk_level' => $complianceReminder->risk_level,
                    'remind_days_before' => $complianceReminder->remind_days_before,
                    'recurring_frequency' => $complianceReminder->recurring_frequency,
                    'status' => 'pending',
                    'notes' => $complianceReminder->notes,
                    'assigned_user_id' => $complianceReminder->assigned_user_id,
                    'created_by_id' => $complianceReminder->created_by_id,
                ]);
            }
        }

        return back()->with('success', 'Compliance reminder marked as completed.');
    }

    public function destroy(ComplianceReminder $complianceReminder): RedirectResponse
    {
        $complianceReminder->delete();

        return back()->with('success', 'Compliance reminder deleted.');
    }

    public function trigger(): RedirectResponse
    {
        Artisan::call('crm:process-reminders', ['--force' => true]);

        return back()->with('success', 'Compliance reminder scan and notifications triggered successfully.');
    }
}
