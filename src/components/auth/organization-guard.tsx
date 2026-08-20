import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/utils";

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

    useEffect(() => {
        let isMounted = true;

        const checkOrganization = async () => {
            try {
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
                Loading...
            </div>
        );
    }

    if (requireOrganization && !hasOrganization) {
        return <Navigate to="/onboarding" replace />;
    }
    if (!requireOrganization && hasOrganization) {
        return <Navigate to="/" replace />;
    }

    return children ?? <Outlet />;
};