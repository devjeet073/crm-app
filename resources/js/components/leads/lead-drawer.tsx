import { router } from '@inertiajs/react';
import LeadController from '@/actions/App/Http/Controllers/LeadController';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import { LeadDetails } from '@/components/leads/lead-details';
import LeadForm from '@/components/leads/lead-form';
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
import type { Lead, User } from '@/types';

function leadName(lead: Lead): string {
    return (
        [lead.first_name, lead.last_name].filter(Boolean).join(' ') ||
        `Lead #${lead.id}`
    );
}

export type LeadDrawerState =
    | { mode: 'create' }
    | { mode: 'edit'; lead: Lead }
    | { mode: 'view'; lead: Lead };

type LeadDrawerProps = {
    state: LeadDrawerState | null;
    onOpenChange: (open: boolean) => void;
    onEdit: (lead: Lead) => void;
    users: User[];
    statuses: string[];
    sources: string[];
    industries: string[];
    salutations: string[];
};

export function LeadDrawer({
    state,
    onOpenChange,
    onEdit,
    users,
    statuses,
    sources,
    industries,
    salutations,
}: LeadDrawerProps) {
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
                            <DrawerTitle>New lead</DrawerTitle>
                            <DrawerDescription>
                                Capture an unqualified prospect.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <LeadForm
                                users={users}
                                statuses={statuses}
                                sources={sources}
                                industries={industries}
                                salutations={salutations}
                                onCancel={() => onOpenChange(false)}
                            />
                        </div>
                    </>
                )}

                {state?.mode === 'edit' && (
                    <>
                        <DrawerHeader>
                            <DrawerTitle>
                                Edit {leadName(state.lead)}
                            </DrawerTitle>
                        </DrawerHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <LeadForm
                                lead={state.lead}
                                users={users}
                                statuses={statuses}
                                sources={sources}
                                industries={industries}
                                salutations={salutations}
                                onCancel={() => onOpenChange(false)}
                            />
                        </div>
                    </>
                )}

                {state?.mode === 'view' && (
                    <>
                        <DrawerHeader>
                            <DrawerTitle>{leadName(state.lead)}</DrawerTitle>
                            {state.lead.title && (
                                <DrawerDescription>
                                    {state.lead.title}
                                </DrawerDescription>
                            )}
                        </DrawerHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <LeadDetails lead={state.lead} />
                        </div>
                        <DrawerFooter className="flex-row justify-end">
                            <DeleteAlertDialog
                                trigger={
                                    <Button variant="destructive">
                                        Delete
                                    </Button>
                                }
                                title="Delete lead?"
                                description={`This will permanently delete "${leadName(state.lead)}". This action cannot be undone.`}
                                onConfirm={() =>
                                    router.delete(
                                        LeadController.destroy.url(state.lead),
                                    )
                                }
                            />
                            <Button
                                variant="outline"
                                onClick={() => onEdit(state.lead)}
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
