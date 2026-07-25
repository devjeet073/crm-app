<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Document;
use App\Models\Lead;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $canViewAccounts = $isAdmin || $user->canViewModule('Accounts');
        $canViewLeads = $isAdmin || $user->canViewModule('Leads');
        $canViewTasks = $isAdmin || $user->canViewModule('Tasks');
        $canViewDocuments = $isAdmin || $user->canViewModule('Documents');

        $stats = [
            'accounts' => $canViewAccounts ? Account::count() : 0,
            'leads' => $canViewLeads ? Lead::count() : 0,
            'tasks' => $canViewTasks ? Task::where('status', '!=', 'Completed')->count() : 0,
            'documents' => $canViewDocuments ? Document::count() : 0,
        ];

        $startDate = Carbon::now()->subDays(89)->startOfDay();

        // Group by date efficiently using DB queries
        $leads = $canViewLeads ? Lead::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date') : collect();

        $accounts = $canViewAccounts ? Account::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date') : collect();

        $tasks = $canViewTasks ? Task::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date') : collect();

        $graphData = [];
        for ($i = 89; $i >= 0; $i--) {
            $dateStr = Carbon::now()->subDays($i)->format('Y-m-d');

            $graphData[] = [
                'date' => $dateStr,
                'leads' => $leads->get($dateStr, 0),
                'accounts' => $accounts->get($dateStr, 0),
                'tasks' => $tasks->get($dateStr, 0),
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'graphData' => $graphData,
        ]);
    }
}
