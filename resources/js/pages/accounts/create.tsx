import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AccountForm from '@/components/accounts/account-form';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    create as accountsCreate,
    index as accountsIndex,
} from '@/routes/accounts';
import type { BreadcrumbItem } from '@/types';

type PageProps = {
    accountTypes: string[];
    industries: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accounts', href: accountsIndex() },
    { title: 'New account', href: accountsCreate() },
];

export default function AccountsCreate({
    accountTypes,
    industries,
}: PageProps) {
    return (
        <>
            <Head title="New account" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="New account"
                        description="Add a company or organization record."
                    />
                    <Button variant="outline" onClick={() => router.visit(accountsIndex.url())}>
                        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                    </Button>
                </div>

                <AccountForm
                    accountTypes={accountTypes}
                    industries={industries}
                />
            </div>
        </>
    );
}

AccountsCreate.layout = { breadcrumbs };
