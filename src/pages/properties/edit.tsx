import {EditView, EditViewHeader} from "@/components/refine-ui/views/edit-view.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader2} from "lucide-react";
import {useForm} from "@refinedev/react-hook-form";
import type {BaseRecord, HttpError} from "@refinedev/core";
import {zodResolver} from "@hookform/resolvers/zod";
import {propertySchema} from "@/lib/schema.ts";
import {useParams} from "react-router";
import * as z from "zod";

type PropertyFormValues = z.infer<typeof propertySchema>;

const PropertyEdit = () => {
    const { id } = useParams();

    const form = useForm<BaseRecord, HttpError, PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        refineCoreProps: {
            resource: "properties",
            id,
            action: "edit",
            redirect: "list"
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
        <EditView>
            <EditViewHeader title="Edit Property"/>

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
                                    name="propertyType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property Type</FormLabel>

                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value ?? ""}
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
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="flex-1 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </EditView>
    )
}
export default PropertyEdit
