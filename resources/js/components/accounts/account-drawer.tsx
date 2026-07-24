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
import { cn } from '@/lib/utils';
import type { Account } from '@/types';

const WIDTH_PRESETS = [
    { label: 'Sm', width: 400 },
    { label: 'Md', width: 560 },
    { label: 'Lg', width: 720 },
    { label: 'Xl', width: 800 },
] as const;

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
    const { width, setWidth, handleMouseDown } = useDrawerResize();

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
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-0.5">
                                    <DrawerTitle>New account</DrawerTitle>
                                    <DrawerDescription>
                                        Add a company or organization record.
                                    </DrawerDescription>
                                </div>
                                <WidthPresets
                                    currentWidth={width}
                                    onSelect={setWidth}
                                />
                            </div>
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
                            <div className="flex items-start justify-between gap-4">
                                <DrawerTitle>
                                    Edit{' '}
                                    {state.account.name ??
                                        `account #${state.account.id}`}
                                </DrawerTitle>
                                <WidthPresets
                                    currentWidth={width}
                                    onSelect={setWidth}
                                />
                            </div>
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
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-0.5">
                                    <DrawerTitle>
                                        {state.account.name ??
                                            `Account #${state.account.id}`}
                                    </DrawerTitle>
                                    {state.account.type && (
                                        <DrawerDescription>
                                            {state.account.type}
                                        </DrawerDescription>
                                    )}
                                </div>
                                <WidthPresets
                                    currentWidth={width}
                                    onSelect={setWidth}
                                />
                            </div>
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

function WidthPresets({
    currentWidth,
    onSelect,
}: {
    currentWidth: number;
    onSelect: (width: number) => void;
}) {
    return (
        <div className="flex shrink-0 items-center gap-0.5 rounded-md border p-0.5">
            {WIDTH_PRESETS.map((preset) => (
                <button
                    key={preset.width}
                    type="button"
                    onClick={() => onSelect(preset.width)}
                    className={cn(
                        'rounded px-2 py-1 text-xs font-medium transition-colors',
                        currentWidth === preset.width
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {preset.label}
                </button>
            ))}
        </div>
    );
}
