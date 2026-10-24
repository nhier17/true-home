import * as z from "zod";
import {EditView, EditViewHeader} from "@/components/refine-ui/views/edit-view.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {format, parseISO} from "date-fns";
import {CalendarIcon, Loader2} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "@refinedev/react-hook-form";
import {type BaseRecord, type HttpError } from "@refinedev/core";
import {zodResolver} from "@hookform/resolvers/zod";
import {leaseSchema} from "@/lib/schema.ts";
import {useParams} from "react-router";

export const editLeaseSchema = leaseSchema
    .omit({
        tenantId: true,
        unitId: true,
    })
    .refine(
        (values) => values.endDate >= values.startDate,
        {
            message: "End date must be on or after the start date",
            path: ["endDate"],
        },
    );


type LeaseEditFormValues = z.infer<typeof editLeaseSchema>;

const LeaseEdit = () => {
    const { id } = useParams();

    const form = useForm<BaseRecord, HttpError, LeaseEditFormValues>({
        resolver: zodResolver(editLeaseSchema),
        refineCoreProps: {
            resource: "leases",
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

    const onSubmit = async (values: LeaseEditFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error updating lease:", error);
        }
    };

    return (
        <EditView>
            <EditViewHeader title="Edit Lease" />

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="tenant-form-card">
                    <CardHeader>
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            Update Lease Information
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
export default LeaseEdit
