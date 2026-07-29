<?php

namespace App\Http\Controllers;

use App\Models\AutomatedGreeting;
use App\Models\ComplianceReminder;
use App\Models\SentAutomationLog;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AutomationDashboardController extends Controller
{
    public function index(): Response
    {
        $greetings = AutomatedGreeting::with('creator:id,name')
            ->latest()
            ->get();

        $complianceReminders = ComplianceReminder::with(['assignedUser:id,name,email', 'creator:id,name'])
            ->orderByRaw("CASE status WHEN 'overdue' THEN 1 WHEN 'pending' THEN 2 WHEN 'reminded' THEN 3 WHEN 'completed' THEN 4 ELSE 5 END")
            ->orderBy('due_date', 'asc')
            ->get();

        $logs = SentAutomationLog::latest()
            ->take(50)
            ->get();

        $users = User::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        $stats = [
            'active_greetings' => AutomatedGreeting::where('status', 'active')->count(),
            'total_greetings_sent' => SentAutomationLog::where('type', 'greeting')->where('status', 'sent')->count(),
            'pending_compliance' => ComplianceReminder::whereIn('status', ['pending', 'reminded'])->count(),
            'overdue_compliance' => ComplianceReminder::where('status', 'overdue')->count(),
            'critical_risk_count' => ComplianceReminder::whereIn('status', ['pending', 'reminded', 'overdue'])->where('risk_level', 'critical')->count(),
            'total_gst_due' => ComplianceReminder::where('category', 'gst')->whereIn('status', ['pending', 'reminded', 'overdue'])->sum('amount'),
            'total_emi_due' => ComplianceReminder::where('category', 'emi')->whereIn('status', ['pending', 'reminded', 'overdue'])->sum('amount'),
        ];

        return Inertia::render('automations/index', [
            'greetings' => $greetings,
            'complianceReminders' => $complianceReminders,
            'logs' => $logs,
            'users' => $users,
            'stats' => $stats,
        ]);
    }
}
