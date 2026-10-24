
import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCustomMutation, useInvalidate, useList } from "@refinedev/core";
import type { BaseRecord, HttpError } from "@refinedev/core";
import { Loader2, Pencil } from "lucide-react";

import { BACKEND_BASE_URL } from "@/constants";
import { unitSchema } from "@/lib/schema";
import type { Unit, UnitType, Block, Floor } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormValues = z.infer<typeof unitSchema>;

type EditUnitDialogProps = {
  unit: Unit;
};

const NO_SELECTION = "__no_selection__";

export function EditUnitDialog({ unit }: EditUnitDialogProps) {
  const [open, setOpen] = useState(false);
  const invalidate = useInvalidate();

  const { mutate,  mutation: { isPending: isSubmitting } } = useCustomMutation<BaseRecord, HttpError, FormValues>();

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
    control,
    reset,
    formState: { isSubmitting: isFormSubmitting },
  } = form;

  const { query: unitTypesQuery } = useList<UnitType>({
    resource: "unit-types",
    pagination: { mode: "off" },
  });

  const { query: blockQuery } = useList<Block>({
    resource: "blocks",
    pagination: { mode: "off" },
    filters: [
      {
        field: "propertyId",
        operator: "eq",
        value: unit.propertyId,
      },
    ],
  });

  const { query: floorQuery } = useList<Floor>({
    resource: "floors",
    pagination: { mode: "off" },
    filters: [
      {
        field: "propertyId",
        operator: "eq",
        value: unit.propertyId,
      },
    ],
  });

  const unitTypes = unitTypesQuery.data?.data ?? [];
  const blocks = blockQuery.data?.data ?? [];
  const floors = floorQuery.data?.data ?? [];

  const isLoadingOptions =
    unitTypesQuery.isLoading ||
    blockQuery.isLoading ||
    floorQuery.isLoading;

  useEffect(() => {
    if (open) {
      reset({
        unitNumber: unit.unitNumber,
        unitTypeId: unit.unitTypeId,
        blockId: unit.blockId ?? null,
        floorId: unit.floorId ?? null,
        defaultRent: Number(unit.defaultRent),
      });
    }
  }, [
    open,
    unit.id,
    unit.unitNumber,
    unit.unitTypeId,
    unit.blockId,
    unit.floorId,
    unit.defaultRent,
    reset,
  ]);

  const onSubmit = (data: FormValues) => {
    const values = {
      ...data,
      blockId:
        data.blockId === NO_SELECTION || !data.blockId
          ? null
          : data.blockId,
      floorId:
        data.floorId === NO_SELECTION || !data.floorId
          ? null
          : data.floorId,
    };

    mutate(
      {
        url: `${BACKEND_BASE_URL}units/${unit.id}`,
        method: "patch",
        config: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        values,
      },
      {
        onSuccess: async () => {
          await invalidate({
            resource: "units",
            invalidates: ["list"],
          });

          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Unit</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={control}
              name="unitNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. A101"
                      disabled={isSubmitting}
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
                  <FormLabel>Unit Type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingOptions || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select unit type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitTypes.map((unitType) => (
                        <SelectItem
                          key={unitType.id}
                          value={unitType.id}
                        >
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
                  <FormLabel>Block (Optional)</FormLabel>
                  <Select
                    value={field.value ?? NO_SELECTION}
                    onValueChange={field.onChange}
                    disabled={isLoadingOptions || isSubmitting}
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

            <FormField
              control={control}
              name="floorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor (Optional)</FormLabel>
                  <Select
                    value={field.value ?? NO_SELECTION}
                    onValueChange={field.onChange}
                    disabled={isLoadingOptions || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select floor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_SELECTION}>
                        No floor
                      </SelectItem>
                      {floors.map((floor) => (
                        <SelectItem key={floor.id} value={floor.id}>
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
                  <FormLabel>Default Rent</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="e.g. 25000"
                      value={field.value ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting || isFormSubmitting || isLoadingOptions}
              >
                {isSubmitting || isFormSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
