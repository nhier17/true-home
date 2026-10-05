import { useShow } from "@refinedev/core";
import { useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ShowView,
    ShowViewHeader,
} from "@/components/refine-ui/views/show-view";

import type { User } from "@/types";

const roleLabels: Record<User["role"], string> = {
    OWNER: "Owner",
    ADMIN: "Administrator",
    MANAGER: "Manager",
    CARETAKER: "Caretaker",
    ACCOUNTANT: "Accountant",
};

const UserDetails = () => {
    const { id } = useParams();

    const { query } = useShow<User>({
        resource: "users",
        id,
    });

    const user = query.data?.data;

    if (query.isLoading) {
        return (
            <ShowView>
                <ShowViewHeader title="User Details" />

                <p className="text-sm text-muted-foreground">
                    Loading user details...
                </p>
            </ShowView>
        );
    }

    if (query.isError || !user) {
        return (
            <ShowView>
                <ShowViewHeader title="User Details" />

                <p className="text-sm text-muted-foreground">
                    {query.isError
                        ? "Failed to load user details."
                        : "User details not found."}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="space-y-6">
            <ShowViewHeader title="User Details" />

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            {user.image && (
                                <AvatarImage
                                    src={user.image}
                                    alt={user.name}
                                />
                            )}

                            <AvatarFallback className="text-lg">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <CardTitle className="text-xl">
                                {user.name}
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Role
                            </p>

                            <div className="mt-1">
                                <Badge variant="secondary">
                                    {roleLabels[user.role]}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Status
                            </p>

                            <div className="mt-1">
                                <Badge
                                    variant={
                                        user.isActive
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {user.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Joined
                            </p>

                            <p className="mt-1 font-medium">
                                {formatDate(user.createdAt)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Last Updated
                            </p>

                            <p className="mt-1 font-medium">
                                {formatDate(user.updatedAt)}
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <p className="text-sm text-muted-foreground">
                                Organization
                            </p>

                            <p className="mt-1 font-medium">
                                {user.organizationId ?? "Not assigned"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </ShowView>
    );
};

const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 0) return "";

    if (parts.length === 1) {
        return parts[0][0]?.toUpperCase() ?? "";
    }

    return `${parts[0][0] ?? ""}${
        parts[parts.length - 1][0] ?? ""
    }`.toUpperCase();
};

export default UserDetails;