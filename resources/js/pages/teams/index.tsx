import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Users, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { index as teamsIndex, show as teamsShow, create as teamsCreate, destroy as teamsDestroy } from '@/routes/teams';
import type { BreadcrumbItem, Paginated, Team } from '@/types';

type PageProps = {
    teams: Paginated<Team>;
    filters: { search: string | null };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Teams', href: teamsIndex() }];

export default function TeamsIndex({ teams, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => { setSearch(filters.search ?? ''); }, [filters.search]);

    useEffect(() => {
        const next = search.trim();
        if (next === (filters.search ?? '')) return;
        const t = window.setTimeout(() => {
            router.get(teamsIndex.url(), { search: next || undefined }, { preserveState: true, replace: true });
        }, 350);
        return () => window.clearTimeout(t);
    }, [search, filters.search]);

    return (
        <>
            <Head title="Teams" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Teams"
                        description={`${teams.total} team${teams.total !== 1 ? 's' : ''} — group users for record visibility and role assignment`}
                    />
                    <div className="flex items-center gap-2">
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teams…" className="w-52" />
                        <Button asChild>
                            <a href={teamsCreate.url()}>
                                <Plus className="mr-1.5 h-4 w-4" /> New team
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
                                <TableHead className="text-center">Members</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teams.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No teams found.</TableCell>
                                </TableRow>
                            )}
                            {teams.data.map((team) => (
                                <TableRow key={team.id}>
                                    <TableCell>
                                        <a href={teamsShow.url(team)} className="flex items-center gap-2 font-medium hover:underline">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            {team.name}
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{team.description ?? '—'}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{team.users_count ?? 0}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DeleteAlertDialog
                                            trigger={
                                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            }
                                            title={`Delete "${team.name}"?`}
                                            description="All team memberships will be removed. This cannot be undone."
                                            onConfirm={() => router.delete(teamsDestroy.url(team))}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination links={teams.links} />
            </div>
        </>
    );
}

TeamsIndex.layout = { breadcrumbs };
