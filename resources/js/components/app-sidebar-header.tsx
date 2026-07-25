import { Search } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 text-muted-foreground"
                    onClick={() =>
                        document.dispatchEvent(
                            new KeyboardEvent('keydown', {
                                key: 'k',
                                metaKey: true,
                            }),
                        )
                    }
                >
                    <Search data-icon="inline-start" />
                    <span className="hidden md:inline">Search...</span>
                    <kbd className="pointer-events-none hidden items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </div>
        </header>
    );
}
