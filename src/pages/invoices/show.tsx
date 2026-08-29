import { useShow, useCustomMutation, useInvalidate, useNotification } from "@refinedev/core";
import { ShowView, ShowViewHeader, } from "@/components/refine-ui/views/show-view.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CalendarDays, FileText, Home, User, Wallet, } from "lucide-react";
import {cn, formatCurrency, formatDate, getStatusLabel, statusStyles} from "@/lib/utils";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useParams} from "react-router";
import {Invoice} from "@/types";
import {BACKEND_BASE_URL} from "@/constants";

const InvoiceDetails = () => {
    const { id } = useParams();
    const { mutate, mutation } = useCustomMutation();
    const invalidate = useInvalidate();
    const { open } = useNotification();

    const isIssuing = mutation.isPending;

    const invoiceId = id ?? "";

    const { query } = useShow<Invoice>({
        resource: "invoices",
        id: invoiceId,
    });

    const details = query.data?.data;
    const { isLoading, isError } = query;

    const handleIssueInvoice = () => {
        if (!details) return;

        mutate(
            {
                url: `${BACKEND_BASE_URL}invoices/${invoiceId}/issue`,
                method: "post",
                config: {
                    headers: {
                        "Content-Type": "application/json"
                    },
                },
                values: {},
            },
            {
                onSuccess: () => {
                    open?.({
                        type: "success",
                        message: "Invoice issued successfully",
                        description: `${details.invoiceNumber} has been issued.`,
                    });

                    invalidate({
                        resource: "invoices",
                        invalidates: ["detail", "list"],
                        id: invoiceId,
                    });
                },
                onError: (error) => {
                    open?.({
                        type: "error",
                        message: "Failed to issue invoice",
                        description:
                            error?.message ?? "Something went wrong.",
                    });
                },
            },
        );
    };

    if (isLoading || isError || !details) {
        return (
            <ShowView className="tenant-view">
                <ShowViewHeader resource="invoices" title="Invoice Details" />
                <p className="text-sm text-muted-foreground">
                    {query.isLoading
                        ? "Loading invoice details..."
                        : query.isError
                            ? "Failed to load invoice details."
                            : "Invoice details not found."}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="space-y-6 tenant-view">
            <ShowViewHeader resource="invoices" title={details?.invoiceNumber} />

            <div className="intro-row">
                <p>View invoice details and payment status</p>

                <div className="flex items-center gap-2">
                    {details.status === "DRAFT" && (
                        <>
                            <Button
                                variant="outline"
                            >
                                Edit
                            </Button>

                            <Button
                                onClick={handleIssueInvoice}
                                disabled={isIssuing}
                            >
                                {isIssuing ? "Issuing..." : "Issue Invoice"}
                            </Button>
                        </>
                    )}
                    {(details.status === "ISSUED" ||
                        details.status === "PARTIALLY_PAID" ||
                        details.status === "OVERDUE") && (
                            <Button> Record Payment </Button>
                    )}
                </div>
            </div>

            <Separator />
            <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" /> Invoice Information
                        </CardTitle>
                        <Badge className={cn( "border-0", statusStyles[details.status], )} > {getStatusLabel(details.status)} </Badge>
                    </div>
                </CardHeader>

                <Separator />
                <CardContent className="space-y-2">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <InfoItem label="Invoice Number" value={details.invoiceNumber} />
                        <InfoItem label="Invoice Type" value={details.invoiceType.name} />
                        <InfoItem label="Invoice Date" value={formatDate(details.invoiceDate)} icon={ <CalendarDays className="h-4 w-4" /> } />
                        <InfoItem label="Due Date" value={formatDate(details.dueDate)} icon={ <CalendarDays className="h-4 w-4" /> } />
                        <InfoItem label="Amount" value={formatCurrency(details.amount)} icon={ <Wallet className="h-4 w-4" /> } valueClassName="text-lg font-semibold" />
                        <InfoItem label="Lease" value={details.lease.leaseNumber} />
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" /> Tenant & Unit
                        </CardTitle>
                    </div>
                </CardHeader>
                <Separator />

                <CardContent className="space-y-2">
                    <div className="flex items-start gap-3">
                        <div className="rounded-md bg-muted p-2">
                            <User className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground"> Tenant </p>
                            <p className="font-medium"> {details.tenant.firstName}{" "} {details.tenant.lastName} </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="rounded-md bg-muted p-2">
                            <Home className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground"> Unit </p>
                            <p className="font-medium"> {details.unit.unitNumber} </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground"> Lease </p>
                        <p className="font-medium"> {details.lease.leaseNumber} </p>
                    </div>
                </CardContent>
            </Card>

            </div>
        </ShowView>
    )
}

type InfoItemProps = {
    label: string;
    value: string;
    icon?: React.ReactNode; valueClassName?: string;
};
function InfoItem({ label, value, icon, valueClassName, }: InfoItemProps) {
    return (
        <div>
            <p className="text-sm text-muted-foreground"> {label} </p>
            <div className="mt-1 flex items-center gap-2">
                {icon && ( <span className="text-muted-foreground"> {icon} </span> )}
                <p className={cn("font-medium", valueClassName)}> {value} </p>
            </div>
        </div>
    );
}
InvoiceDetails.displayName = "InvoiceDetails";

export default InvoiceDetails
