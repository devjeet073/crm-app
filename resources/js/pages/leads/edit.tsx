import { Head, router, setLayoutProps } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import LeadController from '@/actions/App/Http/Controllers/LeadController';
import Heading from '@/components/heading';
import LeadForm from '@/components/leads/lead-form';
import { Button } from '@/components/ui/button';
import { index as leadsIndex } from '@/routes/leads';
import type { BreadcrumbItem, Lead, User } from '@/types';

type PageProps = {
    lead: Lead;
    users: User[];
    statuses: string[];
    sources: string[];
    industries: string[];
    salutations: string[];
};

function leadName(lead: Lead): string {
    return (
        [lead.first_name, lead.last_name].filter(Boolean).join(' ') ||
        `Lead #${lead.id}`
    );
}

export default function LeadsEdit({
    lead,
    users,
    statuses,
    sources,
    industries,
    salutations,
}: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Leads', href: leadsIndex() },
        { title: leadName(lead), href: LeadController.show(lead) },
        { title: 'Edit', href: LeadController.edit(lead) },
    ];

    setLayoutProps({ breadcrumbs });

    return (
        <>
            <Head title={`Edit ${leadName(lead)}`} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading title={`Edit ${leadName(lead)}`} />
                    <Button
                        variant="outline"
                        onClick={() => router.visit(leadsIndex.url())}
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                    </Button>
                </div>

                <LeadForm
                    lead={lead}
                    users={users}
                    statuses={statuses}
                    sources={sources}
                    industries={industries}
                    salutations={salutations}
                />
            </div>
        </>
    );
}
