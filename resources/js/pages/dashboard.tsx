import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { Building2, FileText, ListTodo, UserPlus } from 'lucide-react';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import DashboardController from '@/actions/App/Http/Controllers/DashboardController';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Auth, BreadcrumbItem } from '@/types';

type DashboardProps = {
    stats: {
        accounts: number;
        leads: number;
        tasks: number;
        documents: number;
    };
    graphData: Array<{
        date: string;
        leads: number;
        accounts: number;
        tasks: number;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: DashboardController.index() },
];

const chartConfig = {
    leads: {
        label: 'Leads',
        color: 'var(--chart-1)',
    },
    accounts: {
        label: 'Accounts',
        color: 'var(--chart-2)',
    },
    tasks: {
        label: 'Tasks',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig;

export default function Dashboard({ stats, graphData = [] }: DashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { isAdmin, module_permissions } = auth;

    const canViewAccounts = isAdmin || module_permissions?.['Accounts']?.view;
    const canViewLeads = isAdmin || module_permissions?.['Leads']?.view;
    const canViewTasks = isAdmin || module_permissions?.['Tasks']?.view;
    const canViewDocuments = isAdmin || module_permissions?.['Documents']?.view;

    const [timeRange, setTimeRange] = React.useState('90d');

    const filteredData = React.useMemo(() => {
        if (!graphData.length) {
            return [];
        }

        return graphData.filter((item) => {
            const date = new Date(item.date);
            const referenceDate = new Date(
                graphData[graphData.length - 1].date,
            );

            let daysToSubtract = 90;

            if (timeRange === '30d') {
                daysToSubtract = 30;
            } else if (timeRange === '7d') {
                daysToSubtract = 7;
            }

            const startDate = new Date(referenceDate);
            startDate.setDate(startDate.getDate() - daysToSubtract);

            return date >= startDate;
        });
    }, [graphData, timeRange]);

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {canViewAccounts && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Accounts
                                </CardTitle>
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats?.accounts || 0}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {canViewLeads && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Leads
                                </CardTitle>
                                <UserPlus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats?.leads || 0}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {canViewTasks && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Tasks
                                </CardTitle>
                                <ListTodo className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats?.tasks || 0}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {canViewDocuments && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Documents
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats?.documents || 0}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card className="mt-4 flex-1">
                    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                        <div className="grid flex-1 gap-1">
                            <CardTitle>Activity Overview</CardTitle>
                            <CardDescription>
                                Showing creation activity across your CRM
                                records
                            </CardDescription>
                        </div>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger
                                className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                                aria-label="Select a time range"
                            >
                                <SelectValue placeholder="Last 3 months" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="90d" className="rounded-lg">
                                    Last 3 months
                                </SelectItem>
                                <SelectItem value="30d" className="rounded-lg">
                                    Last 30 days
                                </SelectItem>
                                <SelectItem value="7d" className="rounded-lg">
                                    Last 7 days
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-auto h-[350px] w-full"
                        >
                            <AreaChart data={filteredData}>
                                <defs>
                                    <linearGradient
                                        id="fillLeads"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-leads)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-leads)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="fillAccounts"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-accounts)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-accounts)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="fillTasks"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-tasks)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-tasks)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={(value) => {
                                        const date = new Date(value);

                                        return date.toLocaleDateString(
                                            'en-US',
                                            {
                                                month: 'short',
                                                day: 'numeric',
                                            },
                                        );
                                    }}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(value) => {
                                                return new Date(
                                                    value,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                });
                                            }}
                                            indicator="dot"
                                        />
                                    }
                                />
                                {canViewTasks && (
                                    <Area
                                        dataKey="tasks"
                                        type="natural"
                                        fill="url(#fillTasks)"
                                        stroke="var(--color-tasks)"
                                        stackId="a"
                                    />
                                )}
                                {canViewAccounts && (
                                    <Area
                                        dataKey="accounts"
                                        type="natural"
                                        fill="url(#fillAccounts)"
                                        stroke="var(--color-accounts)"
                                        stackId="a"
                                    />
                                )}
                                {canViewLeads && (
                                    <Area
                                        dataKey="leads"
                                        type="natural"
                                        fill="url(#fillLeads)"
                                        stroke="var(--color-leads)"
                                        stackId="a"
                                    />
                                )}
                                <ChartLegend content={<ChartLegendContent />} />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = { breadcrumbs };
