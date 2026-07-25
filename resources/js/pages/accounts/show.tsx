import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AccountController from '@/actions/App/Http/Controllers/AccountController';
import { AccountDetails } from '@/components/accounts/account-details';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { index as accountsIndex } from '@/routes/accounts';
import type { Account, BreadcrumbItem } from '@/types';

type PageProps = {
    account: Account;
};
import type { Auth } from '@/types';

export default function AccountShow({ account }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Accounts', href: accountsIndex() },
        {
            title: account.name ?? `Account #${account.id}`,
            href: AccountController.show(account),
        },
    ];

    const { auth } = usePage<{ auth: Auth }>().props;
    const canUpdate = auth.isAdmin || auth.module_permissions?.['Accounts']?.update;
    const canDelete = auth.isAdmin || auth.module_permissions?.['Accounts']?.delete;

    setLayoutProps({ breadcrumbs });

    return (
        <>
            <Head title={account.name ?? 'Account'} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title={account.name ?? 'Untitled account'}
                        description={account.type ?? undefined}
                    />

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(accountsIndex.url())}
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                        {canUpdate && (
                            <Button variant="outline" asChild>
                                <Link href={AccountController.edit(account)}>
                                    Edit
                                </Link>
                            </Button>
                        )}
                        {canDelete && (
                            <DeleteAlertDialog
                                trigger={
                                    <Button variant="destructive">Delete</Button>
                                }
                                title="Delete account?"
                                description={`This will permanently delete "${account.name}". This action cannot be undone.`}
                                onConfirm={() =>
                                    router.delete(
                                        AccountController.destroy.url(account),
                                    )
                                }
                            />
                        )}
                    </div>
                </div>

                <AccountDetails account={account} />
            </div>
        </>
    );
}
