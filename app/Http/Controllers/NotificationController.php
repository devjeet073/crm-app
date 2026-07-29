<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display a listing of user notifications.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->paginate(15);

        if ($request->wantsJson()) {
            return response()->json([
                'notifications' => $notifications,
                'unread_count' => $request->user()->unreadNotifications()->count(),
            ]);
        }

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'unreadCount' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        $notification->markAsRead();

        if ($request->wantsJson()) {
            return response()->json(['message' => __('Notification marked as read.')]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Notification marked as read.')]);

        return back();
    }

    /**
     * Mark all unread notifications as read.
     */
    public function markAllAsRead(Request $request): RedirectResponse|JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        if ($request->wantsJson()) {
            return response()->json(['message' => __('All notifications marked as read.')]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('All notifications marked as read.')]);

        return back();
    }
}
