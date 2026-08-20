import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import {type BaseRecord, type HttpError, useCreate} from "@refinedev/core";
import * as z from "zod";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {BookUser, Compass, Loader2, Mail, Phone, User} from "lucide-react";

const onboardingSchema = z.object({
    name: z.string().trim().min(2, "Organization name must be at least 2 characters")
        .max(255, "Organization name must not exceed 255 characters"),
    email: z.string().trim().email("Invalid organization email").max(255, "Email must not exceed 255 characters"),
    phone: z
        .string()
        .min(10)
        .regex(/^(0|\+254|254)/, "Invalid Kenyan phone format"),
    address: z.string().trim().max(500, "Address must not exceed 500 characters").optional(),
    county: z.string().trim().max(100, "County must not exceed 100 characters").optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const Onboarding = () => {
    const navigate = useNavigate();

    const { mutate: createOrganization } = useCreate<BaseRecord, HttpError, OnboardingFormValues>();

    const form = useForm<BaseRecord, HttpError, OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            county: "",
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const onSubmit = (values: OnboardingFormValues) => {
        createOrganization(
            {
                resource: "onboarding",
                values,
            },
            {
                onSuccess: () => {
                    toast.success(
                        "Organization created successfully!",
                        {
                            richColors: true,
                        },
                    );

                    navigate("/", {
                        replace: true,
                    });
                },

                onError: (error) => {
                    console.error(
                        "Onboarding error:",
                        error,
                    );

                    toast.error(
                        error.message ||
                        "Failed to complete onboarding.",
                        {
                            richColors: true,
                        },
                    );
                },
            },
        );
    };

    return (
        <CreateView className="tenant-view">
            <CreateViewHeader title="Welcome to Truehome"  />
            <div className="intro-row">
                <p>Set up your organization and manage your property.</p>
            </div>

            <div className="flex items-center my-4">
                <Card className="tenant-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            Set up your organization
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Name<span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="Enter name"
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
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email<span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="Enter your email"
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* County */}
                                <FormField
                                    control={control}
                                    name="county"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                County <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="e.g. Nairobi"
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
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Address <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <BookUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="enter your address.."
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Registering...
                                        </>
                                    ) : "Register Organization"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default Onboarding;