import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useBack, type BaseRecord, type HttpError } from "@refinedev/core";
import * as z from "zod";

import { CreateView } from "@/components/refine-ui/views/create-view.tsx";
import { Breadcrumb } from "@/components/ui/breadcrumb.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Form } from "@/components/ui/form.tsx";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { BACKEND_BASE_URL } from "@/constants";

const inviteSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address"),
    role: z.enum(["MANAGER", "CARETAKER", "ACCOUNTANT"]),
});

type InviteFormValues = z.infer<typeof inviteSchema>;


const roleLabels: Record<InviteFormValues["role"], string> = {
    MANAGER: "Manager",
    CARETAKER: "Caretaker",
    ACCOUNTANT: "Accountant",
};

const UsersInvite = () => {
    const back = useBack();

    const [successMessage, setSuccessMessage] = useState("");
    const [submitError, setSubmitError] = useState("");

    const form = useForm<BaseRecord, HttpError, InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            email: "",
            role: "MANAGER",
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        control,
        reset,
    } = form;

    const onSubmit = async (values: InviteFormValues) => {
        setSubmitError("");
        setSuccessMessage("");

        try {
            const response = await fetch(
                `${BACKEND_BASE_URL}users/invitations`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                },
            );

            const result: {
                data?: {
                    invitation?: {
                        email: string;
                        role: InviteFormValues["role"];
                        expiresAt: string;
                    };
                };
                error?: {
                    message?: string;
                };
            } = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error?.message ??
                    "Unable to create the invitation.",
                );
            }

            setSuccessMessage(
                `Invitation sent successfully to ${values.email}.`,
            );

            reset();
        } catch (error) {
            console.error("Invitation creation error:", error);

            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while creating the invitation.",
            );
        }
    };

    return (
        <CreateView>
            <Breadcrumb />

            <div className="space-y-1">
                <h1 className="text-2xl font-bold">
                    Invite Organization User
                </h1>

                <p className="text-muted-foreground">
                    Invite a manager, caretaker, or accountant to join your
                    organization.
                </p>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="tenant-form-card w-full max-w-2xl">
                    <CardHeader className="relative z-10">
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gradient-orange">
                            <UserPlus className="h-6 w-6" />
                            Invite User
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email address
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="user@example.com"
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Organization role
                                            </FormLabel>

                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    <SelectItem value="MANAGER">
                                                        Manager
                                                    </SelectItem>

                                                    <SelectItem value="CARETAKER">
                                                        Caretaker
                                                    </SelectItem>

                                                    <SelectItem value="ACCOUNTANT">
                                                        Accountant
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {submitError && (
                                    <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                                        {submitError}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4">
                                        <p className="font-medium">
                                            Invitation sent successfully
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {successMessage}
                                        </p>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            The invitation link has been sent to the user's email
                                            address. The invitation expires in 7 days.
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => back()}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating invitation...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Create invitation
                                            </>
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

export default UsersInvite;