import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import {useBack, type BaseRecord, type HttpError} from "@refinedev/core";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import {CreateView, CreateViewHeader} from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import {propertySchema} from "@/lib/schema.ts";


type PropertyFormValues = z.infer<typeof propertySchema>;

const PropertyCreate = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError, PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        refineCoreProps: {
            resource: "properties",
            action: "create",
            redirect: "list"
        },
        defaultValues: {
            name: "",
            address: "",
            county: "",
        }
    });

    const {
        refineCore: {onFinish},
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const onSubmit = async (values: PropertyFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CreateView className="tenant-view">
            <CreateViewHeader title="Register new property" />

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="tenant-form-card">
                    <CardHeader>
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">Property Information</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form
                                className="space-y-6"
                                onSubmit={handleSubmit(onSubmit)}
                            >

                                    <FormField
                                        control={control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Property Name</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Sunrise Apartments"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Property Code</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. SUN-001"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="propertyType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Property Type</FormLabel>

                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select property type" />
                                                        </SelectTrigger>
                                                    </FormControl>

                                                    <SelectContent>
                                                        <SelectItem value="APARTMENT">
                                                            Apartment
                                                        </SelectItem>

                                                        <SelectItem value="ESTATE">
                                                            Estate
                                                        </SelectItem>

                                                        <SelectItem value="RESIDENTIAL">
                                                            Residential
                                                        </SelectItem>

                                                        <SelectItem value="COMMERCIAL">
                                                            Commercial
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="county"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>County</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Nairobi"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Along Thika Road"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        className="flex-1 cursor-pointer"
                                        onClick={() => back()}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="flex-1 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Add Property"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    )
}
export default PropertyCreate
