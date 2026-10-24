import * as z from "zod";
import {EditView, EditViewHeader} from "@/components/refine-ui/views/edit-view.tsx";
import {useForm} from "@refinedev/react-hook-form";
import type {BaseRecord, HttpError} from "@refinedev/core";
import {zodResolver} from "@hookform/resolvers/zod";
import {tenantSchema} from "@/lib/schema.ts";
import {Separator} from "@/components/ui/separator.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Briefcase, IdCard, Loader2, Mail, Phone, ShieldCheck, User, Users} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import UploadWidget from "@/components/upload-widget.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useParams} from "react-router";

type TenantFormValues = z.infer<typeof tenantSchema>;

const TenantEdit = () => {
    const { id } = useParams();

    const form = useForm<BaseRecord, HttpError, TenantFormValues>({
        resolver: zodResolver(tenantSchema),
        refineCoreProps: {
            resource: "tenants",
            id,
            action: "edit",
            redirect: "show",
        }
    });

    const {
        refineCore: {onFinish},
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const onSubmit = async (values: TenantFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error(error);
        }
    };

    const imagePublicId = form.watch("imageCldPubId");

    return (
        <EditView>
            <EditViewHeader title="Edit Tenant" />

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="tenant-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">Update Tenant Information</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                <FormField
                                    control={control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                First Name<span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="Enter first name"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Last Name <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="Enter last name"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-muted-foreground" />
                                                            <SelectValue placeholder="Select gender" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="MALE">MALE</SelectItem>
                                                    <SelectItem value="FEMALE">FEMALE</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Phone Number <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="e.g. 0712345678"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="e.g. janedoe@gmail.com"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="emergencyContactPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Emergency Contact <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="e.g. 0712345678"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="occupation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Occupation</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="e.g. Software Engineer"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="nationalId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                NationalId/Passport <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="Enter ID"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500"  />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="nationalIdImg"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ID Photo</FormLabel>
                                            <FormControl>
                                                <UploadWidget
                                                    value={
                                                        field.value
                                                            ? {
                                                                url: field.value,
                                                                publicId: imagePublicId ?? "",
                                                            }
                                                            : null
                                                    }
                                                    onChange={(file) => {
                                                        if (file) {
                                                            field.onChange(file.url);
                                                            form.setValue("imageCldPubId", file.publicId, {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                            });
                                                        } else {
                                                            field.onChange("");
                                                            form.setValue("imageCldPubId", "", {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
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
export default TenantEdit
