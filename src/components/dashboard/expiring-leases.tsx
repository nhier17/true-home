import {
    ArrowRight,
    CalendarClock,
    FileText,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DashboardExpiringLease } from "@/types";

type ExpiringLeasesProps = {
    leases: DashboardExpiringLease[];
};

const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));

const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(`${endDate}T00:00:00`);

    today.setHours(0, 0, 0, 0);

    const difference = end.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

export const ExpiringLeases = ({
                                   leases,
                               }: ExpiringLeasesProps) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarClock className="h-5 w-5" />
                        Expiring Leases
                    </CardTitle>

                    {leases.length > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            Leases requiring attention
                        </p>
                    )}
                </div>

                <Button variant="ghost" size="sm" asChild>
                    <a href="/leases">
                        View all
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                </Button>
            </CardHeader>

            <CardContent>
                {leases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
                            <CalendarClock className="h-5 w-5" />
                        </div>

                        <p className="font-medium">
                            No leases expiring soon
                        </p>

                        <p className="text-sm text-muted-foreground">
                            There are no active leases requiring attention.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {leases.slice(0, 5).map((lease) => {
                            const daysRemaining =
                                getDaysRemaining(lease.endDate);

                            return (
                                <div
                                    key={lease.id}
                                    className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/40">
                                            <FileText className="h-4 w-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-medium">
                                                {lease.tenant.firstName}{" "}
                                                {lease.tenant.lastName}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <span>
                                                    {lease.leaseNumber}
                                                </span>

                                                <span>•</span>

                                                <span>
                                                    Unit {lease.unit.unitNumber}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Ends {formatDate(lease.endDate)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <Badge
                                            variant={
                                                daysRemaining <= 7
                                                    ? "destructive"
                                                    : "secondary"
                                            }
                                        >
                                            {daysRemaining <= 0
                                                ? "Expires today"
                                                : `${daysRemaining} ${
                                                    daysRemaining === 1
                                                        ? "day"
                                                        : "days"
                                                } left`}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};