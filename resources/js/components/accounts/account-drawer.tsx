import { router } from '@inertiajs/react';
import AccountController from '@/actions/App/Http/Controllers/AccountController';
import { AccountDetails } from '@/components/accounts/account-details';
import AccountForm from '@/components/accounts/account-form';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { DrawerResizeHandle } from '@/components/ui/drawer-resize-handle';
import { useDrawerResize } from '@/hooks/use-drawer-resize';
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
    const { width, handleMouseDown } = useDrawerResize();

    return (
        <Drawer
            direction="right"
            open={state !== null}
            onOpenChange={onOpenChange}
        >
            <DrawerContent className="sm:max-w-none" style={{ width }}>
                <DrawerResizeHandle onMouseDown={handleMouseDown} />
                {state?.mode === 'create' && (
                    <>
                        <DrawerHeader>
                            <DrawerTitle>New account</DrawerTitle>
                            <DrawerDescription>
                                Add a company or organization record.
                            </DrawerDescription>
                        </DrawerHeader>
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
                        <DrawerHeader>
                            <DrawerTitle>
                                Edit{' '}
                                {state.account.name ??
                                    `account #${state.account.id}`}
                            </DrawerTitle>
                        </DrawerHeader>
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
                        <DrawerHeader>
                            <DrawerTitle>
                                {state.account.name ??
                                    `Account #${state.account.id}`}
                            </DrawerTitle>
                            {state.account.type && (
                                <DrawerDescription>
                                    {state.account.type}
                                </DrawerDescription>
                            )}
                        </DrawerHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <AccountDetails account={state.account} />
                        </div>
                        <DrawerFooter className="flex-row justify-end">
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
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
