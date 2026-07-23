<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString() ?: null;
        $user_id = $request->input('user_id');
        $action = $request->input('action');
        $type = $request->input('subject_type');
        $sort = $request->string('sort')->toString() ?: 'desc';

        $logs = ActivityLog::query()
            ->with(['user', 'subject'])
            ->when($search, fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('description', 'like', "%{$s}%")
                    ->orWhere('event', 'like', "%{$s}%")
                    ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"));
            }))
            ->when($user_id, fn ($q, $u) => $q->where('user_id', $u))
            ->when($action, fn ($q, $a) => $q->where('action', $a))
            ->when($type, fn ($q, $t) => $q->where('subject_type', $t))
            ->orderBy('created_at', $sort === 'asc' ? 'asc' : 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('activity-logs/index', [
            'logs' => $logs,
            'filters' => [
                'search' => $search,
                'user_id' => $user_id,
                'action' => $action,
                'subject_type' => $type,
                'sort' => $sort,
            ],
            'options' => [
                'actions' => ActivityLog::distinct('action')->pluck('action'),
                'types' => ActivityLog::whereNotNull('subject_type')->distinct('subject_type')->pluck('subject_type'),
                'users' => User::select('id', 'name')->orderBy('name')->get(),
            ],
        ]);
    }
}
