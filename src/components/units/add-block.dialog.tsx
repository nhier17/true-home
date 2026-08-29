import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";
import { useCustomMutation, useInvalidate, type BaseRecord, type HttpError } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { BACKEND_BASE_URL } from "@/constants";

const blockSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Block name is required")
        .max(255, "Block name is too long"),
});

type BlockFormValues = z.infer<typeof blockSchema>;
type CreateBlockPayload = BlockFormValues & {
    propertyId: string;
};

type AddBlockDialogProps = {
    propertyId: string;
};

const AddBlockDialog = ({ propertyId }: AddBlockDialogProps) => {
    const [open, setOpen] = useState(false);
    const invalidate = useInvalidate();

    const { mutate, mutation: { isPending: isSubmitting} } = useCustomMutation<BaseRecord, HttpError, CreateBlockPayload>();

    const form = useForm<BlockFormValues>({
        resolver: zodResolver(blockSchema),
        defaultValues: {
            name: "",
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isLoading },
    } = form;

    const onSubmit = (values: BlockFormValues) => {
        mutate(
            {
                url: `${BACKEND_BASE_URL}/blocks`,
                method: "post",
                config: {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                values: {
                    propertyId,
                    name: values.name,
                },
            },
            {
                onSuccess: async () => {
                    await invalidate({
                        resource: "blocks",
                        invalidates: ["list"],
                    });

                    reset();
                    setOpen(false);
                },
            },
        );
    };

    const handleOpenChange = (value: boolean) => {
        setOpen(value);

        if (!value) {
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}
        >
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Block
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Block
                    </DialogTitle>

                    <DialogDescription>
                        Add a block to this property.
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
                                    <FormLabel>
                                        Block Name
                                    </FormLabel>

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
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    handleOpenChange(false)
                                }
                                disabled={isLoading || isSubmitting}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={isLoading || isSubmitting}
                            >
                                {isLoading || isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add Block"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddBlockDialog;