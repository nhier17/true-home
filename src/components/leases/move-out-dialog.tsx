import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

const moveOutSchema = z.object({
    moveOutDate: z.string().regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "End date must be in YYYY-MM-DD format"
    ),
    terminationReason: z.string().trim().min(1,
            "Termination reason is required",
        )
        .max(
            500,
            "Termination reason cannot exceed 500 characters",
        ),
});

type FormValues = z.infer<typeof moveOutSchema>;

type Lease = {
    id: string;
    leaseNumber: string;
    endDate: string;
};

type MoveOutLeaseDialogProps = {
    lease: Lease;
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

export const MoveOutLeaseDialog = ({
                                       lease,
                                   }: MoveOutLeaseDialogProps) => {
    const [open, setOpen] =  useState(false);

    const invalidate =  useInvalidate();

    const { mutate } = useCustomMutation<BaseRecord, HttpError, FormValues>();

    const form = useForm<FormValues>({
            resolver: zodResolver(moveOutSchema),
            defaultValues: {
                moveOutDate: "",
                terminationReason: "",
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
                moveOutDate: "",
                terminationReason: "",
            });
        }
    }, [open, reset]);

    const onSubmit = (
        data: FormValues,
    ) => {
        mutate(
            {
                url: `${BACKEND_BASE_URL}/leases/${lease.id}/move-out`,
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

                    await invalidate({
                        resource: "units",
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
                    <Button variant="outline">Move Out</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Move Out Tenant
                        </DialogTitle>

                        <DialogDescription>
                            Record the move-out
                            for{" "}
                            {
                                lease.leaseNumber
                            }.
                            The lease will be
                            marked as expired
                            and the unit will
                            become vacant.
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
                                        Lease end date
                                    </span>

                                    <span className="text-sm font-medium">
                                        {formatDate(
                                            lease.endDate,
                                        )}
                                    </span>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    The move-out
                                    date can be
                                    different
                                    from the
                                    original
                                    lease end
                                    date.
                                </div>
                            </div>

                            <FormField
                                control={control}
                                name="moveOutDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Move-out date
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="terminationReason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Reason
                                        </FormLabel>

                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g. Tenant moved out"
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                                <p className="text-sm font-medium">
                                    This action will:
                                </p>

                                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                    <li>
                                        Mark the
                                        lease as
                                        expired
                                    </li>

                                    <li>
                                        Set the
                                        move-out
                                        date
                                    </li>

                                    <li>
                                        Mark the
                                        unit as
                                        vacant
                                    </li>
                                </ul>
                            </div>

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
                                    variant="destructive"
                                    disabled={isLoading}
                                >
                                    {isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}

                                    Confirm Move Out
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
    );
};