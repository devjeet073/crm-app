import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
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
import type { Auth } from '@/types';

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

    const { auth } = usePage<{ auth: Auth }>().props;
    const canUpdate = auth.isAdmin || auth.module_permissions?.['Leads']?.update;
    const canDelete = auth.isAdmin || auth.module_permissions?.['Leads']?.delete;

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
                        <Button
                            variant="outline"
                            onClick={() => router.visit(leadsIndex.url())}
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                        {canUpdate && (
                            <Button variant="outline" asChild>
                                <Link href={LeadController.edit(lead)}>Edit</Link>
                            </Button>
                        )}
                        {canDelete && (
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
                        )}
                    </div>
                </div>

                <LeadDetails lead={lead} />
            </div>
        </>
    );
}
