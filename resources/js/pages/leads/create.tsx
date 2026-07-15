import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import LeadForm from '@/components/leads/lead-form';
import { create as leadsCreate, index as leadsIndex } from '@/routes/leads';
import type { BreadcrumbItem, User } from '@/types';

type PageProps = {
    users: User[];
    statuses: string[];
    sources: string[];
    industries: string[];
    salutations: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Leads', href: leadsIndex() },
    { title: 'New lead', href: leadsCreate() },
];

export default function LeadsCreate({
    users,
    statuses,
    sources,
    industries,
    salutations,
}: PageProps) {
    return (
        <>
            <Head title="New lead" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="New lead"
                    description="Capture an unqualified prospect."
                />

                <LeadForm
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

LeadsCreate.layout = { breadcrumbs };
