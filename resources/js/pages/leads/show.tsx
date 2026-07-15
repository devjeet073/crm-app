import { Head, Link, router, setLayoutProps } from '@inertiajs/react';
import LeadController from '@/actions/App/Http/Controllers/LeadController';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import { LeadDetails } from '@/components/leads/lead-details';
import { Button } from '@/components/ui/button';
import { index as leadsIndex } from '@/routes/leads';
import type { BreadcrumbItem, Lead } from '@/types';

type PageProps = {
    lead: Lead;
};

function leadName(lead: Lead): string {
    return (
        [lead.salutation_name, lead.first_name, lead.last_name]
            .filter(Boolean)
            .join(' ') || `Lead #${lead.id}`
    );
}

export default function LeadShow({ lead }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Leads', href: leadsIndex() },
        { title: leadName(lead), href: LeadController.show(lead) },
    ];

    setLayoutProps({ breadcrumbs });

    return (
        <>
            <Head title={leadName(lead)} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title={leadName(lead)}
                        description={lead.title ?? undefined}
                    />

                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={LeadController.edit(lead)}>Edit</Link>
                        </Button>
                        <DeleteAlertDialog
                            trigger={
                                <Button variant="destructive">Delete</Button>
                            }
                            title="Delete lead?"
                            description={`This will permanently delete "${leadName(lead)}". This action cannot be undone.`}
                            onConfirm={() =>
                                router.delete(LeadController.destroy.url(lead))
                            }
                        />
                    </div>
                </div>

                <LeadDetails lead={lead} />
            </div>
        </>
    );
}
