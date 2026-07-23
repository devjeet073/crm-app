import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    CalendarDays,
    FileText,
    LayoutGrid,
    ListTodo,
    Shield,
    UserCog,
    UserPlus,
    Users,
    UsersRound,
} from 'lucide-react';
import CalendarController from '@/actions/App/Http/Controllers/CalendarController';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as accountsIndex } from '@/routes/accounts';
import { index as leadsIndex } from '@/routes/leads';
import { index as rolesIndex } from '@/routes/roles';
import { index as tasksIndex } from '@/routes/tasks';
import { index as teamsIndex } from '@/routes/teams';
import { index as usersIndex } from '@/routes/users';
import type { NavItem, Auth } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Calendar',
        href: CalendarController.index(),
        icon: CalendarDays,
    },
    {
        title: 'Accounts',
        href: accountsIndex(),
        icon: Building2,
    },
    {
        title: 'Leads',
        href: leadsIndex(),
        icon: UserPlus,
    },
    {
        title: 'Tasks',
        href: tasksIndex(),
        icon: ListTodo,
    },
    {
        title: 'Documents',
        href: '/documents',
        icon: FileText,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Users',
        href: usersIndex(),
        icon: UserCog,
    },
    {
        title: 'Teams',
        href: teamsIndex(),
        icon: UsersRound,
    },
    {
        title: 'Roles',
        href: rolesIndex(),
        icon: Shield,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;

    const filteredMainNavItems = mainNavItems.filter((item) => {
        if (['Dashboard', 'Calendar'].includes(item.title)) return true;
        if (auth.isAdmin) return true;
        
        if (auth.module_permissions) {
            return auth.module_permissions[item.title] === true;
        }
        return false;
    });

    const filteredAdminNavItems = auth.isAdmin ? adminNavItems : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
                {filteredAdminNavItems.length > 0 && <NavMain items={filteredAdminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

