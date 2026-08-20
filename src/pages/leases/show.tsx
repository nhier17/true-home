import {
    CalendarDays,
    CreditCard,
    FileText,
    Home,
    User,
} from "lucide-react";
import { useShow } from "@refinedev/core";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ShowView } from "@/components/refine-ui/views/show-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import {RenewLeaseDialog} from "@/components/leases/renew-lease-dialog.tsx";
import {MoveOutLeaseDialog} from "@/components/leases/move-out-dialog.tsx";

type LeaseStatus =
    | "ACTIVE"
    | "EXPIRED"
    | "CANCELLED";

type Lease = {
    id: string;
    organizationId: string;
    leaseNumber: string;

    startDate: string;
    endDate: string;
    moveInDate: string | null;
    moveOutDate: string | null;

    monthlyRent: number;
    securityDeposit: number;

    rentDueDay: number;
    gracePeriodDays: number;

    status: LeaseStatus;
    notes: string | null;

    previousLeaseId: string | null;

    tenant: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string | null;
    };

    unit: {
        id: string;
        unitNumber: string;
        propertyId: string;
        propertyName: string;
        unitTypeId: string;
        unitTypeName: string;
    };
};

const statusVariant = (
    status: LeaseStatus,
) => {
    switch (status) {
        case "ACTIVE":
            return "default";

        case "EXPIRED":
            return "secondary";

        case "CANCELLED":
            return "destructive";

        default:
            return "secondary";
    }
};

const formatDate = (date: string | null) => {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en-KE",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
    ).format(new Date(`${date}T00:00:00`));
};

const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString("en-KE")}`;
};

const LeaseShow = () => {
    const { query } = useShow<Lease>({
        resource: "leases",
    });

    const {
        data,
        isLoading,
        isError,
    } = query;

    const lease = data?.data;

    if (isError) {
        return (
            <ShowView>
                <Breadcrumb />

                <div className="py-10 text-center">
                    <p className="text-destructive">
                        Failed to load lease.
                    </p>
                </div>
            </ShowView>
        );
    }

    if (isLoading || !lease) {
        return (
            <ShowView>
                <Breadcrumb />

                <div className="py-10 text-center">
                    <p className="text-muted-foreground">
                        Loading lease...
                    </p>
                </div>
            </ShowView>
        );
    }

    return (
        <ShowView>
            <Breadcrumb />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="page-title">
                            {lease.leaseNumber}
                        </h1>

                        <Badge
                            variant={statusVariant(
                                lease.status,
                            )}
                        >
                            {lease.status}
                        </Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Lease details and tenancy information
                    </p>
                </div>

                {lease.status === "ACTIVE" && (
                    <div className="flex gap-2">
                        <RenewLeaseDialog lease={lease} />
                        <MoveOutLeaseDialog lease={lease} />
                    </div>
                )}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Tenant
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Name
                            </p>

                            <p className="font-medium">
                                {lease.tenant.firstName}{" "}
                                {lease.tenant.lastName}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Phone
                            </p>

                            <p className="font-medium">
                                {lease.tenant.phone}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Email
                            </p>

                            <p className="font-medium">
                                {lease.tenant.email ??
                                    "—"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Home className="h-5 w-5" />
                            Unit
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Unit Number
                            </p>

                            <p className="font-medium">
                                {lease.unit.unitNumber}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Property
                            </p>

                            <p className="font-medium">
                                {lease.unit.propertyName}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Unit Type
                            </p>

                            <p className="font-medium">
                                {lease.unit.unitTypeName}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            Lease Period
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Start Date
                            </p>

                            <p className="font-medium">
                                {formatDate(
                                    lease.startDate,
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                End Date
                            </p>

                            <p className="font-medium">
                                {formatDate(
                                    lease.endDate,
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Move In
                            </p>

                            <p className="font-medium">
                                {formatDate(
                                    lease.moveInDate,
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Move Out
                            </p>

                            <p className="font-medium">
                                {formatDate(
                                    lease.moveOutDate,
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Financial Details
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Monthly Rent
                            </span>

                            <span className="font-semibold">
                                {formatCurrency(
                                    lease.monthlyRent,
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Security Deposit
                            </span>

                            <span className="font-semibold">
                                {formatCurrency(
                                    lease.securityDeposit,
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Rent Due Day
                            </span>

                            <span className="font-medium">
                                {lease.rentDueDay}
                                {getOrdinal(
                                    lease.rentDueDay,
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Grace Period
                            </span>

                            <span className="font-medium">
                                {
                                    lease.gracePeriodDays
                                }{" "}
                                days
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notes */}
            {lease.notes && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Notes
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm whitespace-pre-wrap">
                            {lease.notes}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Previous lease */}
            {lease.previousLeaseId && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>
                            Previous Lease
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            This lease was created as a
                            renewal of another lease.
                        </p>

                        <p className="mt-1 font-medium">
                            {lease.previousLeaseId}
                        </p>
                    </CardContent>
                </Card>
            )}
        </ShowView>
    );
};

function getOrdinal(day: number) {
    if (
        day >= 11 &&
        day <= 13
    ) {
        return "th";
    }

    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

export default LeaseShow;