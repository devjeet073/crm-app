import { router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Briefcase,
    CheckSquare,
    FileText,
    FolderOpen,
    Key,
    Settings,
    UserCog,
    Shield,
    UsersRound,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';

const navigation = [
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
            { name: 'Leads', href: '/leads', icon: Briefcase },
            { name: 'Accounts', href: '/accounts', icon: Users },
            { name: 'Tasks', href: '/tasks', icon: CheckSquare },
            { name: 'Documents', href: '/documents', icon: FileText },
            { name: 'Document Folders', href: '/document-folders', icon: FolderOpen },
            { name: 'App Secrets', href: '/app-secrets', icon: Key },
        ],
    },
    {
        group: 'Administration',
        items: [
            { name: 'Users', href: '/users', icon: Users },
            { name: 'Roles', href: '/roles', icon: Shield },
            { name: 'Teams', href: '/teams', icon: UsersRound },
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

export function CommandPalette() {
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
                {navigation.map((group, i) => (
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
