import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import LeadForm from '@/components/leads/lead-form';
import { Button } from '@/components/ui/button';
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
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="New lead"
                        description="Capture an unqualified prospect."
                    />
                    <Button variant="outline" onClick={() => router.visit(leadsIndex.url())}>
                        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                    </Button>
                </div>

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
