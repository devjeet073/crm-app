import { Head, router } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Activity, Search } from 'lucide-react';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BreadcrumbItem, Paginated } from '@/types';

// Utility for action badge colors
const ACTION_BADGE_MAP: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    created: 'default',
    updated: 'secondary',
    deleted: 'destructive',
    login: 'outline',
    logout: 'outline',
    failed_login: 'destructive',
    restored: 'default',
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Activity Logs', href: '/activity-logs' }];

export default function ActivityLogsIndex({ logs, filters, options }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [action, setAction] = useState(filters.action || 'all');
    const [selectedLog, setSelectedLog] = useState<any | null>(null);

    useEffect(() => {
        const t = window.setTimeout(() => {
            const currentSearch = search.trim();
            if (currentSearch !== (filters.search || '')) {
                router.get('/activity-logs', { 
                    search: currentSearch || undefined, 
                    action: action !== 'all' ? action : undefined 
                }, { preserveState: true, replace: true });
            }
        }, 350);
        return () => window.clearTimeout(t);
    }, [search]);

    const handleActionChange = (val: string) => {
        setAction(val);
        router.get('/activity-logs', { 
            search: search.trim() || undefined, 
            action: val !== 'all' ? val : undefined 
        }, { preserveState: true, replace: true });
    };

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: 'user.name',
            header: 'User',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.user?.name || 'System'}</span>
                    <span className="text-xs text-muted-foreground">{row.original.ip_address}</span>
                </div>
            )
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => (
                <Badge variant={ACTION_BADGE_MAP[row.original.action] || 'outline'}>
                    {row.original.action}
                </Badge>
            )
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => <span>{row.original.description}</span>
        },
        {
            accessorKey: 'subject_type',
            header: 'Entity',
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {row.original.subject_type ? row.original.subject_type.split('\\').pop() : 'N/A'}
                </span>
            )
        },
        {
            accessorKey: 'created_at',
            header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Date/Time" />,
            cell: ({ row }) => <span>{format(new Date(row.original.created_at), 'dd MMM yyyy, hh:mm a')}</span>
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" onClick={() => setSelectedLog(row.original)}>
                    Details
                </Button>
            )
        }
    ], []);

    return (
        <>
            <Head title="Activity Logs" />
            
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading title="Activity Logs" description="Audit trail of system events" />
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search logs..."
                                className="pl-8 w-64"
                            />
                        </div>
                        <Select value={action} onValueChange={handleActionChange}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                {options.actions.map((act: string) => (
                                    <SelectItem key={act} value={act}>{act}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DataTable columns={columns} data={logs.data} emptyMessage="No activity logs found." />
                
                <Pagination links={logs.links} />
            </div>

            <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Activity Details</DialogTitle>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md">
                                <div><span className="font-semibold text-muted-foreground">User:</span> {selectedLog.user?.name || 'System'}</div>
                                <div><span className="font-semibold text-muted-foreground">IP Address:</span> {selectedLog.ip_address}</div>
                                <div><span className="font-semibold text-muted-foreground">Action:</span> {selectedLog.action}</div>
                                <div><span className="font-semibold text-muted-foreground">Entity:</span> {selectedLog.subject_type || 'N/A'}</div>
                                <div><span className="font-semibold text-muted-foreground">Date:</span> {format(new Date(selectedLog.created_at), 'PPpp')}</div>
                                <div><span className="font-semibold text-muted-foreground">URL:</span> {selectedLog.url}</div>
                            </div>
                            
                            <div><span className="font-semibold text-muted-foreground">Description:</span> {selectedLog.description}</div>

                            {(selectedLog.old_values || selectedLog.new_values) && (
                                <div className="border rounded-md overflow-hidden mt-4">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="p-2 font-medium">Field</th>
                                                <th className="p-2 font-medium">Old Value</th>
                                                <th className="p-2 font-medium">New Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {Array.from(new Set([
                                                ...Object.keys(selectedLog.old_values || {}), 
                                                ...Object.keys(selectedLog.new_values || {})
                                            ])).map(key => (
                                                <tr key={key}>
                                                    <td className="p-2 font-medium">{key}</td>
                                                    <td className="p-2 text-red-600/80 bg-red-50/50">
                                                        {JSON.stringify(selectedLog.old_values?.[key] ?? '-')}
                                                    </td>
                                                    <td className="p-2 text-green-600/80 bg-green-50/50">
                                                        {JSON.stringify(selectedLog.new_values?.[key] ?? '-')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

ActivityLogsIndex.layout = { breadcrumbs };
