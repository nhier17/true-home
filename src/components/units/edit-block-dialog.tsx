import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader2, Pencil} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {type BaseRecord, type HttpError, useCustomMutation, useInvalidate} from "@refinedev/core";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {blockSchema} from "@/lib/schema.ts";
import * as z from "zod";
import type {Block} from "@/types";
import {BACKEND_BASE_URL} from "@/constants";

type FormValues = z.infer<typeof blockSchema>;

type EditBlockDialogProps = {
    block: Block;
};

const EditBlockDialog = ({ block }: EditBlockDialogProps) => {
    const [open, setOpen] = useState(false);
    const invalidate = useInvalidate();

    const {
        mutate,
        mutation: { isPending: isSubmitting },
    } = useCustomMutation<BaseRecord, HttpError, FormValues>();

    const form = useForm<FormValues>({
        resolver: zodResolver(blockSchema),
        defaultValues: {
            name: block.name,
        },
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { isSubmitting: isFormSubmitting },
    } = form;

    useEffect(() => {
        if (open) {
            reset({
                name: block.name,
            });
        }
    }, [open, block.name, reset]);

    const onSubmit = (values: FormValues) => {
        mutate(
            {
                url: `${BACKEND_BASE_URL}blocks/${block.id}`,
                method: "patch",
                config: {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                values: {
                    name: values.name,
                },
            },
            {
                onSuccess: async () => {
                    await invalidate({
                        resource: "blocks",
                        invalidates: ["list"],
                    });

                    await invalidate({
                        resource: "floors",
                        invalidates: ["list"],
                    });

                    reset({
                        name: block.name,
                    });
                    setOpen(false);
                },
            },
        );
    };

    const handleOpenChange = (value: boolean) => {
        setOpen(value);

        if (!value) {
            reset({
                name: block.name,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Block</DialogTitle>
                    <DialogDescription>
                        Update the block name.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Block Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Block A"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isFormSubmitting || isSubmitting}
                            >
                                {isFormSubmitting || isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBlockDialog;

