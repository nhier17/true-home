import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetIdentity } from "@refinedev/core";
import type { User } from "@/types";

export function UserAvatar() {
  const { data: user, isLoading: userIsLoading } =
      useGetIdentity<User>();

  if (userIsLoading || !user) {
    return (
        <Skeleton
            className={cn("h-10", "w-10", "rounded-full")}
        />
    );
  }

  return (
      <Avatar className={cn("h-10", "w-10")}>
        {user.image && (
            <AvatarImage
                src={user.image}
                alt={user.name}
            />
        )}

        <AvatarFallback>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
  );
}

const getInitials = (name = "") => {
  const names = name.trim().split(/\s+/);

  if (names.length === 0 || !names[0]) {
    return "?";
  }

  const firstInitial = names[0][0]?.toUpperCase() ?? "";

  if (names.length === 1) {
    return firstInitial;
  }

  const lastInitial =
      names[names.length - 1][0]?.toUpperCase() ?? "";

  return `${firstInitial}${lastInitial}`;
};

UserAvatar.displayName = "UserAvatar";