import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    BaseRecord,
    HttpError,
    useCustomMutation,
    useInvalidate,
} from "@refinedev/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BACKEND_BASE_URL } from "@/constants";

const renewSchema = z.object({
    endDate: z.string().regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "End date must be in YYYY-MM-DD format"
    ),
    monthlyRent: z.number().int().positive("Monthly rent must be greater than 0"),
});

type FormValues = z.infer<typeof renewSchema>;

type Lease = {
    id: string;
    leaseNumber: string;
    endDate: string;
    monthlyRent: number;
};

type RenewLeaseDialogProps = {
    lease: Lease;
};

const getNextDay = (date: string) => {
    const nextDate = new Date(
        `${date}T00:00:00`,
    );

    nextDate.setDate(
        nextDate.getDate() + 1,
    );

    return nextDate
        .toISOString()
        .slice(0, 10);
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(
        "en-KE",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
    ).format(
        new Date(`${date}T00:00:00`),
    );
};

export const RenewLeaseDialog = ({
                                     lease,
                                 }: RenewLeaseDialogProps) => {
    const [open, setOpen] = useState(false);

    const invalidate = useInvalidate();

    const { mutate } = useCustomMutation<BaseRecord, HttpError, FormValues>();

    const renewalStartDate =  getNextDay(lease.endDate);

    const form = useForm<FormValues>({
            resolver:  zodResolver(renewSchema),
            defaultValues: {
                endDate: "",
                monthlyRent:
                lease.monthlyRent,
            },
        });

    const {
        handleSubmit,
        reset,
        control,
        formState: { isLoading },
    } = form;

    useEffect(() => {
        if (open) {
            reset({
                endDate: "",
                monthlyRent:
                lease.monthlyRent,
            });
        }
    }, [
        open,
        lease.monthlyRent,
        reset,
    ]);

    const onSubmit = (
        data: FormValues,
    ) => {
        mutate(
            {
                url: `${BACKEND_BASE_URL}/leases/${lease.id}/renew`,
                method: "post",
                config: {
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                },
                values: data,
            },
            {
                onSuccess: async () => {
                    setOpen(false);

                    await invalidate({
                        resource: "leases",
                        invalidates: [
                            "list",
                            "detail",
                        ],
                    });
                },
            },
        );
    };

    return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Renew Lease</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Renew Lease
                        </DialogTitle>

                        <DialogDescription>
                            Renew{" "}
                            {
                                lease.leaseNumber
                            }{" "}
                            for another
                            lease period.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
                                <div className="flex justify-between gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        Current end date
                                    </span>

                                    <span className="text-sm font-medium">
                                        {formatDate(
                                            lease.endDate,
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        Renewal starts
                                    </span>

                                    <span className="text-sm font-medium">
                                        {formatDate(
                                            renewalStartDate,
                                        )}
                                    </span>
                                </div>
                            </div>

                            <FormField
                                control={control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            New end date
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="date"
                                                min={renewalStartDate}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="monthlyRent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Monthly rent
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                step={1}
                                                {...field}
                                                onChange={(
                                                    event,
                                                ) =>
                                                    field.onChange(
                                                        Number(
                                                            event
                                                                .target
                                                                .value,
                                                        ),
                                                    )
                                                }
                                            />
                                        </FormControl>

                                        <FormMessage />

                                        <p className="text-xs text-muted-foreground">
                                            Leave the
                                            current
                                            amount if
                                            the rent is
                                            unchanged.
                                        </p>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}

                                    Renew Lease
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
    );
};