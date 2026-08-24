"use client";

import { CircleHelp } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useLink, useLogin } from "@refinedev/core";

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const SignInForm = () => {
    const Link = useLink();

    const { mutate: login, isPending: isLoggingIn } = useLogin();

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const handleSignIn = async (values: SignInFormValues) => {
        login({
            email: values.email,
            password: values.password,
        });
    };

    return (
        <main className="sign-in">
            <div className="sign-in-container">

                {/* Logo */}
                <div className="logo">
                    <img
                        src="/logo.png"
                        alt="TRUEHOME"
                    />
                </div>

                {/* Login Card */}
                <Card className="card">
                    <CardHeader className="header">
                        <CardTitle className="title">
                            Sign in
                        </CardTitle>

                        <CardDescription className="description">
                            Welcome back
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="content">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleSignIn)}
                                className="form"
                            >
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="field">
                                            <FormLabel htmlFor="email">
                                                Email
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="field">
                                            <FormLabel htmlFor="password">
                                                Password
                                            </FormLabel>

                                            <FormControl>
                                                <InputPassword
                                                    id="password"
                                                    autoComplete="current-password"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Remember / Forgot */}
                                <div className="row">
                                    <FormField
                                        control={form.control}
                                        name="rememberMe"
                                        render={({ field }) => (
                                            <FormItem className="remember">
                                                <FormControl>
                                                    <Checkbox
                                                        id="remember"
                                                        checked={field.value}
                                                        onCheckedChange={(checked) =>
                                                            field.onChange(
                                                                checked === "indeterminate"
                                                                    ? false
                                                                    : checked
                                                            )
                                                        }
                                                    />
                                                </FormControl>

                                                <FormLabel htmlFor="remember">
                                                    Remember me
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <Link
                                        to="/forgot-password"
                                        className="forgot-link"
                                    >
                                        <span>Forgot password</span>
                                        <CircleHelp />
                                    </Link>
                                </div>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="submit"
                                    disabled={isLoggingIn}
                                >
                                    {isLoggingIn
                                        ? "Signing in..."
                                        : "Sign in"}
                                </Button>

                                {/* Divider */}
                                <div className="split">
                                    <Separator />
                                    <span>or</span>
                                    <Separator />
                                </div>
                            </form>
                        </Form>
                    </CardContent>

                    <Separator className="divider" />

                    <CardFooter className="footer">
                        <span>No account?</span>

                        <Link to="/register">
                            Sign up
                        </Link>
                    </CardFooter>
                </Card>

            </div>
        </main>
    );
};

SignInForm.displayName = "SignInForm";