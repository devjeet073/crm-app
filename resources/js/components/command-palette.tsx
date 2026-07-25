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
    UsersRound,
    Mail,
    Loader2,
    CornerDownLeft,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Auth } from '@/types';

type TabId = 'all' | 'accounts' | 'leads' | 'tasks' | 'users' | 'teams' | 'roles';

const TABS: { id: TabId; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'leads', label: 'Leads' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'users', label: 'Users' },
    { id: 'teams', label: 'Teams' },
    { id: 'roles', label: 'Roles' },
];

const ENTITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    Account: Users,
    Lead: Briefcase,
    Task: CheckSquare,
    User: UserCog,
    Team: UsersRound,
    Role: Shield,
};

type SearchResult = {
    id: number;
    label: string;
    entity: string;
    href: string;
};

type NavItem = {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    permission?: string;
    adminOnly?: boolean;
    tab?: TabId;
};

type NavGroup = {
    group: string;
    adminOnly?: boolean;
    items: NavItem[];
};

const navigation: NavGroup[] = [
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
            { name: 'Leads', href: '/leads', icon: Briefcase, permission: 'Leads', tab: 'leads' },
            { name: 'Accounts', href: '/accounts', icon: Users, permission: 'Accounts', tab: 'accounts' },
            { name: 'Tasks', href: '/tasks', icon: CheckSquare, permission: 'Tasks', tab: 'tasks' },
            { name: 'Documents', href: '/documents', icon: FileText, permission: 'Documents' },
            { name: 'Document Folders', href: '/document-folders', icon: FolderOpen },
        ],
    },
    {
        group: 'Administration',
        adminOnly: true,
        items: [
            { name: 'Users', href: '/users', icon: Users, adminOnly: true, tab: 'users' },
            { name: 'Roles', href: '/roles', icon: Shield, adminOnly: true, tab: 'roles' },
            { name: 'Teams', href: '/teams', icon: UsersRound, adminOnly: true, tab: 'teams' },
            { name: 'Email Configurations', href: '/email-configurations', icon: Mail, adminOnly: true },
        ],
    },
    {
        group: 'Settings',
        items: [
            { name: 'Profile', href: '/settings/profile', icon: UserCog },
            { name: 'Security', href: '/settings/security', icon: Shield },
            { name: 'Appearance', href: '/settings/appearance', icon: Settings },
        ],
    },
];

function canAccessItem(
    item: NavItem,
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
    const [selectedTab, setSelectedTab] = useState<TabId>('all');
    const [searchValue, setSearchValue] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (!open) {
            setSelectedTab('all');
            setSearchValue('');
            setResults([]);
        }
    }, [open]);

    useEffect(() => {
        setSearchValue('');
        setResults([]);
    }, [selectedTab]);

    useEffect(() => {
        const trimmed = searchValue.trim();

        if (!trimmed || selectedTab === 'all') {
            setResults([]);
            return;
        }

        const controller = new AbortController();

        setLoading(true);

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/command-search?tab=${selectedTab}&search=${encodeURIComponent(trimmed)}`,
                    { signal: controller.signal },
                );
                const data = await res.json();
                setResults(data.results ?? []);
            } catch {
                if (!controller.signal.aborted) {
                    setResults([]);
                }
            }
            setLoading(false);
        }, 300);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [searchValue, selectedTab]);

    const isSearching = searchValue.trim().length > 0;

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
                    items: group.items.filter((item) => {
                        if (!canAccessItem(item, auth.isAdmin, auth.module_permissions)) {
                            return false;
                        }

                        if (selectedTab !== 'all' && item.tab !== selectedTab) {
                            return false;
                        }

                        return true;
                    }),
                }))
                .filter((group) => group.items.length > 0),
        [auth.isAdmin, auth.module_permissions, selectedTab],
    );

    const navigate = useCallback(
        (href: string) => {
            setOpen(false);
            router.visit(href);
        },
        [],
    );

    const handleTabSelect = useCallback((tab: TabId) => {
        setSelectedTab(tab);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogHeader className="sr-only">
                <DialogTitle>Command Palette</DialogTitle>
                <DialogDescription>Search for a command to run...</DialogDescription>
            </DialogHeader>
            <DialogContent className="overflow-hidden p-0">
                <Command
                    shouldFilter={selectedTab === 'all' || !isSearching}
                    className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
                >
                    <CommandInput
                        placeholder={selectedTab === 'all' ? "Search pages to go to..." : "Type a command or search..."}
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <div className="flex gap-1 border-b px-3 pb-2 pt-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabSelect(tab.id)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${selectedTab === tab.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <CommandList>
                        {isSearching && selectedTab !== 'all' ? (
                            loading ? (
                                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                                    <Loader2 className="size-4 animate-spin" />
                                    Searching...
                                </div>
                            ) : results.length > 0 ? (
                                <CommandGroup heading="Results">
                                    {results.map((result) => {
                                        const Icon = ENTITY_ICONS[result.entity];

                                        return (
                                            <CommandItem
                                                key={`${result.entity}-${result.id}`}
                                                value={`${result.label} ${result.entity}`}
                                                onSelect={() => navigate(result.href)}
                                            >
                                                {Icon && <Icon data-icon="inline-start" />}
                                                <span>{result.label}</span>
                                                <span className="ml-auto text-xs text-muted-foreground">
                                                    {result.entity}
                                                </span>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            ) : (
                                <CommandEmpty>No results found.</CommandEmpty>
                            )
                        ) : filteredNavigation.length > 0 ? (
                            filteredNavigation.map((group, i) => (
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
                            ))
                        ) : (
                            <CommandEmpty>No results found.</CommandEmpty>
                        )}
                    </CommandList>
                    <div className="flex items-center border-t px-3 py-2 text-xs text-muted-foreground bg-muted/30">
                        <kbd className="mr-2 flex h-5 items-center justify-center rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            <CornerDownLeft className="h-3 w-3" />
                        </kbd>
                        <span>Go to Page</span>
                    </div>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
