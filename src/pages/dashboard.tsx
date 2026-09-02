import {
    Building2,
    Home,
    Users,
    DoorOpen,
    FileCheck,
    Receipt,
    Wallet,
    CircleDollarSign,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useDashboard } from "@/components/dashboard/hooks/use-custom.ts";
import {FinancialCard} from "@/components/dashboard/financial-card.tsx";
import {RevenueTrendChart} from "@/components/dashboard/revenue-trend-chart.tsx";
import {OccupancyChart} from "@/components/dashboard/occupancy-chart.tsx";
import {RecentPayments} from "@/components/dashboard/recent-payments.tsx";
import {OverdueInvoices} from "@/components/dashboard/overdue-invoices.tsx";

const Dashboard = () => {
    const { overview, isLoading, isError, financial, revenueTrend, recentPayments, overdueInvoices } = useDashboard();

    const kpis = [
        {
            title: "Properties",
            key: "properties",
            icon: Building2,
            accent: "text-blue-600",
        },
        {
            title: "Units",
            key: "units",
            icon: Home,
            accent: "text-emerald-600",
        },
        {
            title: "Occupied Units",
            key: "occupiedUnits",
            icon: DoorOpen,
            accent: "text-amber-600",
        },
        {
            title: "Vacant Units",
            key: "vacantUnits",
            icon: Home,
            accent: "text-purple-600",
        },
        {
            title: "Tenants",
            key: "tenants",
            icon: Users,
            accent: "text-cyan-600",
        },
        {
            title: "Active Leases",
            key: "activeLeases",
            icon: FileCheck,
            accent: "text-green-600",
        },
    ] as const;

    const financialCards = [
        {
            title: "Total Invoiced",
            key: "totalInvoiced",
            icon: Receipt,
            accent: "text-blue-600",
            description: "Total value of invoices",
        },
        {
            title: "Total Collected",
            key: "totalCollected",
            icon: Wallet,
            accent: "text-emerald-600",
            description: "Payments received",
        },
        {
            title: "Outstanding",
            key: "outstanding",
            icon: CircleDollarSign,
            accent: "text-orange-600",
            description: "Amount still to collect",
        },
    ] as const;

    if (isLoading || isError || !overview || !financial || !revenueTrend || !recentPayments || !overdueInvoices)  {
        return (
            <div className="h-[145px] rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                </div>

                <div className="mt-5 h-8 w-32 animate-pulse rounded bg-muted" />

                <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Dashboard</h1>

                <p className="text-muted-foreground">
                    Monitor your properties performance and stay on top of operations.
                </p>
            </div>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                            {kpis.map((kpi) => (
                                <KpiCard
                                    key={kpi.key}
                                    title={kpi.title}
                                    value={overview?.[kpi.key] ?? 0}
                                    icon={kpi.icon}
                                    accent={kpi.accent}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <RevenueTrendChart data={revenueTrend} />
                <OccupancyChart occupiedUnits={overview?.occupiedUnits ?? 0} vacantUnits={overview?.vacantUnits ?? 0} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {financialCards.map((card) => (
                            <FinancialCard
                            key={card.key}
                            title={card.title}
                            value={financial?.[card.key] ?? 0}
                            icon={card.icon}
                            accent={card.accent}
                            description={card.description}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <RecentPayments payments={recentPayments} />
                <OverdueInvoices invoices={overdueInvoices} />
            </div>
        </div>
    );
};

export default Dashboard;