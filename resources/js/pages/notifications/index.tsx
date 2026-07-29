import { Head, router } from '@inertiajs/react';
import { Bell, Building2, CheckCheck, Edit3, PlusCircle, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types';
import type { DatabaseNotification } from '@/types/auth';

type Props = {
    notifications: {
        data: DatabaseNotification[];
        current_page: number;
        last_page: number;
        total: number;
    };
    unreadCount: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifications', href: '/notifications' },
];

export default function NotificationsIndex({ notifications, unreadCount }: Props) {
    const handleMarkAsRead = (id: string) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const getActionIcon = (action?: string) => {
        switch (action) {
            case 'created':
                return <PlusCircle className="h-5 w-5 text-emerald-500" />;
            case 'modified':
                return <Edit3 className="h-5 w-5 text-amber-500" />;
            case 'deleted':
                return <Trash2 className="h-5 w-5 text-rose-500" />;
            default:
                return <Building2 className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />

            <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                        <p className="text-sm text-muted-foreground">
                            Account activity alerts and system updates.
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark all as read ({unreadCount})
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <Bell className="h-5 w-5 text-primary" />
                            All Alerts
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {unreadCount} unread
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {notifications.data.length === 0 ? (
                            <div className="p-12 text-center text-sm text-muted-foreground">
                                No notifications found.
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {notifications.data.map((n) => {
                                    const isUnread = !n.read_at;
                                    return (
                                        <div
                                            key={n.id}
                                            className={`flex items-start justify-between gap-4 p-4 transition-colors ${
                                                isUnread ? 'bg-accent/30 hover:bg-accent/50' : 'hover:bg-accent/20'
                                            }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 rounded-lg border border-border bg-background p-2 shadow-xs">
                                                    {getActionIcon(n.data?.action)}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-semibold text-foreground">
                                                            {n.data?.title || 'Account Notification'}
                                                        </h4>
                                                        {isUnread && (
                                                            <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {n.data?.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/70">
                                                        {new Date(n.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {n.data?.url && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (isUnread) handleMarkAsRead(n.id);
                                                            router.visit(n.data.url!);
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                )}
                                                {isUnread && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(n.id)}
                                                    >
                                                        Mark read
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
