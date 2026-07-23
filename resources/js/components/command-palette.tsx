import { router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Briefcase,
    CheckSquare,
    FileText,
    FolderOpen,
    Settings,
    UserCog,
    Shield,
    UsersRound,
    Mail,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import type { Auth } from '@/types';

type CommandItem = {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    permission?: string;
    adminOnly?: boolean;
};

type CommandGroup = {
    group: string;
    adminOnly?: boolean;
    items: CommandItem[];
};

const navigation: CommandGroup[] = [
    {
        group: 'Navigation',
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Calendar', href: '/calendar', icon: Calendar },
        ],
    },
    {
        group: 'CRM',
        items: [
            { name: 'Leads', href: '/leads', icon: Briefcase, permission: 'Leads' },
            { name: 'Accounts', href: '/accounts', icon: Users, permission: 'Accounts' },
            { name: 'Tasks', href: '/tasks', icon: CheckSquare, permission: 'Tasks' },
            { name: 'Documents', href: '/documents', icon: FileText, permission: 'Documents' },
            { name: 'Document Folders', href: '/document-folders', icon: FolderOpen },
        ],
    },
    {
        group: 'Administration',
        adminOnly: true,
        items: [
            { name: 'Users', href: '/users', icon: Users, adminOnly: true },
            { name: 'Roles', href: '/roles', icon: Shield, adminOnly: true },
            { name: 'Teams', href: '/teams', icon: UsersRound, adminOnly: true },
            { name: 'Email Configurations', href: '/email-configurations', icon: Mail, adminOnly: true },
        ],
    },
    {
        group: 'Settings',
        items: [
            { name: 'Profile', href: '/settings/profile', icon: UserCog },
            { name: 'Appearance', href: '/settings/appearance', icon: Settings },
        ],
    },
];

function canAccessItem(
    item: CommandItem,
    isAdmin: boolean,
    modulePermissions: Record<string, boolean> | null,
): boolean {
    if (item.adminOnly && !isAdmin) {
        return false;
    }

    if (isAdmin) {
        return true;
    }

    if (item.permission && modulePermissions) {
        return modulePermissions[item.permission] === true;
    }

    return true;
}

export function CommandPalette() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);

        return () => document.removeEventListener('keydown', down);
    }, []);

    const filteredNavigation = useMemo(
        () =>
            navigation
                .filter((group) => {
                    if (group.adminOnly && !auth.isAdmin) {
                        return false;
                    }

                    return true;
                })
                .map((group) => ({
                    ...group,
                    items: group.items.filter((item) =>
                        canAccessItem(item, auth.isAdmin, auth.module_permissions),
                    ),
                }))
                .filter((group) => group.items.length > 0),
        [auth.isAdmin, auth.module_permissions],
    );

    const navigate = useCallback(
        (href: string) => {
            setOpen(false);
            router.visit(href);
        },
        [],
    );

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {filteredNavigation.map((group, i) => (
                    <div key={group.group}>
                        {i > 0 && <CommandSeparator />}
                        <CommandGroup heading={group.group}>
                            {group.items.map((item) => (
                                <CommandItem
                                    key={item.href}
                                    value={item.name}
                                    onSelect={() => navigate(item.href)}
                                >
                                    <item.icon data-icon="inline-start" />
                                    <span>{item.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </div>
                ))}
            </CommandList>
        </CommandDialog>
    );
}
