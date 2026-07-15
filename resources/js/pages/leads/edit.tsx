import { Head, setLayoutProps } from '@inertiajs/react';
import LeadController from '@/actions/App/Http/Controllers/LeadController';
import Heading from '@/components/heading';
import LeadForm from '@/components/leads/lead-form';
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
                <Heading title={`Edit ${leadName(lead)}`} />

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
