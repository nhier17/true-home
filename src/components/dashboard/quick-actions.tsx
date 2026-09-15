import {
    Building2,
    FileText,
    Home,
    Receipt,
    UserPlus,
} from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
    {
        title: "Add Property",
        description: "Register a new property",
        href: "/properties/create",
        icon: Building2,
    },
    {
        title: "Add Tenant",
        description: "Register a new tenant",
        href: "/tenants/create",
        icon: UserPlus,
    },
    {
        title: "Create Lease",
        description: "Create a tenant lease",
        href: "/leases/create",
        icon: FileText,
    },
    {
        title: "Create Invoice",
        description: "Generate an invoice",
        href: "/invoices/create",
        icon: Receipt,
    },
    {
        title: "Record Payment",
        description: "Record a tenant payment",
        href: "/payments/create",
        icon: Home,
    },
] as const;

export const QuickActions = () => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {actions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.title}
                                to={action.href}
                                className="group rounded-lg border p-4 transition-all hover:border-primary/40 hover:bg-muted/40 hover:shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-primary/10">
                                        <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-medium">
                                            {action.title}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};