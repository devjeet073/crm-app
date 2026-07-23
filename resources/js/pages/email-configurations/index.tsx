import { Head, router } from '@inertiajs/react';
import { Mail, Plus, Trash2, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { index as configsIndex, show as configsShow, create as configsCreate, destroy as configsDestroy } from '@/routes/email-configurations';
import type { BreadcrumbItem, Paginated } from '@/types';

export type EmailConfiguration = {
    id: number;
    name: string;
    mailer: string;
    host: string | null;
    port: number | null;
    encryption: string | null;
    username: string | null;
    from_address: string;
    from_name: string | null;
    timeout: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

type PageProps = {
    configs: Paginated<EmailConfiguration>;
    filters: { search: string | null };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Email Configurations', href: configsIndex() }];

export default function EmailConfigurationsIndex({ configs, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        const next = search.trim();

        if (next === (filters.search ?? '')) {
            return;
        }

        const t = window.setTimeout(() => {
            router.get(configsIndex.url(), { search: next || undefined }, { preserveState: true, replace: true });
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
            router.visit(configsCreate.url());
        },
        [],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            <Head title="Email Configurations" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Email Configurations"
                        description={`${configs.total} configuration${configs.total !== 1 ? 's' : ''} — manage SMTP and email delivery settings`}
                    />
                    <div className="flex items-center gap-2">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search configurations…"
                            className="w-52"
                        />
                        <Button asChild>
                            <a href={configsCreate.url()}>
                                <Plus className="mr-1.5 h-4 w-4" />
                                New configuration
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
                                <TableHead>Mailer</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>Host</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {configs.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                        No configurations found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {configs.data.map((config) => (
                                <TableRow key={config.id}>
                                    <TableCell>
                                        <a
                                            href={configsShow.url(config)}
                                            className="flex items-center gap-2 font-medium hover:underline"
                                        >
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            {config.name}
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground uppercase text-xs">
                                        {config.mailer}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {config.from_address}
                                        {config.from_name ? ` (${config.from_name})` : ''}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {config.host ? `${config.host}:${config.port}` : '—'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {config.is_active ? (
                                            <Badge variant="default" className="gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="gap-1">
                                                <XCircle className="h-3 w-3" /> Inactive
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={configsShow.url(config)}>
                                                    <Eye className="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <DeleteAlertDialog
                                                trigger={
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                }
                                                title={`Delete "${config.name}"?`}
                                                description="This will remove the email configuration permanently."
                                                onConfirm={() => router.delete(configsDestroy.url(config))}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination links={configs.links} />
            </div>
        </>
    );
}

EmailConfigurationsIndex.layout = { breadcrumbs };
