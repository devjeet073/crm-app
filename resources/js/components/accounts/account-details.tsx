import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Account } from '@/types';

function address(
    account: Account,
    prefix: 'billing_address' | 'shipping_address',
): string | null {
    const parts = [
        account[`${prefix}_street`],
        account[`${prefix}_city`],
        account[`${prefix}_state`],
        account[`${prefix}_postal_code`],
        account[`${prefix}_country`],
    ].filter(Boolean);

    return parts.length ? parts.join(', ') : null;
}

export function AccountDetails({ account }: { account: Account }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            Calls
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">
                        {account.calls_count ?? 0}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            Meetings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">
                        {account.meetings_count ?? 0}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">
                        {account.tasks_count ?? 0}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            Converted leads
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">
                        {account.leads_count ?? 0}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <Field label="Website" value={account.website} />
                    <Field
                        label="Assigned to"
                        value={account.assigned_user?.name}
                    />
                    <Field
                        label="Billing address"
                        value={address(account, 'billing_address')}
                    />
                    <Field
                        label="Shipping address"
                        value={address(account, 'shipping_address')}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <Field label="Type" value={account.type} />
                    <Field label="Industry" value={account.industry} />
                    <Field label="SIC code" value={account.sic_code} />
                    <div className="grid gap-1">
                        <span className="text-sm text-muted-foreground">
                            Locked
                        </span>
                        <Badge
                            variant={
                                account.is_locked ? 'destructive' : 'outline'
                            }
                            className="w-fit"
                        >
                            {account.is_locked ? 'Locked' : 'Not locked'}
                        </Badge>
                    </div>
                    {account.description && (
                        <div className="grid gap-1 sm:col-span-2">
                            <span className="text-sm text-muted-foreground">
                                Description
                            </span>
                            <p className="whitespace-pre-line">
                                {account.description}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function Field({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="grid gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span>{value || '—'}</span>
        </div>
    );
}
