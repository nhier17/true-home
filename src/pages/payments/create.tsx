import { useEffect, useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { type BaseRecord, type HttpError, useList } from "@refinedev/core";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {CalendarIcon, FileText, Home, Loader2, User, Wallet} from "lucide-react";

import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Invoice } from "@/types";
import { paymentSchema } from "@/lib/schema.ts";
import {cn, formatCurrency} from "@/lib/utils.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {format, parseISO} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";

type PaymentFormValues = z.infer<typeof paymentSchema>;

type PaymentInvoice = Invoice & {
    paidAmount: number;
    outstandingBalance: number;
};


const PaymentCreate = () => {
    const [selectedInvoice, setSelectedInvoice] =
        useState<PaymentInvoice | null>(null);

    const form = useForm<
        BaseRecord,
        HttpError,
        PaymentFormValues
    >({
        resolver: zodResolver(paymentSchema),

        refineCoreProps: {
            resource: "payments",
            action: "create",
            redirect: "list",
        },

        defaultValues: {
            invoiceId: "",
            receiptNumber: "",
            paymentReference: "",
            amount: 0,
            paymentMethod: "MPESA",
            paidAt: new Date(),
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { isSubmitting },
    } = form;

    const selectedInvoiceId = watch("invoiceId");

    const { query: invoiceQuery } =  useList<PaymentInvoice>({
            resource: "invoices",
            pagination: {
                mode: "off",
            },
        });

    const invoices = invoiceQuery.data?.data ?? [];

    const invoiceLoading =  invoiceQuery.isLoading;

    useEffect(() => {
        const invoice = invoices.find(
            (item) =>
                item.id === selectedInvoiceId,
        );

        setSelectedInvoice(
            invoice ?? null,
        );

        if (invoice) {
            setValue(
                "amount",
                invoice.outstandingBalance,
                {
                    shouldValidate: true,
                    shouldDirty: true,
                },
            );
        }
    }, [
        selectedInvoiceId,
        invoices,
        setValue,
    ]);

    const onSubmit = async (values: PaymentFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CreateView className="tenant-view">
            <CreateViewHeader title="Record Payment" />

            <div className="intro-row">
                <p>
                    Record a payment against an
                    outstanding invoice
                </p>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="tenant-form-card">
                    <CardHeader>
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            Payment Information
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={control}
                                    name="invoiceId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Invoice{" "}
                                                <span className="text-orange-600">
                                                    *
                                                </span>
                                            </FormLabel>

                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={invoiceLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={
                                                                invoiceLoading
                                                                    ? "Loading invoices..."
                                                                    : "Select an invoice"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    {invoices.map(
                                                        (
                                                            invoice,
                                                        ) => (
                                                            <SelectItem
                                                                key={
                                                                    invoice.id
                                                                }
                                                                value={
                                                                    invoice.id
                                                                }
                                                            >
                                                                {
                                                                    invoice.invoiceNumber
                                                                }{" "}
                                                                —{" "}
                                                                {
                                                                    invoice.tenant
                                                                        ?.firstName
                                                                }{" "}
                                                                {
                                                                    invoice.tenant
                                                                        ?.lastName
                                                                }{" "}
                                                                —{" "}
                                                                {formatCurrency(
                                                                    invoice.outstandingBalance,
                                                                )}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {selectedInvoice && (
                                    <Card className="bg-muted/40">
                                        <CardContent className="pt-6">
                                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-md bg-background p-2">
                                                        <FileText className="h-4 w-4" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Invoice
                                                        </p>
                                                        <p className="font-medium">
                                                            {
                                                                selectedInvoice.invoiceNumber
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-md bg-background p-2">
                                                        <User className="h-4 w-4" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Tenant
                                                        </p>
                                                        <p className="font-medium">
                                                            {
                                                                selectedInvoice
                                                                    .tenant
                                                                    ?.firstName
                                                            }{" "}
                                                            {
                                                                selectedInvoice
                                                                    .tenant
                                                                    ?.lastName
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-md bg-background p-2">
                                                        <Home className="h-4 w-4" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Unit
                                                        </p>
                                                        <p className="font-medium">
                                                            {
                                                                selectedInvoice
                                                                    .unit
                                                                    ?.unitNumber
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-md bg-background p-2">
                                                        <Wallet className="h-4 w-4" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Outstanding
                                                        </p>
                                                        <p className="text-lg font-semibold">
                                                            {formatCurrency(
                                                                selectedInvoice.outstandingBalance,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                    <FormField
                                        control={control}
                                        name="receiptNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Receipt Number{" "}
                                                    <span className="text-orange-600">
                                                        *
                                                    </span>
                                                </FormLabel>

                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. RCPT-001"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="paymentReference"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Reference</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. M-PESA transaction code"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Amount{" "}
                                                    <span className="text-orange-600">
                                                        *
                                                    </span>
                                                </FormLabel>

                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={selectedInvoice?.outstandingBalance}
                                                        value={field.value ||  ""}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}  />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Payment Method{" "}
                                                    <span className="text-orange-600">
                                                        *
                                                    </span>
                                                </FormLabel>

                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select payment method" />
                                                        </SelectTrigger>
                                                    </FormControl>

                                                    <SelectContent>
                                                        <SelectItem value="MPESA">
                                                            M-Pesa
                                                        </SelectItem>

                                                        <SelectItem value="BANK_TRANSFER">
                                                            Bank Transfer
                                                        </SelectItem>

                                                        <SelectItem value="CASH">
                                                            Cash
                                                        </SelectItem>

                                                        <SelectItem value="CHEQUE">
                                                            Cheque
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="paidAt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Payment Date
                                                </FormLabel>

                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full text-left",
                                                                    !field.value &&
                                                                    "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? format(field.value, "PPP")
                                                                    : "Pick start date"}
                                                                <CalendarIcon className="ml-auto h-4 w-4" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>

                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                        />
                                                    </PopoverContent>
                                                </Popover>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                <div className="flex pt-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={
                                            isSubmitting ||
                                            !selectedInvoice ||
                                            selectedInvoice.outstandingBalance <=
                                            0
                                        }
                                        className="w-full flex-1 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Recording...
                                            </>
                                        ) : (
                                            "Record Payment"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default PaymentCreate;