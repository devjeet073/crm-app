import { Link } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types';

function renderIcon(icon?: LucideIcon | string | null) {
    if (!icon) {
        return null;
    }

    if (typeof icon === 'string') {
        const IconComponent =
            (LucideIcons as unknown as Record<string, LucideIcon>)[icon] ||
            LucideIcons.Circle;

        return <IconComponent className="h-4 w-4 shrink-0" />;
    }

    const IconComponent = icon;

    return <IconComponent className="h-4 w-4 shrink-0" />;
}

interface NavMainProps {
    groups?: NavGroup[];
    items?: NavItem[];
}

export function NavMain({ groups, items }: NavMainProps) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { setOpenMobile } = useSidebar();

    // Standardize to groups format
    const effectiveGroups: NavGroup[] =
        groups && groups.length > 0
            ? groups
            : items && items.length > 0
              ? [{ title: 'Platform', items }]
              : [];

    return (
        <>
            {effectiveGroups.map((group, index) => (
                <SidebarGroup key={group.title || index} className="px-2 py-1">
                    {group.title && (
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                    )}
                    <SidebarMenu>
                        {group.items.map((item) => {
                            const hasSubItems = Boolean(
                                item.items && item.items.length > 0,
                            );
                            const isChildActive =
                                hasSubItems &&
                                item.items?.some(
                                    (sub) =>
                                        sub.href &&
                                        isCurrentOrParentUrl(sub.href),
                                );
                            const isActive =
                                (item.href &&
                                    isCurrentOrParentUrl(item.href)) ||
                                isChildActive;

                            if (hasSubItems) {
                                return (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={isActive}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    tooltip={{
                                                        children: item.title,
                                                    }}
                                                    isActive={isActive}
                                                >
                                                    {renderIcon(item.icon)}
                                                    <span className="font-medium">
                                                        {item.title}
                                                    </span>
                                                    {item.badge !==
                                                        undefined && (
                                                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    <LucideIcons.ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items?.map(
                                                        (subItem) => {
                                                            const isSubActive =
                                                                Boolean(
                                                                    subItem.href &&
                                                                    isCurrentOrParentUrl(
                                                                        subItem.href,
                                                                    ),
                                                                );

                                                            return (
                                                                <SidebarMenuSubItem
                                                                    key={
                                                                        subItem.title
                                                                    }
                                                                >
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={
                                                                            isSubActive
                                                                        }
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                subItem.href ||
                                                                                '#'
                                                                            }
                                                                            prefetch
                                                                            onClick={() =>
                                                                                setOpenMobile(
                                                                                    false,
                                                                                )
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    subItem.title
                                                                                }
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            );
                                                        },
                                                    )}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            }

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={Boolean(
                                            item.href &&
                                            isCurrentOrParentUrl(item.href),
                                        )}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link
                                            href={item.href || '#'}
                                            prefetch
                                            onClick={() => setOpenMobile(false)}
                                        >
                                            {renderIcon(item.icon)}
                                            <span className="font-medium">
                                                {item.title}
                                            </span>
                                            {item.badge !== undefined && (
                                                <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
