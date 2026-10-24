import {useEffect, useState} from "react";
import {type BaseRecord, type HttpError, useCustomMutation, useInvalidate, useList} from "@refinedev/core";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {floorSchema} from "@/lib/schema.ts";
import {BACKEND_BASE_URL} from "@/constants";
import * as z from "zod";
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
import {Block, Floor} from "@/types";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

type FormValues = z.infer<typeof floorSchema>;

type EditFloorDialogProps = {
    floor: Floor;
};
const NO_SELECTION = "__no_selection__";

const EditFloorDialog = ({ floor }: EditFloorDialogProps) => {
    const [open, setOpen] = useState(false);
    const invalidate = useInvalidate();

    const {mutate, mutation: { isPending: isSubmitting }} = useCustomMutation<BaseRecord, HttpError, FormValues>();

    const form = useForm<FormValues>({
        resolver: zodResolver(floorSchema),
        defaultValues: {
            name: floor.name,
            level: floor.level,
            blockId: floor.blockId ?? undefined,
        },
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { isSubmitting: isFormSubmitting },
    } = form;

    const { query: blockQuery } = useList<Block>({
        resource: "blocks",
        pagination: {
            mode: "off",
        },
        filters: [
            {
                field: "propertyId",
                operator: "eq",
                value: floor.propertyId,
            },
        ],
    });

    const blocks = blockQuery.data?.data ?? [];
    const isLoadingBlocks = blockQuery.isLoading;

    useEffect(() => {
        if (open) {
            reset({
                name: floor.name,
                level: floor.level,
                blockId: floor.blockId ?? undefined,
            });
        }
    }, [open, floor.name, floor.level, floor.blockId, reset]);

    const onSubmit = (values: FormValues) => {
        mutate(
            {
                url: `${BACKEND_BASE_URL}floors/${floor.id}`,
                method: "patch",
                config: {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                values: {
                    name: values.name.trim(),
                    level: Number(values.level),
                    blockId:
                        values.blockId === NO_SELECTION ||
                        !values.blockId
                            ? undefined
                            : values.blockId,
                },
            },
            {
                onSuccess: async () => {
                    await invalidate({
                        resource: "floors",
                        invalidates: ["list"],
                    });

                    setOpen(false);
                    reset({
                        name: values.name.trim(),
                        level: Number(values.level),
                        blockId:
                            values.blockId === NO_SELECTION ||
                            !values.blockId
                                ? undefined
                                : values.blockId,
                    });
                },
            },
        );
    };

    const handleOpenChange = (value: boolean) => {
        setOpen(value);
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
                    <DialogTitle>Edit Floor</DialogTitle>
                    <DialogDescription>
                        Update floor details.
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
                                          name={field.name}
                                          ref={field.ref}
                                          onBlur={field.onBlur}
                                          value={field.value ?? ""}
                                          onChange={(event) =>
                                          field.onChange(
                                          event.target.value === ""
                                          ? undefined
                                          : Number(event.target.value),
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
                                    <FormLabel>Block (Optional)</FormLabel>
                                    <Select
                                        value={field.value ?? NO_SELECTION}
                                        onValueChange={field.onChange}
                                        disabled={isLoadingBlocks || isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select block" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={NO_SELECTION}>
                                                No block
                                            </SelectItem>
                                            {blocks.map((block) => (
                                                <SelectItem key={block.id} value={block.id}>
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
                                type="submit"
                                disabled={isFormSubmitting || isSubmitting || isLoadingBlocks}
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
    )
}
export default EditFloorDialog
