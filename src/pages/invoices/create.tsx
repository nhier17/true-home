import {useForm} from "@refinedev/react-hook-form";
import {CreateView, CreateViewHeader} from "@/components/refine-ui/views/create-view.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
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
import {z} from "zod";
import {type BaseRecord, type HttpError, useList} from "@refinedev/core";
import {zodResolver} from "@hookform/resolvers/zod";
import {InvoiceType, Lease} from "@/types";
import {Input} from "@/components/ui/input.tsx";
import {invoiceSchema} from "@/lib/schema.ts";
import {cn} from "@/lib/utils.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {format, parseISO} from "date-fns";
import {CalendarIcon, Loader2} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {useEffect} from "react";

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const InvoiceCreate = () => {
    const form = useForm<BaseRecord, HttpError,InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        refineCoreProps: {
            resource: "invoices",
            action: "create",
            redirect: "list"
        },
        defaultValues: {
            leaseId: "",
            invoiceTypeId: "",
            invoiceNumber: "",
            invoiceDate: "",
            dueDate: "",
            amount: 0,
        }
    });

    const {
        refineCore: {onFinish},
        handleSubmit,
        control,
        formState: {isSubmitting},
        watch,
        setValue
    } = form;

    const { query: invoiceTypeQuery } = useList<InvoiceType>({
        resource: "invoice-type",
        pagination: {
            mode: "off",
        },
    });

    const { query: leaseQuery} = useList<Lease>({
        resource: "leases",
        pagination: {
            mode: "off",
        },
    })

    const leases = leaseQuery?.data?.data || [];
    const invoiceTypes = invoiceTypeQuery?.data?.data || [];

    const leaseLoading = leaseQuery?.isLoading;
    const invoiceTypeLoading = invoiceTypeQuery?.isLoading;

    const selectedLeaseId = watch("leaseId");
    const selectedInvoiceTypeId = watch("invoiceTypeId");

    const selectedLease = leases.find(
        (lease) => lease.id === selectedLeaseId,
        );

    const selectedInvoiceType = invoiceTypes.find(
        (type) => type.id === selectedInvoiceTypeId,
        );

    useEffect(() => {
        if (
            selectedLease && selectedInvoiceType?.name?.toLowerCase() === "rent"
        ) {
            setValue("amount", selectedLease.monthlyRent);
        }
        }, [
        selectedLease,
        selectedInvoiceType,
        setValue
    ]);

    const onSubmit = async (values: InvoiceFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CreateView className="tenant-view">
            <CreateViewHeader title="Create Invoice" />

            <div className="intro-row">
                <p>Provide the required information to create an invoice</p>
            </div>

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
                                    name="leaseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Lease <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value ?? ""}
                                                disabled={leaseLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select lease number" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {leases.map((lease) => (
                                                        <SelectItem
                                                            key={lease.id}
                                                            value={String(lease.id)}
                                                        >
                                                            {lease.leaseNumber} —{" "} {lease.tenant.firstName}{" "} {lease.tenant.lastName}{" "} — Unit{" "} {lease.unit.unitNumber}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="invoiceTypeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Invoice type <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value ?? ""}
                                                disabled={invoiceTypeLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select invoice type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {invoiceTypes.map((type) => (
                                                        <SelectItem
                                                            key={type.id}
                                                            value={String(type.id)}
                                                        >
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="invoiceNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Invoice number <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="INV-001" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

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
                                                    placeholder="Enter amount"
                                                    {...field}
                                                />
                                            </FormControl>
                                            {selectedInvoiceType?.name?.toLowerCase() === "rent"
                                                && selectedLease && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Monthly rent for this lease:{" "} KES{" "} {selectedLease.monthlyRent.toLocaleString()}
                                                    </p> )}
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
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Invoice"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    )
}
export default InvoiceCreate
