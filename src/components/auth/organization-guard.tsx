import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/utils";
import LoaderSpinner from "@/components/LoaderSpinner.tsx";

type OrganizationGuardProps = {
    requireOrganization: boolean;
    children?: React.ReactNode;
};

export const OrganizationGuard = ({
                                      requireOrganization,
                                      children,
                                  }: OrganizationGuardProps) => {
    const [loading, setLoading] = useState(true);
    const [hasOrganization, setHasOrganization] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkOrganization = async () => {
            try {
                // First check the Better Auth session.
                const { data } = await authClient.getSession();

                if (!isMounted) return;

                // No session = logged out.
                if (!data?.user) {
                    setAuthenticated(false);
                    return;
                }

                setAuthenticated(true);

                // Only fetch /users/me when we know the user is authenticated.
                const currentUser = await getCurrentUser();

                if (!isMounted) return;

                setHasOrganization(
                    Boolean(currentUser?.organizationId),
                );
            } catch (error) {
                console.error(
                    "Failed to check organization:",
                    error,
                );

                if (isMounted) {
                    setAuthenticated(false);
                    setHasOrganization(false);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkOrganization();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoaderSpinner />
            </div>
        );
    }

    // Not authenticated.
    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated but organization is required.
    if (requireOrganization && !hasOrganization) {
        return <Navigate to="/onboarding" replace />;
    }

    // Authenticated and already has an organization,
    // so don't allow them back into onboarding.
    if (!requireOrganization && hasOrganization) {
        return <Navigate to="/" replace />;
    }

    return children ?? <Outlet />;
};