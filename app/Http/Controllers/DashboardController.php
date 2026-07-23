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
        $stats = [
            'accounts' => Account::count(),
            'leads' => Lead::count(),
            'tasks' => Task::where('status', '!=', 'Completed')->count(),
            'documents' => Document::count(),
        ];

        $startDate = Carbon::now()->subDays(89)->startOfDay();

        // Group by date efficiently using DB queries
        $leads = Lead::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $accounts = Account::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $tasks = Task::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

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
