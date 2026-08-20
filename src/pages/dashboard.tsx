import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

const Dashboard = () => {
    const kpis = [
        {
            title: "Total Properties",
            value: "5",
            subtitle: "21 units",
            icon: "🏢"
        },
        {
            title: "Monthly Revenue",
            value: "$33,250",
            subtitle: "~ 100% collection rate",
            icon: "💰"
        },
        {
            title: "Active Tenants",
            value: "12",
            subtitle: "~ 14 units occupied",
            icon: "👥"
        },
        {
            title: "Open Maintenance",
            value: "5",
            subtitle: "~ $0 pending",
            icon: "🔧"
        }
    ];

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
                    <CardTitle>
                        Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {kpis.map((kp) => (
                            <div key={kp.title} className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{kp.title}</p>
                                        <p className="text-2xl font-bold mt-1">{kp.value}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{kp.subtitle}</p>
                                    </div>
                                    <span className="text-2xl">{kp.icon}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Dashboard