import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, ShieldCheck, Users } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { BACKEND_BASE_URL } from "@/constants";
import { getCurrentUser } from "@/lib/utils";

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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const acceptInvitationSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z
            .string()
            .min(8, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type AcceptInvitationFormValues = z.infer<
    typeof acceptInvitationSchema
>;

type Invitation = {
    id: string;
    email: string;
    role: "MANAGER" | "ACCOUNTANT" | "CARETAKER";
    expiresAt: string;
};

const roleLabels: Record<Invitation["role"], string> = {
    MANAGER: "Manager",
    ACCOUNTANT: "Accountant",
    CARETAKER: "Caretaker",
};

const AcceptInvitation = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [invitation, setInvitation] = useState<Invitation | null>(null);
    const [loadingInvitation, setLoadingInvitation] = useState(true);
    const [invitationError, setInvitationError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [checkingSession, setCheckingSession] = useState(true);
    const [signedInUser, setSignedInUser] = useState<{
        name?: string | null;
        email: string;
    } | null>(null);

    const form = useForm<AcceptInvitationFormValues>({
        resolver: zodResolver(acceptInvitationSchema),
        defaultValues: {
            name: "",
            password: "",
            confirmPassword: "",
        },
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    useEffect(() => {
        if (!token) {
            setInvitationError(
                "This invitation link is missing its invitation token.",
            );
            setLoadingInvitation(false);
            setCheckingSession(false);
            return;
        }

        const loadInvitation = async () => {
            try {
                const [invitationResponse, sessionResponse] =
                    await Promise.all([
                        fetch(
                            `${BACKEND_BASE_URL}users/invitations/${encodeURIComponent(token)}`,
                            {
                                method: "GET",
                                credentials: "include",
                            },
                        ),
                        authClient.getSession(),
                    ]);

                const invitationResult =  await invitationResponse.json();

                if (!invitationResponse.ok) {
                    throw new Error(
                        invitationResult?.error?.message ??
                        "This invitation is invalid or has expired.",
                    );
                }

                setInvitation(invitationResult.data);

                const sessionUser = sessionResponse.data?.user;

                if (sessionUser) {
                    setSignedInUser({
                        name: sessionUser.name,
                        email: sessionUser.email,
                    });
                }
            } catch (error) {
                setInvitationError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load this invitation.",
                );
            } finally {
                setLoadingInvitation(false);
                setCheckingSession(false);
            }
        };

        void loadInvitation();
    }, [token]);

    const handleSignOut = async () => {
        setSubmitError("");

        try {
            const { error } = await authClient.signOut();

            if (error) {
                throw new Error(
                    error.message ?? "Unable to sign out.",
                );
            }

            setSignedInUser(null);
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Unable to sign out.",
            );
        }
    };

    const onSubmit = async (values: AcceptInvitationFormValues) => {
        if (!token || !invitation) {
            return;
        }

        setSubmitError("");

        try {
            const { error: signUpError } =
                await authClient.signUp.email({
                    name: values.name,
                    email: invitation.email,
                    password: values.password,
                });

            if (signUpError) {
                setSubmitError(
                    signUpError.message ??
                    "Unable to create your account.",
                );
                return;
            }
            
            const response = await fetch(
                `${BACKEND_BASE_URL}users/invitations/accept`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.error?.message ??
                    "Unable to accept this invitation.",
                );
            }
            
            const currentUser = await getCurrentUser();

            if (!currentUser?.organizationId) {
                throw new Error(
                    "Your account was created, but the invitation could not be completed.",
                );
            }

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Invitation acceptance error:", error);

            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while accepting the invitation.",
            );
        }
    };

    if (loadingInvitation || checkingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center p-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Checking your invitation...</span>
                </div>
            </div>
        );
    }

    if (invitationError || !invitation) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Invitation unavailable</CardTitle>
                        <CardDescription>
                            We couldn't verify this invitation.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Alert variant="destructive">
                            <AlertDescription>
                                {invitationError}
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (signedInUser) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="space-y-4 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-6 w-6 text-primary" />
                        </div>

                        <div className="space-y-2">
                            <CardTitle className="text-2xl">
                                Sign out to accept this invitation
                            </CardTitle>

                            <CardDescription>
                                This invitation is for a different
                                account.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div className="rounded-lg border bg-muted/40 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Currently signed in as
                            </p>

                            <p className="mt-1 font-medium">
                                {signedInUser.name ||
                                    "Current user"}
                            </p>

                            <p className="mt-1 break-all text-sm text-muted-foreground">
                                {signedInUser.email}
                            </p>
                        </div>

                        <div className="rounded-lg border bg-muted/40 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Invitation is for
                            </p>

                            <p className="mt-1 break-all text-sm font-medium">
                                {invitation.email}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Role:{" "}
                                <span className="font-medium text-foreground">
                                {roleLabels[invitation.role]}
                            </span>
                            </p>
                        </div>

                        {submitError && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {submitError}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                            <p className="text-xs leading-5 text-muted-foreground">
                                Invitations are tied to the invited
                                email address. Sign out of the current
                                account before creating the invited
                                account.
                            </p>
                        </div>

                        <Button
                            type="button"
                            className="w-full"
                            onClick={handleSignOut}
                        >
                            Sign out and continue
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                    </div>

                    <div className="space-y-2">
                        <CardTitle className="text-2xl">
                            Join your organization
                        </CardTitle>

                        <CardDescription>
                            You've been invited to join as a{" "}
                            <span className="font-medium text-foreground">
                                {roleLabels[invitation.role]}
                            </span>
                            .
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="mb-6 rounded-lg border bg-muted/40 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Invitation email
                        </p>

                        <p className="mt-1 break-all text-sm font-medium">
                            {invitation.email}
                        </p>
                    </div>

                    {submitError && (
                        <Alert
                            variant="destructive"
                            className="mb-6"
                        >
                            <AlertDescription>
                                {submitError}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Full name
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="Enter name"
                                                autoComplete="name"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Password
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Create a password"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Confirm password
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Confirm your password"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-start gap-3 rounded-lg border p-3">
                                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                                <p className="text-xs leading-5 text-muted-foreground">
                                    Your account will be created using
                                    the invited email address and assigned
                                    the{" "}
                                    <span className="font-medium text-foreground">
                                        {roleLabels[invitation.role]}
                                    </span>{" "}
                                    role.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating your account...
                                    </>
                                ) : (
                                    "Create Account & Accept invitation"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AcceptInvitation;