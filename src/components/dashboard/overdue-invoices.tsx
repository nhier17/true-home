import { AlertCircle, ArrowRight, FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OverdueInvoice } from "@/types";
import {formatCurrency} from "@/lib/utils.ts";

type OverdueInvoicesProps = {
    invoices: OverdueInvoice[];
};


const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));

export const OverdueInvoices = ({
                                    invoices,
                                }: OverdueInvoicesProps) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Overdue Invoices</CardTitle>

                    {invoices.length > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""} need
                            attention
                        </p>
                    )}
                </div>

                <Button variant="ghost" size="sm" asChild>
                    <a href="/invoices">
                        View all
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                </Button>
            </CardHeader>

            <CardContent>
                {invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
                            <AlertCircle className="h-5 w-5" />
                        </div>

                        <p className="font-medium">No overdue invoices</p>

                        <p className="text-sm text-muted-foreground">
                            Great! All invoices are currently up to date.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {invoices.slice(0, 5).map((invoice) => (
                            <div
                                key={invoice.id}
                                className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40">
                                        <FileWarning className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-medium">{invoice.invoiceNumber}</p>

                                        <p className="truncate text-sm text-muted-foreground">
                                            {invoice.tenant.firstName} {invoice.tenant.lastName}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Due {formatDate(invoice.dueDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="font-semibold text-red-600">
                                        {formatCurrency(invoice.amount)}
                                    </p>

                                    <Badge variant="destructive" className="mt-1 text-xs">
                                        Overdue
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