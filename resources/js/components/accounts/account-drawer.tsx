import { router } from '@inertiajs/react';
import AccountController from '@/actions/App/Http/Controllers/AccountController';
import { AccountDetails } from '@/components/accounts/account-details';
import AccountForm from '@/components/accounts/account-form';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { SheetResizeHandle } from '@/components/ui/sheet-resize-handle';
import { useDrawerResize } from '@/hooks/use-drawer-resize';

import { cn } from '@/lib/utils';
import type { Account } from '@/types';

export type AccountDrawerState =
    | { mode: 'create' }
    | { mode: 'edit'; account: Account }
    | { mode: 'view'; account: Account };

type AccountDrawerProps = {
    state: AccountDrawerState | null;
    onOpenChange: (open: boolean) => void;
    onEdit: (account: Account) => void;
    accountTypes: string[];
    industries: string[];
};

export function AccountDrawer({
    state,
    onOpenChange,
    onEdit,
    accountTypes,
    industries,
}: AccountDrawerProps) {
    const { width, setWidth, handlePointerDown } = useDrawerResize();

    return (
        <Sheet
            direction="right"
            open={state !== null}
            onOpenChange={onOpenChange}
        >
            <SheetContent
                className="sm:max-w-none"
                style={{ width: width || 720 }}
            >
                <SheetResizeHandle onPointerDown={handlePointerDown} />
                {state?.mode === 'create' && (
                    <>
                        <SheetHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-0.5">
                                    <SheetTitle>New account</SheetTitle>
                                    <SheetDescription>
                                        Add a company or organization record.
                                    </SheetDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0"
                                    onClick={() =>
                                        router.visit(
                                            AccountController.create.url(),
                                        )
                                    }
                                >
                                    <Maximize2 className="mr-2 h-4 w-4" />
                                    Full Form
                                </Button>
                            </div>
                        </SheetHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <AccountForm
                                accountTypes={accountTypes}
                                industries={industries}
                                onCancel={() => onOpenChange(false)}
                            />
                        </div>
                    </>
                )}

                {state?.mode === 'edit' && (
                    <>
                        <SheetHeader>
                            <div className="flex items-start justify-between gap-4">
                                <SheetTitle>
                                    Edit{' '}
                                    {state.account.name ??
                                        `account #${state.account.id}`}
                                </SheetTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0"
                                    onClick={() =>
                                        router.visit(
                                            AccountController.edit.url(
                                                state.account,
                                            ),
                                        )
                                    }
                                >
                                    <Maximize2 className="mr-2 h-4 w-4" />
                                    Full Form
                                </Button>
                            </div>
                        </SheetHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <AccountForm
                                account={state.account}
                                accountTypes={accountTypes}
                                industries={industries}
                                onCancel={() => onOpenChange(false)}
                            />
                        </div>
                    </>
                )}

                {state?.mode === 'view' && (
                    <>
                        <SheetHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-0.5">
                                    <SheetTitle>
                                        {state.account.name ??
                                            `Account #${state.account.id}`}
                                    </SheetTitle>
                                    {state.account.type && (
                                        <SheetDescription>
                                            {state.account.type}
                                        </SheetDescription>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0"
                                    onClick={() =>
                                        router.visit(
                                            AccountController.show.url(
                                                state.account,
                                            ),
                                        )
                                    }
                                >
                                    <Maximize2 className="mr-2 h-4 w-4" />
                                    Full Form
                                </Button>
                            </div>
                        </SheetHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <AccountDetails account={state.account} />
                        </div>
                        <SheetFooter className="flex-row justify-end">
                            <DeleteAlertDialog
                                trigger={
                                    <Button variant="destructive">
                                        Delete
                                    </Button>
                                }
                                title="Delete account?"
                                description={`This will permanently delete "${state.account.name}". This action cannot be undone.`}
                                onConfirm={() =>
                                    router.delete(
                                        AccountController.destroy.url(
                                            state.account,
                                        ),
                                    )
                                }
                            />
                            <Button
                                variant="outline"
                                onClick={() => onEdit(state.account)}
                            >
                                Edit
                            </Button>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
