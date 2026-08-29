import { UserAvatar } from "@/components/refine-ui/layout/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetIdentity } from "@refinedev/core";
import { useSidebar } from "@/components/ui/sidebar";
import type { User } from "@/types";

export function UserInfo() {
    const { data: user, isLoading: userIsLoading } =
        useGetIdentity<User>();

    const { open, isMobile } = useSidebar();

    const showDetails = open || isMobile;

    if (userIsLoading || !user) {
        return (
            <div
                className={cn(
                    "flex",
                    "items-center",
                    "gap-x-2",
                    {
                        "justify-center": !showDetails,
                    }
                )}
            >
                <Skeleton className="h-10 w-10 rounded-full" />

                {showDetails && (
                    <div className="flex h-10 flex-col justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex",
                "items-center",
                "gap-x-2",
                "w-full",
                {
                    "justify-center": !showDetails,
                }
            )}
        >
            <UserAvatar />

            {showDetails && (
                <div
                    className={cn(
                        "flex",
                        "min-w-0",
                        "flex-1",
                        "flex-col",
                        "justify-between",
                        "h-10",
                        "text-left"
                    )}
                >
          <span className="truncate text-sm font-medium text-muted-foreground">
            {user.name}
          </span>

           <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
                </div>
            )}
        </div>
    );
}

UserInfo.displayName = "UserInfo";