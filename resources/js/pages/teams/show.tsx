import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2, Users, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { index as teamsIndex, edit as teamsEdit, destroy as teamsDestroy } from '@/routes/teams';
import { assignUser as teamsAssignUser, revokeUser as teamsRevokeUser } from '@/routes/teams';
import type { BreadcrumbItem, Team, CrmUser, Role } from '@/types';

type PageProps = {
    team: Team & { users: (CrmUser & { pivot: { role: string | null } })[]; roles: Role[] };
};

export default function TeamShow({ team }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teams', href: teamsIndex() },
        { title: team.name, href: '' },
    ];

    const [assignUserId, setAssignUserId] = useState('');
    const [assignUserRole, setAssignUserRole] = useState('');

    function handleAssignUser(e: React.FormEvent) {
        e.preventDefault();
        if (!assignUserId) return;
        router.post(teamsAssignUser.url(team), { user_id: assignUserId, role: assignUserRole || null }, {
            preserveScroll: true,
            onSuccess: () => { setAssignUserId(''); setAssignUserRole(''); },
        });
    }

    return (
        <>
            <Head title={`Team: ${team.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading title={team.name} description={team.description ?? 'No description'} />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <a href={teamsEdit.url(team)}><Pencil className="mr-1.5 h-4 w-4" /> Edit</a>
                        </Button>
                        <DeleteAlertDialog
                            trigger={<Button variant="destructive"><Trash2 className="mr-1.5 h-4 w-4" /> Delete</Button>}
                            title={`Delete "${team.name}"?`}
                            description="All team memberships will be permanently removed."
                            onConfirm={() => router.delete(teamsDestroy.url(team), { onSuccess: () => router.visit(teamsIndex.url()) })}
                        />
                    </div>
                </div>

                {/* Positions */}
                {team.position_list && team.position_list.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-muted-foreground">Positions:</span>
                        {team.position_list.map((pos) => (
                            <Badge key={pos} variant="outline">{pos}</Badge>
                        ))}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Members */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-4 w-4" /> Members ({team.users.length})
                            </CardTitle>
                            <CardDescription>Users belonging to this team</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <form onSubmit={handleAssignUser} className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={assignUserId}
                                        onChange={(e) => setAssignUserId(e.target.value)}
                                        placeholder="User ID…"
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                                    />
                                    <input
                                        type="text"
                                        value={assignUserRole}
                                        onChange={(e) => setAssignUserRole(e.target.value)}
                                        placeholder="Position (optional)"
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                                    />
                                </div>
                                <Button type="submit" size="sm" className="w-full">Add Member</Button>
                            </form>
                            <Separator />
                            {team.users.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No members yet.</p>
                            ) : (
                                <div className="space-y-1">
                                    {team.users.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between rounded-md p-1.5 hover:bg-muted/50">
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.pivot.role ?? 'No position'} · {user.email}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost" size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => router.delete(teamsRevokeUser.url(team), { data: { user_id: user.id }, preserveScroll: true })}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Roles */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Assigned Roles ({team.roles.length})
                            </CardTitle>
                            <CardDescription>ACL roles applied to this team's members</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {team.roles.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No roles assigned to this team.</p>
                            ) : (
                                <div className="space-y-1">
                                    {team.roles.map((role) => (
                                        <div key={role.id} className="flex items-center gap-2 rounded-md border px-3 py-2">
                                            <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm font-medium">{role.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

TeamShow.layout = { breadcrumbs: [] };
