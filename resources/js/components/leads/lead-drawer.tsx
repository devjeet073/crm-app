import { router, Link } from '@inertiajs/react';
import { Maximize2 } from 'lucide-react';
import LeadController from '@/actions/App/Http/Controllers/LeadController';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import { LeadDetails } from '@/components/leads/lead-details';
import LeadForm from '@/components/leads/lead-form';
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
    const { width, handlePointerDown } = useDrawerResize();

    return (
        <Sheet
            direction="right"
            open={state !== null}
            onOpenChange={onOpenChange}
        >
            <SheetContent className="sm:max-w-none" style={{ width }}>
                <SheetResizeHandle onPointerDown={handlePointerDown} />
                {state?.mode === 'create' && (
                    <>
                        <SheetHeader className="flex flex-row items-start justify-between">
                            <div className="flex flex-col gap-1.5">
                                <SheetTitle>New lead</SheetTitle>
                                <SheetDescription>
                                    Capture an unqualified prospect.
                                </SheetDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="-mt-2 -mr-2 shrink-0"
                            >
                                <Link
                                    href="/leads/create"
                                    title="Open full page"
                                >
                                    <Maximize2 className="h-4 w-4" />
                                </Link>
                            </Button>
                        </SheetHeader>
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
                        <SheetHeader className="flex flex-row items-start justify-between">
                            <SheetTitle className="mt-1.5">
                                Edit {leadName(state.lead)}
                            </SheetTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="-mt-2 -mr-2 shrink-0"
                            >
                                <Link
                                    href={`/leads/${state.lead.id}/edit`}
                                    title="Open full page"
                                >
                                    <Maximize2 className="h-4 w-4" />
                                </Link>
                            </Button>
                        </SheetHeader>
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
                        <SheetHeader className="flex flex-row items-start justify-between">
                            <div className="flex flex-col gap-1.5">
                                <SheetTitle>
                                    {leadName(state.lead)}
                                </SheetTitle>
                                {state.lead.title && (
                                    <SheetDescription>
                                        {state.lead.title}
                                    </SheetDescription>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="-mt-2 -mr-2 shrink-0"
                            >
                                <Link
                                    href={`/leads/${state.lead.id}`}
                                    title="Open full page"
                                >
                                    <Maximize2 className="h-4 w-4" />
                                </Link>
                            </Button>
                        </SheetHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <LeadDetails lead={state.lead} />
                        </div>
                        <SheetFooter className="flex-row justify-end">
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
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
