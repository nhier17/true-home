import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";
import { useCustomMutation, useInvalidate, useList, type BaseRecord, type HttpError } from "@refinedev/core";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
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
import {unitSchema} from "@/lib/schema.ts";
import { BACKEND_BASE_URL } from "@/constants";
import {Block, Floor, UnitType} from "@/types";


type FormValues = z.infer<typeof unitSchema>;
type CreateUnitPayload = FormValues & {
    propertyId: string;
};

type AddUnitDialogProps = {
    propertyId: string;
};

const AddUnitDialog = ({ propertyId }: AddUnitDialogProps) => {
    const [open, setOpen] = useState(false);
    const invalidate = useInvalidate();

    const { mutate, mutation: { isPending: isSubmitting} } = useCustomMutation<BaseRecord, HttpError, CreateUnitPayload>();

    const form = useForm<FormValues>({
        resolver: zodResolver(unitSchema),
        defaultValues: {
            unitNumber: "",
            unitTypeId: "",
            blockId: null,
            floorId: null,
            defaultRent: undefined,
        },
    });

    const {
        handleSubmit,
        formState: { isLoading },
        control,
        reset,
    } = form;

    const { query: unitTypesQuery } = useList<UnitType>({
        resource: "unit-types",
        pagination: {
            mode: "off",
        },
    });
    const { query: blockQuery } = useList<Block>({
        resource: "blocks",
        pagination: {
            mode: "off",
        },
    });

    const { query: floorQuery } = useList<Floor>({
        resource: "floors",
        pagination: {
            mode: "off",
        },
    });

    const unitTypes = unitTypesQuery?.data?.data || [];
    const blocks = blockQuery?.data?.data || [];
    const floors = floorQuery?.data?.data || [];
    const isLoadingUnitTypes = unitTypesQuery?.isLoading || false;
    const isLoadingBlocks = blockQuery?.isLoading || false;
    const isLoadingFloors = floorQuery?.isLoading || false;

    const onSubmit = (data: FormValues) => {
        try {
            mutate(
                {
                    url: `${BACKEND_BASE_URL}units`,
                    method: "post",
                    config: {
                        headers: {
                            "Content-Type": "application/json"
                        },
                    },
                    values: {
                        ...data,
                        propertyId
                    }
                },
                {
                    onSuccess: async () => {
                        await invalidate({
                            resource: "units",
                            invalidates: ["list"],
                        })
                        setOpen(false);
                        reset();
                    }
                }
            )
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Unit
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Unit</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={control}
                            name="unitNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Unit Number
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="e.g. A101"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="unitTypeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Unit Type
                                    </FormLabel>

                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ? String(field.value) : ""}
                                        disabled={isLoadingUnitTypes}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select unit type" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {unitTypes.map((unitType) => (
                                                    <SelectItem  key={unitType.id}  value={unitType.id}>
                                                        {unitType.name}
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
                            name="blockId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Block{" "}
                                        <span className="text-muted-foreground">
                                            (optional)
                                        </span>
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

                        <FormField
                            control={control}
                            name="floorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Floor{" "}
                                        <span className="text-muted-foreground">
                                            (optional)
                                        </span>
                                    </FormLabel>

                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ? String(field.value) : ""}
                                        disabled={isLoadingFloors}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select floor" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {floors.map((floor) => (
                                                <SelectItem  key={floor.id}  value={floor.id}>
                                                    {floor.name}
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
                            name="defaultRent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Default Rent
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            placeholder="e.g. 25000"
                                            onChange={(e) => field.onChange(Number(e.target.value))}
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
                                    setOpen(false)
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
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Unit
                                    </>
                                )}
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default AddUnitDialog
