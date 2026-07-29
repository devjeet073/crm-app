import { router, usePage } from '@inertiajs/react';
import { Bell, Building2, CheckCheck, Edit3, PlusCircle, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Auth, DatabaseNotification } from '@/types/auth';

export function NotificationDropdown() {
    const page = usePage();
    const auth = page.props.auth as Auth;
    const unreadCount = auth?.unreadNotificationsCount ?? 0;
    const notifications: DatabaseNotification[] = auth?.recentNotifications ?? [];

    const handleMarkAsRead = (id: string, url?: string) => {
        router.post(
            `/notifications/${id}/read`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (url) {
                        router.visit(url);
                    }
                },
            },
        );
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const getActionIcon = (action?: string) => {
        switch (action) {
            case 'created':
                return <PlusCircle className="h-4 w-4 text-emerald-500" />;
            case 'modified':
                return <Edit3 className="h-4 w-4 text-amber-500" />;
            case 'deleted':
                return <Trash2 className="h-4 w-4 text-rose-500" />;
            default:
                return <Building2 className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 cursor-pointer"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5 opacity-80 hover:opacity-100" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="px-1.5 py-0 text-[11px]">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <CheckCheck className="mr-1 h-3.5 w-3.5" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-border">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No unread notifications
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                onClick={() => handleMarkAsRead(n.id, n.data?.url)}
                                className="flex cursor-pointer items-start gap-3 p-3 focus:bg-accent"
                            >
                                <div className="mt-0.5 rounded-md bg-accent/50 p-1.5">
                                    {getActionIcon(n.data?.action)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-xs font-medium leading-none text-foreground">
                                        {n.data?.title || 'Account Notification'}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {n.data?.message}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/70">
                                        {new Date(n.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>

                <div className="border-t border-border p-2 text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => router.visit('/notifications')}
                    >
                        View all notifications
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
