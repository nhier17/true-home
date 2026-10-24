import React from 'react'
import {invoiceSchema} from "@/lib/schema.ts";
import * as z from "zod";
import {EditView, EditViewHeader} from "@/components/refine-ui/views/edit-view.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {format, parseISO} from "date-fns";
import {CalendarIcon, Loader2} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useParams} from "react-router";
import {useForm} from "@refinedev/react-hook-form";
import type {BaseRecord, HttpError} from "@refinedev/core";
import {zodResolver} from "@hookform/resolvers/zod";
import {editLeaseSchema} from "@/pages/leases/edit.tsx";

export const editInvoiceSchema = invoiceSchema
    .omit({
        leaseId: true,
        invoiceTypeId: true,
    })
    .refine(
        (values) => values.dueDate >= values.invoiceDate,
        {
            message: "Due date must be on or after the start date",
            path: ["dueDate"],
        },
    );

type InvoiceFormValues = z.infer<typeof editInvoiceSchema>;

const InvoiceEdit = () => {
    const { id } = useParams();

    const form = useForm<BaseRecord, HttpError, InvoiceFormValues>({
        resolver: zodResolver(editInvoiceSchema),
        refineCoreProps: {
            resource: "invoices",
            id,
            action: "edit",
            redirect: "list",
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const onSubmit = async (values: InvoiceFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error updating lease:", error);
        }
    };
    return (
        <EditView>
            <EditViewHeader title="Edit Invoice" />

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="tenant-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle>Invoice Information</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={control}
                                    name="invoiceDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Invoice Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value &&
                                                                "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(parseISO(field.value), "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}

                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>

                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value
                                                                ? parseISO(field.value)
                                                                : undefined
                                                        }
                                                        onSelect={(date) =>
                                                            field.onChange(
                                                                date
                                                                    ? format(
                                                                        date,
                                                                        "yyyy-MM-dd"
                                                                    )
                                                                    : ""
                                                            )
                                                        }
                                                        disabled={(date) =>
                                                            date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Due Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value &&
                                                                "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(parseISO(field.value), "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}

                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>

                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value
                                                                ? parseISO(field.value)
                                                                : undefined
                                                        }
                                                        onSelect={(date) =>
                                                            field.onChange(
                                                                date
                                                                    ? format(
                                                                        date,
                                                                        "yyyy-MM-dd"
                                                                    )
                                                                    : ""
                                                            )
                                                        }
                                                        disabled={(date) =>
                                                            date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Amount <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    value={field.value ?? ""}
                                                    placeholder="Enter amount"
                                                    onChange={(e) => {
                                                        field.onChange(
                                                            e.target.value === ""
                                                                ? undefined
                                                                : Number(e.target.value)
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="flex-1 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </EditView>
    )
}
export default InvoiceEdit
