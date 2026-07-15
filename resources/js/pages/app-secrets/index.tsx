import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BreadcrumbItem } from '@/types';

export default function AppSecretsIndex({ appSecrets, filters }: { appSecrets: any; filters: { search: string | null } }) {
    return (
        <>
            <Head title="App secrets" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">App secrets</h1>
                        <p className="text-sm text-muted-foreground">Manage application secrets.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Input placeholder="Search by name…" defaultValue={filters.search ?? ''} className="w-56" />
                        <Button variant="outline">Search</Button>
                    </div>
                </div>

                <div className="rounded-lg border bg-background p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{appSecrets.total} total</p>
                        <Link href="/app-secrets/create" className="text-sm font-medium text-primary hover:underline">
                            New secret
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {appSecrets.data.map((secret: any) => (
                            <div key={secret.id} className="flex items-center justify-between rounded-md border p-3">
                                <div>
                                    <p className="font-medium">{secret.name}</p>
                                    <p className="text-sm text-muted-foreground">{secret.description ?? '—'}</p>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {secret.value ? 'Configured' : 'Empty'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

AppSecretsIndex.layout = { breadcrumbs: [{ title: 'App secrets', href: '/app-secrets' }] as BreadcrumbItem[] };
