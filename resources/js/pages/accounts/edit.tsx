import { Head, router, setLayoutProps } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AccountController from '@/actions/App/Http/Controllers/AccountController';
import AccountForm from '@/components/accounts/account-form';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { index as accountsIndex } from '@/routes/accounts';
import type { Account, BreadcrumbItem } from '@/types';

type PageProps = {
    account: Account;
    accountTypes: string[];
    industries: string[];
};

export default function AccountsEdit({
    account,
    accountTypes,
    industries,
}: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Accounts', href: accountsIndex() },
        {
            title: account.name ?? `Account #${account.id}`,
            href: AccountController.show(account),
        },
        { title: 'Edit', href: AccountController.edit(account) },
    ];

    setLayoutProps({ breadcrumbs });

    return (
        <>
            <Head title={`Edit ${account.name ?? 'account'}`} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading title={`Edit ${account.name ?? 'account'}`} />
                    <Button
                        variant="outline"
                        onClick={() => router.visit(accountsIndex.url())}
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                    </Button>
                </div>

                <AccountForm
                    account={account}
                    accountTypes={accountTypes}
                    industries={industries}
                />
            </div>
        </>
    );
}
