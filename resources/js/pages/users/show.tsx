import { Head, router, setLayoutProps } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowLeft,
    Pencil,
    Shield,
    Users,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Mail,
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { SendEmailDrawer, type EmailConfig } from '@/components/send-email-drawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { getInitials } from '@/lib/utils';
import {
    index as usersIndex,
    edit as usersEdit,
    show as usersShow,
} from '@/routes/users';
import type {
    BreadcrumbItem,
    CrmUser,
    AuthLogRecord,
    Role,
    Team,
} from '@/types';

type PageProps = {
    user: CrmUser & {
        roles: Role[];
        teams: Team[];
        auth_log_records: AuthLogRecord[];
    };
    emailConfigurations?: EmailConfig[];
};

const TYPE_BADGE: Record<
    string,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    admin: 'default',
    regular: 'secondary',
    portal: 'outline',
    api: 'outline',
    system: 'destructive',
};

export default function UserShow({ user, emailConfigurations = [] }: PageProps) {
    const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: usersIndex() },
        { title: user.name, href: usersShow.url(user) },
    ];

    setLayoutProps({ breadcrumbs });

    return (
        <>
            <Head title={user.name} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 text-xl font-semibold">
                            <AvatarImage
                                src={user.avatar_url ?? undefined}
                                alt={user.name}
                            />
                            <AvatarFallback
                                style={{
                                    backgroundColor:
                                        user.avatar_color ?? '#6366f1',
                                }}
                                className="text-white"
                            >
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <Heading
                                title={user.name}
                                description={user.title ?? user.email}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(usersIndex.url())}
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => setIsEmailDrawerOpen(true)}
                        >
                            <Mail className="mr-1.5 h-4 w-4" /> Send Email
                        </Button>
                        {user.is_active ? (
                            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                                <CheckCircle2 className="h-4 w-4" /> Active
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <XCircle className="h-4 w-4" /> Inactive
                            </span>
                        )}
                        <Badge variant={TYPE_BADGE[user.type] ?? 'secondary'}>
                            {user.type}
                        </Badge>
                        <Button variant="outline" asChild>
                            <a href={usersEdit.url(user)}>
                                <Pencil className="mr-1.5 h-4 w-4" /> Edit
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">
                                    Email
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsEmailDrawerOpen(true)}
                                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                                >
                                    <Mail className="h-3.5 w-3.5" />
                                    {user.email}
                                </button>
                            </div>
                            {[
                                ['Title', user.title],
                                ['Salutation', user.salutation_name],
                                ['Middle Name', user.middle_name],
                                ['Gender', user.gender],
                                ['Default Team', user.default_team?.name],
                                ['User Type', user.type],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex justify-between gap-2"
                                >
                                    <span className="text-muted-foreground">
                                        {label}
                                    </span>
                                    <span className="text-right font-medium">
                                        {value ?? '—'}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Roles */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Roles (
                                {user.roles.length})
                            </CardTitle>
                            <CardDescription>
                                Directly assigned ACL roles
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.roles.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No roles assigned.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {user.roles.map((role) => (
                                        <div
                                            key={role.id}
                                            className="flex items-center gap-2 rounded-md border px-3 py-2"
                                        >
                                            <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                                {role.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Teams */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-4 w-4" /> Teams (
                                {user.teams.length})
                            </CardTitle>
                            <CardDescription>
                                Teams this user belongs to
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.teams.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No teams assigned.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {user.teams.map((team) => (
                                        <div
                                            key={team.id}
                                            className="flex items-center gap-2 rounded-md border px-3 py-2"
                                        >
                                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                                {team.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Auth Log */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Recent Login Activity
                        </CardTitle>
                        <CardDescription>
                            Last 20 authentication attempts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user.auth_log_records.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No login activity recorded.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {user.auth_log_records.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            {log.is_denied ? (
                                                <AlertCircle className="h-4 w-4 text-destructive" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            )}
                                            <div>
                                                <p className="font-medium">
                                                    {log.is_denied
                                                        ? `Denied — ${log.denial_reason ?? 'unknown reason'}`
                                                        : 'Successful login'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {log.ip_address} ·{' '}
                                                    {log.request_method}{' '}
                                                    {log.request_url}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                                            {format(
                                                new Date(log.created_at),
                                                'dd MMM HH:mm',
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <SendEmailDrawer
                    open={isEmailDrawerOpen}
                    onOpenChange={setIsEmailDrawerOpen}
                    recipient={{ name: user.name, email: user.email }}
                    emailConfigurations={emailConfigurations}
                />
            </div>
        </>
    );
}
