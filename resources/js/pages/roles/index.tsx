import { Head, router } from '@inertiajs/react';
import { Plus, Shield, Trash2, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { index as rolesIndex, show as rolesShow, create as rolesCreate, destroy as rolesDestroy } from '@/routes/roles';
import type { BreadcrumbItem, Paginated, Role } from '@/types';

type PageProps = {
    roles: Paginated<Role>;
    filters: { search: string | null };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles', href: rolesIndex() }];

export default function RolesIndex({ roles, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        setSearch(filters.search ?? '');
    }, [filters.search]);

    useEffect(() => {
        const next = search.trim();

        if (next === (filters.search ?? '')) {
            return;
        }

        const t = window.setTimeout(() => {
            router.get(rolesIndex.url(), { search: next || undefined }, { preserveState: true, replace: true });
        }, 350);

        return () => window.clearTimeout(t);
    }, [search, filters.search]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key !== 'n' || e.metaKey || e.ctrlKey || e.altKey) {
                return;
            }

            const tag = (e.target as HTMLElement)?.tagName;

            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
                return;
            }

            e.preventDefault();
            router.visit(rolesCreate.url());
        },
        [],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            <Head title="Roles" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Roles"
                        description={`${roles.total} role${roles.total !== 1 ? 's' : ''} — define permission levels across the system`}
                    />
                    <div className="flex items-center gap-2">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search roles…"
                            className="w-52"
                        />
                        <Button asChild>
                            <a href={rolesCreate.url()}>
                                <Plus className="mr-1.5 h-4 w-4" />
                                New role
                                <kbd className="ml-2 hidden items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                    <span className="text-xs">N</span>
                                </kbd>
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Users</TableHead>
                                <TableHead className="text-center">Teams</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                        No roles found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {roles.data.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell>
                                        <a
                                            href={rolesShow.url(role)}
                                            className="flex items-center gap-2 font-medium hover:underline"
                                        >
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            {role.name}
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {role.description ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{role.users_count ?? 0}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{role.teams_count ?? 0}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={rolesShow.url(role)}>
                                                    <Users className="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <DeleteAlertDialog
                                                trigger={
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                }
                                                title={`Delete "${role.name}"?`}
                                                description="This will remove the role from all users and teams. This action cannot be undone."
                                                onConfirm={() => router.delete(rolesDestroy.url(role))}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination links={roles.links} />
            </div>
        </>
    );
}

RolesIndex.layout = { breadcrumbs };
