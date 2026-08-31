import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import {useBack, useList, type BaseRecord, type HttpError} from "@refinedev/core";
import * as z from "zod";
import {CalendarIcon, Loader2} from "lucide-react";

import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {format, parseISO} from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Tenant, Unit} from "@/types";
import {cn, getToday} from "@/lib/utils.ts";
import {leaseSchema} from "@/lib/schema.ts";



type LeaseFormValues = z.infer<typeof leaseSchema>;

const LeaseCreate = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError,LeaseFormValues>({
        resolver: zodResolver(leaseSchema),
        refineCoreProps: {
            resource: "leases",
            action: "create",
            redirect: "list",
        },
        defaultValues: {
            leaseNumber: "",
            tenantId: "",
            unitId: "",
            startDate: "",
            endDate: "",
            moveInDate: "",
            monthlyRent: 0,
            securityDeposit: 0,
            rentDueDay: 5,
            gracePeriodDays: 3
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const onSubmit = async (values: LeaseFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error creating lease:", error);
        }
    };

    const { query: tenantsQuery } = useList<Tenant>({
        resource: "tenants",
        pagination: { mode: "off"}
    });

    const { query: unitsQuery } = useList<Unit>({
        resource: "units",
        pagination: { mode: "off"}
    });

    const tenants = tenantsQuery.data?.data ?? [];
    const units = unitsQuery.data?.data ?? [];

    const isLoadingTenants = tenantsQuery?.isLoading;
    const isLoadingUnits = unitsQuery?.isLoading;

    return (
        <CreateView className="tenant-view">
            <CreateViewHeader title="Create a lease" />

            <div className="intro-row">
                <p>Provide the required information below to create a lease.</p>
                <Button onClick={() => back()} variant="outline">Go Back</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="tenant-form-card">
                    <CardHeader>
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            Lease Information
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                <section className="space-y-5">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Lease & Parties
                                        </h3>
                                    </div>

                                        <FormField
                                            control={control}
                                            name="leaseNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Lease Number</FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            placeholder="LEASE-2026-004"
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="tenantId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tenant</FormLabel>

                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value ? String(field.value) : ""}
                                                        disabled={isLoadingTenants}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select tenant" />
                                                            </SelectTrigger>
                                                        </FormControl>

                                                        <SelectContent>
                                                            {tenants.map((tenant) => (
                                                                <SelectItem
                                                                    key={tenant.id}
                                                                    value={tenant.id}
                                                                >
                                                                    {tenant.firstName}{" "}
                                                                    {tenant.lastName}
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
                                            name="unitId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Unit</FormLabel>

                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value ? String(field.value) : ""}
                                                        disabled={isLoadingUnits}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select unit" />
                                                            </SelectTrigger>
                                                        </FormControl>

                                                        <SelectContent>
                                                            {units.map((unit) => (
                                                                <SelectItem
                                                                    key={unit.id}
                                                                    value={unit.id}
                                                                >
                                                                    {unit.unitNumber} — {unit.propertyName} — {unit.unitTypeName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                </section>

                                <Separator />

                                <section className="space-y-5">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Lease Period
                                        </h3>
                                    </div>

                                        <FormField
                                            control={control}
                                            name="startDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Start Date</FormLabel>
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
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="endDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>End Date</FormLabel>
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
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="moveInDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Move in Date</FormLabel>
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
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                </section>

                                <Separator />

                                <section className="space-y-5">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Financial Terms
                                        </h3>

                                    </div>

                                        <FormField
                                            control={control}
                                            name="monthlyRent"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Monthly Rent</FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            step={1}
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="securityDeposit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Security Deposit</FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            step={1}
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="rentDueDay"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Rent Due Day
                                                    </FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            max={31}
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="gracePeriodDays"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Grace Period (Days)</FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={30}
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                </section>

                                <Separator />

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
                                            "Create Lease"
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

export default LeaseCreate;