import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";
import { useCustomMutation, useInvalidate, type BaseRecord, type HttpError, useList } from "@refinedev/core";
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BACKEND_BASE_URL } from "@/constants";
import { floorSchema } from "@/lib/schema";
import { Block } from "@/types";

type FloorFormValues = z.infer<typeof floorSchema>;
type CreateFloorPayload = FloorFormValues & {
    propertyId: string;
};

type AddFloorDialogProps = {
    propertyId: string;
};

const AddFloorDialog = ({ propertyId  }: AddFloorDialogProps) => {
    const [open, setOpen] = useState(false);
    const invalidate = useInvalidate();

    const { mutate } = useCustomMutation<BaseRecord, HttpError, CreateFloorPayload>();

    const { query: blocksQuery } = useList<Block>({
        resource: "blocks",
        pagination: { mode: "off" }
    });

    const blocks = blocksQuery.data?.data ?? [];
    const isLoadingBlocks = blocksQuery.isLoading;


    const form = useForm<FloorFormValues>({
        resolver: zodResolver(floorSchema),
        defaultValues: {
            blockId: undefined,
            name: "",
            level: 1,
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isLoading },
    } = form;

    const onSubmit = (data: FloorFormValues) => {
        mutate(
            {
                url: `${BACKEND_BASE_URL}floors`,
                method: "post",
                config: {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                values: {
                    ...data,
                    propertyId
                },
            },
            {
                onSuccess: async () => {
                    await invalidate({
                        resource: "floors",
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
        <Dialog open={open}  onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Floor
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Floor
                    </DialogTitle>

                    <DialogDescription>
                        Add a floor to this property.
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
                                        Floor Name
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Floor 1"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Level
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={1}
                                            {...field}
                                            onChange={(event) =>
                                                field.onChange(
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="blockId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Block
                                    </FormLabel>

                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ? String(field.value) : ""}
                                        disabled={isLoadingBlocks}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select block" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {blocks.map((block) => (
                                                <SelectItem  key={block.id}  value={block.id}>
                                                    {block.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

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
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add Floor"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddFloorDialog;