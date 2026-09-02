import { ArrowRight, CreditCard, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DashboardRecentPayment } from "@/types";
import {formatCurrency} from "@/lib/utils.ts";

type RecentPaymentsProps = {
    payments: DashboardRecentPayment[];
};


const paymentMethodLabel: Record<DashboardRecentPayment["paymentMethod"], string> = {
    MPESA: "M-Pesa",
    BANK_TRANSFER: "Bank Transfer",
    CASH: "Cash",
    CHEQUE: "Cheque",
};

const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));

export const RecentPayments = ({
                                   payments,
                               }: RecentPaymentsProps) => {

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Payments</CardTitle>

                <Button variant="ghost" size="sm" asChild>
                    <a href="/payments">
                        View all
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                </Button>
            </CardHeader>

            <CardContent>
                {payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Receipt className="mb-2 h-8 w-8 text-muted-foreground" />

                        <p className="font-medium">No payments yet</p>

                        <p className="text-sm text-muted-foreground">
                            Payments will appear here once recorded.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {payments.slice(0, 5).map((payment) => (
                            <div
                                key={payment.id}
                                className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
                                        <CreditCard className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-medium">
                                            {payment.tenant.firstName} {payment.tenant.lastName}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            <span>{payment.receiptNumber}</span>
                                            <span>•</span>
                                            <span>{payment.invoice.invoiceNumber}</span>
                                            <span>•</span>
                                            <span>{formatDate(payment.paidAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="font-semibold text-emerald-600">
                                        {formatCurrency(payment.amount)}
                                    </p>

                                    <Badge variant="secondary" className="mt-1 text-xs">
                                        {paymentMethodLabel[payment.paymentMethod]}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};