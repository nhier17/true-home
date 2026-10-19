import type { AuthProvider } from "@refinedev/core";
import type { SignUpPayload } from "@/types";
import { authClient } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/utils";


export const authProvider: AuthProvider = {
    register: async ({
                         email,
                         password,
                         name,
                         role,
                         image,
                         imageCldPubId,
                     }: SignUpPayload) => {
        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
                image,
                role,
                imageCldPubId,
            } as SignUpPayload);

            if (error) {
                return {
                    success: false,
                    error: {
                        name: "Registration failed",
                        message:
                            error.message ||
                            "Unable to create account. Please try again.",
                    },
                };
            }

            return {
                success: true,
                redirectTo: "/onboarding",
            };
        } catch (error) {
            console.error("Register error:", error);

            return {
                success: false,
                error: {
                    name: "Registration failed",
                    message:
                        "Unable to create account. Please try again.",
                },
            };
        }
    },

    login: async ({ email, password }) => {
        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                console.error(
                    "Login error from auth client:",
                    error,
                );

                return {
                    success: false,
                    error: {
                        name: "Login failed",
                        message:
                            error.message ||
                            "Please try again later.",
                    },
                };
            }

            const currentUser = await getCurrentUser();

            if (!currentUser) {
                return {
                    success: false,
                    error: {
                        name: "User lookup failed",
                        message:
                            "Unable to retrieve your account information.",
                    },
                };
            }

            return {
                success: true,
                redirectTo: currentUser.organizationId
                    ? "/"
                    : "/onboarding",
            };
        } catch (error) {
            console.error("Login exception:", error);

            return {
                success: false,
                error: {
                    name: "Login failed",
                    message:
                        "Please try again later.",
                },
            };
        }
    },

    logout: async () => {
        try {
            const { error } = await authClient.signOut();

            if (error) {
                console.error("Logout error:", error);

                return {
                    success: false,
                    error: {
                        name: "Logout failed",
                        message:
                            "Unable to log out. Please try again.",
                    },
                };
            }

            return {
                success: true,
                redirectTo: "/login",
            };
        } catch (error) {
            console.error("Logout exception:", error);

            return {
                success: false,
                error: {
                    name: "Logout failed",
                    message:
                        "Unable to log out. Please try again.",
                },
            };
        }
    },

    check: async () => {
        try {
            const { data } = await authClient.getSession();

            if (!data?.user) {
                return {
                    authenticated: false,
                    logout: true,
                    redirectTo: "/login",
                    error: {
                        name: "Unauthorized",
                        message: "Your session has expired.",
                    },
                };
            }

            return {
                authenticated: true,
            };
        } catch (error) {
            console.error("Auth check error:", error);

            return {
                authenticated: false,
                logout: true,
                redirectTo: "/login",
                error: {
                    name: "Unauthorized",
                    message:
                        "Unable to verify your session.",
                },
            };
        }
    },

    getPermissions: async () => {
        return null;
    },

    getIdentity: async () => {
        try {
            const { data, error } = await authClient.getSession();

            if (error || !data?.user) {
                return null;
            }

            const authUser = data.user;

            return {
                id: authUser.id,
                name: authUser.name,
                email: authUser.email,
                image: authUser.image,
            };
        } catch (error) {
            console.error("Get identity error:", error);
            return null;
        }
    },

    onError: async (error) => {
        if (error.response?.status === 401) {
            return {
                logout: true,
                redirectTo: "/login",
            };
        }

        return {
            error,
        };
    },
};