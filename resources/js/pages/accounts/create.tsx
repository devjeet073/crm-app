import { Head } from '@inertiajs/react';
import AccountForm from '@/components/accounts/account-form';
import Heading from '@/components/heading';
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
                <Heading
                    title="New account"
                    description="Add a company or organization record."
                />

                <AccountForm
                    accountTypes={accountTypes}
                    industries={industries}
                />
            </div>
        </>
    );
}

AccountsCreate.layout = { breadcrumbs };
