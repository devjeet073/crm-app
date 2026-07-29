<?php

namespace Database\Seeders;

use App\Models\AutomatedGreeting;
use App\Models\ComplianceReminder;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AutomationSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('type', 'admin')->first() ?? User::first();

        // 1. Seed Greetings
        AutomatedGreeting::firstOrCreate(
            ['title' => 'Annual Birthday Greeting'],
            [
                'type' => 'birthday',
                'event_date' => null,
                'template_subject' => '🎉 Happy Birthday {first_name}! Best wishes from our team',
                'template_body' => "Dear {name},\n\nWishing you a magnificent birthday filled with joy, prosperity, and success! Thank you for being a valued part of our journey.\n\nWarm regards,\nThe Management Team",
                'target_type' => 'all',
                'status' => 'active',
                'recurring' => true,
                'created_by_id' => $admin?->id,
            ]
        );

        AutomatedGreeting::firstOrCreate(
            ['title' => 'Diwali Festival Greetings'],
            [
                'type' => 'festival',
                'event_date' => '2026-11-08',
                'template_subject' => '🪔 Happy Diwali {first_name}! Wishing you light & prosperity',
                'template_body' => "Dear {name},\n\nMay this Diwali bring happiness, success, and prosperity to you and your family. Wishing you a bright and joyous festival of lights!\n\nBest regards,\nTeam CRM",
                'target_type' => 'all',
                'status' => 'active',
                'recurring' => true,
                'created_by_id' => $admin?->id,
            ]
        );

        AutomatedGreeting::firstOrCreate(
            ['title' => 'New Year 2027 Celebration'],
            [
                'type' => 'festival',
                'event_date' => '2027-01-01',
                'template_subject' => '✨ Happy New Year 2027 {first_name}!',
                'template_body' => "Dear {name},\n\nAs we embark on a new year, we wish you continued success, good health, and grand achievements in 2027!\n\nWarmest wishes,\nOur Company",
                'target_type' => 'all',
                'status' => 'active',
                'recurring' => true,
                'created_by_id' => $admin?->id,
            ]
        );

        // 2. Seed Compliance Reminders (GST, ITR, EMI)
        ComplianceReminder::firstOrCreate(
            ['title' => 'Monthly GSTR-1 Outward Supply Return'],
            [
                'category' => 'gst',
                'due_date' => Carbon::now()->addDays(5)->toDateString(),
                'amount' => 45000.00,
                'risk_level' => 'high',
                'remind_days_before' => 7,
                'recurring_frequency' => 'monthly',
                'status' => 'pending',
                'notes' => 'File monthly sales summary details for GST compliance before 11th of month.',
                'assigned_user_id' => $admin?->id,
                'created_by_id' => $admin?->id,
            ]
        );

        ComplianceReminder::firstOrCreate(
            ['title' => 'GSTR-3B Summary Return & Tax Payment'],
            [
                'category' => 'gst',
                'due_date' => Carbon::now()->addDays(12)->toDateString(),
                'amount' => 125000.00,
                'risk_level' => 'critical',
                'remind_days_before' => 7,
                'recurring_frequency' => 'monthly',
                'status' => 'pending',
                'notes' => 'Critical tax payment deadline to avoid interest charges (18% p.a.).',
                'assigned_user_id' => $admin?->id,
                'created_by_id' => $admin?->id,
            ]
        );

        ComplianceReminder::firstOrCreate(
            ['title' => 'Corporate Income Tax Advance Instalment (ITR)'],
            [
                'category' => 'itr',
                'due_date' => Carbon::now()->addDays(20)->toDateString(),
                'amount' => 350000.00,
                'risk_level' => 'critical',
                'remind_days_before' => 10,
                'recurring_frequency' => 'quarterly',
                'status' => 'pending',
                'notes' => 'Advance Income Tax quarterly instalment filing with tax consultant.',
                'assigned_user_id' => $admin?->id,
                'created_by_id' => $admin?->id,
            ]
        );

        ComplianceReminder::firstOrCreate(
            ['title' => 'Office Space & Infrastructure Lease EMI'],
            [
                'category' => 'emi',
                'due_date' => Carbon::now()->addDays(3)->toDateString(),
                'amount' => 85000.00,
                'risk_level' => 'high',
                'remind_days_before' => 5,
                'recurring_frequency' => 'monthly',
                'status' => 'pending',
                'notes' => 'Monthly lease payment clearance to landlord bank account.',
                'assigned_user_id' => $admin?->id,
                'created_by_id' => $admin?->id,
            ]
        );

        ComplianceReminder::firstOrCreate(
            ['title' => 'Commercial Fleet Vehicle Loan EMI'],
            [
                'category' => 'emi',
                'due_date' => Carbon::now()->subDays(2)->toDateString(), // Overdue example
                'amount' => 28500.00,
                'risk_level' => 'critical',
                'remind_days_before' => 7,
                'recurring_frequency' => 'monthly',
                'status' => 'overdue',
                'notes' => 'Auto-debit mandate clearance for transport vehicle loan EMI.',
                'assigned_user_id' => $admin?->id,
                'created_by_id' => $admin?->id,
            ]
        );
    }
}
