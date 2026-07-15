import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Lead } from '@/types';

function address(lead: Lead): string | null {
    const parts = [
        lead.address_street,
        lead.address_city,
        lead.address_state,
        lead.address_postal_code,
        lead.address_country,
    ].filter(Boolean);

    return parts.length ? parts.join(', ') : null;
}

export function LeadDetails({ lead }: { lead: Lead }) {
    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label="Status"
                        value={<Badge variant="outline">{lead.status}</Badge>}
                    />
                    <Field label="Company" value={lead.account_name} />
                    <Field label="Website" value={lead.website} />
                    <Field
                        label="Assigned to"
                        value={lead.assigned_user?.name}
                    />
                    <Field label="Address" value={address(lead)} />
                    {lead.created_account && (
                        <Field
                            label="Converted account"
                            value={
                                <Link
                                    href={`/accounts/${lead.created_account.id}`}
                                    className="hover:underline"
                                >
                                    {lead.created_account.name}
                                </Link>
                            }
                        />
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <Field label="Source" value={lead.source} />
                    <Field label="Industry" value={lead.industry} />
                    <Field
                        label="Opportunity amount"
                        value={
                            lead.opportunity_amount != null
                                ? `${lead.opportunity_amount} ${lead.opportunity_amount_currency ?? ''}`.trim()
                                : null
                        }
                    />
                    <Field
                        label="Do not call"
                        value={lead.do_not_call ? 'Yes' : 'No'}
                    />
                    {lead.description && (
                        <div className="grid gap-1 sm:col-span-2">
                            <span className="text-sm text-muted-foreground">
                                Description
                            </span>
                            <p className="whitespace-pre-line">
                                {lead.description}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function Field({ label, value }: { label: string; value?: ReactNode }) {
    return (
        <div className="grid gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span>{value || '—'}</span>
        </div>
    );
}
