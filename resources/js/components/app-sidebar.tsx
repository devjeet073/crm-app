import { Link } from '@inertiajs/react';
import {
    Building2,
    CalendarDays,
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
import type { NavItem } from '@/types';

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
                <NavMain items={mainNavItems} />
                <NavMain items={adminNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

