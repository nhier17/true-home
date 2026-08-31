import { useParams, useNavigate } from "react-router";
import { useShow } from "@refinedev/core";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view.tsx";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
    CalendarDays,
    CreditCard,
    FileText,
    Home,
    Receipt,
    User,
    Wallet,
} from "lucide-react";

import { formatCurrency, formatDate, formatDateTime, cn } from "@/lib/utils";
import { Payment, PaymentMethod } from "@/types";

const paymentMethodLabels: Record<
    PaymentMethod,
    string
> = {
    MPESA: "M-Pesa",
    BANK_TRANSFER: "Bank Transfer",
    CASH: "Cash",
    CHEQUE: "Cheque",
};

const invoiceStatusLabels: Record<
    string,
    string
> = {
    DRAFT: "Draft",
    ISSUED: "Issued",
    PARTIALLY_PAID: "Partially Paid",
    PAID: "Paid",
    OVERDUE: "Overdue",
    VOID: "Void",
};

const invoiceStatusStyles: Record<
    string,
    string
> = {
    DRAFT: "bg-muted text-muted-foreground",
    ISSUED: "bg-blue-100 text-blue-700",
    PARTIALLY_PAID: "bg-yellow-100 text-yellow-700",
    PAID: "bg-green-100 text-green-700",
    OVERDUE: "bg-red-100 text-red-700",
    VOID: "bg-gray-100 text-gray-700",
};

const PaymentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const paymentId = id ?? "";

    const { query } = useShow<Payment>({
        resource: "payments",
        id: paymentId,
    });

    const payment = query.data?.data;

    if (query.isLoading || query.isError || !payment ) {
        return (
            <ShowView className="tenant-view">
                <ShowViewHeader resource="payments" title="Payment Details" />

                <p className="text-sm text-muted-foreground">
                    {query.isLoading
                        ? "Loading payment details..."
                        : query.isError
                            ? "Failed to load payment details."
                            : "Payment details not found."}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="tenant-view space-y-6">
            <ShowViewHeader resource="payments" title={payment.receiptNumber} />

            <div className="intro-row">
                <p>
                    View payment and invoice details
                </p>

                <Button
                    variant="outline"
                    onClick={() =>
                        navigate(
                            `/invoices/show/${payment.invoiceId}`,
                        )
                    }
                >
                    <FileText className="mr-2 h-4 w-4" />
                    View Invoice
                </Button>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            Payment Information
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="space-y-5">
                        <InfoItem
                            label="Receipt Number"
                            value={payment.receiptNumber}
                        />

                        <InfoItem
                            label="Amount"
                            value={formatCurrency(
                                payment.amount,
                            )}
                            icon={
                                <Wallet className="h-4 w-4" />
                            }
                            valueClassName="text-lg font-semibold"
                        />

                        <InfoItem
                            label="Payment Method"
                            value={
                                paymentMethodLabels[
                                    payment.paymentMethod
                                    ]
                            }
                            icon={
                                <CreditCard className="h-4 w-4" />
                            }
                        />

                        <InfoItem  label="Payment Reference" value={payment.paymentReference || "—"} />

                        <InfoItem label="Paid At" value={formatDateTime(payment.paidAt)}
                            icon={<CalendarDays className="h-4 w-4" />}
                        />

                        {payment.notes && (
                            <InfoItem
                                label="Notes"
                                value={payment.notes}
                            />
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Invoice Information
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="space-y-5">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Invoice Number
                            </p>

                            <p className="font-medium">
                                {payment.invoice.invoiceNumber}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Invoice Amount
                            </p>

                            <p className="text-lg font-semibold">
                                {formatCurrency(payment.invoice.amount)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-1">
                                Status
                            </p>

                            <Badge
                                className={cn(
                                    "border-0",
                                    invoiceStatusStyles[
                                        payment.invoice
                                            .status
                                        ],
                                )}
                            >
                                {
                                    invoiceStatusLabels[
                                        payment.invoice
                                            .status
                                        ]
                                }
                            </Badge>
                        </div>

                        <InfoItem
                            label="Invoice Date"
                            value={formatDate(
                                payment.invoice
                                    .invoiceDate,
                            )}
                            icon={
                                <CalendarDays className="h-4 w-4" />
                            }
                        />

                        <InfoItem
                            label="Due Date"
                            value={formatDate(
                                payment.invoice
                                    .dueDate,
                            )}
                            icon={
                                <CalendarDays className="h-4 w-4" />
                            }
                        />
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Tenant & Unit
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="space-y-5">
                        <div className="flex items-start gap-3">
                            <div className="rounded-md bg-muted p-2">
                                <User className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tenant
                                </p>

                                <p className="font-medium">
                                    {payment.tenant.firstName}{" "}
                                    {payment.tenant.lastName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="rounded-md bg-muted p-2">
                                <Home className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Unit
                                </p>

                                <p className="font-medium">
                                    {payment.unit.unitNumber}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle>
                        Payment Summary
                    </CardTitle>
                </CardHeader>

                <Separator />

                <CardContent>
                    <div className="grid gap-6 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Invoice Amount
                            </p>

                            <p className="text-lg font-semibold">
                                {formatCurrency(
                                    payment.invoice.amount,
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                This Payment
                            </p>

                            <p className="text-lg font-semibold">
                                {formatCurrency(
                                    payment.amount,
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Invoice Status
                            </p>

                            <Badge
                                className={cn(
                                    "mt-1 border-0",
                                    invoiceStatusStyles[
                                        payment.invoice
                                            .status
                                        ],
                                )}
                            >
                                {
                                    invoiceStatusLabels[
                                        payment.invoice
                                            .status
                                        ]
                                }
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </ShowView>
    );
};

type InfoItemProps = {
    label: string;
    value: string;
    icon?: React.ReactNode;
    valueClassName?: string;
};

const InfoItem = ({
                      label,
                      value,
                      icon,
                      valueClassName,
                  }: InfoItemProps) => {
    return (
        <div>
            <p className="text-sm text-muted-foreground">
                {label}
            </p>

            <div className="flex items-center gap-2">
                {icon}
                <p
                    className={cn(
                        "font-medium",
                        valueClassName,
                    )}
                >
                    {value}
                </p>
            </div>
        </div>
    );
};

export default PaymentDetails;