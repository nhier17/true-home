
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view.tsx";
import { Breadcrumb } from "@/components/ui/breadcrumb.tsx";
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { createMpesaIntegrationSchema } from "@/lib/schema.ts";
import * as z from "zod";
import { useForm } from "@refinedev/react-hook-form";
import type { BaseRecord, HttpError } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";

type MpesaFormValues = z.infer<
    typeof createMpesaIntegrationSchema
>;

const SettingsCreate = () => {
    const form = useForm<BaseRecord, HttpError, MpesaFormValues>({
        resolver: zodResolver(createMpesaIntegrationSchema),
        refineCoreProps: {
            resource: "integrations/mpesa",
            action: "create",
            redirect: "list",
        },
        defaultValues: {
            type: "PAYBILL",
            paybillNumber: "",
            accountReference: "",
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
        watch,
        setValue,
        clearErrors,
    } = form;

    const paymentType = watch("type");

    const onSubmit = async (values: MpesaFormValues) => {
        try {
            const payload: MpesaFormValues =
                values.type === "TILL"
                    ? { ...values, accountReference: "" }
                    : values;

            await onFinish(payload);
        } catch (error) {
            console.error("Failed to save M-Pesa settings:", error);
        }
    };

    return (
        <CreateView className="tenant-view">
            <div className="mb-4 flex flex-col gap-4">
                <div className="relative flex items-center gap-2">
                    <div className="z-[2] bg-background pr-4">
                        <Breadcrumb />
                    </div>
                    <Separator className="absolute left-0 right-0 z-[1]" />
                </div>

                <CreateViewHeader title="Add Payment Details" />
            </div>

            <div className="my-4 flex items-center">
                <Card className="tenant-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-base font-semibold uppercase tracking-wide text-muted-foreground">
                            Payment Account Details
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Type</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={(value: "PAYBILL" | "TILL") => {
                                                    field.onChange(value);

                                                    if (value === "TILL") {
                                                        setValue("accountReference", "", {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                        });
                                                        clearErrors("accountReference");
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select payment type" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    <SelectItem value="PAYBILL">
                                                        Paybill
                                                    </SelectItem>
                                                    <SelectItem value="TILL">
                                                        Till Number
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="paybillNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {paymentType === "PAYBILL"
                                                    ? "Paybill Number"
                                                    : "Till Number"}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    inputMode="numeric"
                                                    placeholder={
                                                        paymentType === "PAYBILL"
                                                            ? "Enter your Paybill number"
                                                            : "Enter your Till number"
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {paymentType === "PAYBILL" && (
                                    <FormField
                                        control={control}
                                        name="accountReference"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Reference</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        placeholder="e.g. 40648"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <div className="flex w-full pb-6">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Add Payment"
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

export default SettingsCreate;
