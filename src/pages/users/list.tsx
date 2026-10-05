import { Search, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { CreateButton } from "@/components/refine-ui/buttons/create";

import type { User } from "@/types";

const roleLabels: Record<User["role"], string> = {
    OWNER: "Owner",
    ADMIN: "Administrator",
    MANAGER: "Manager",
    CARETAKER: "Caretaker",
    ACCOUNTANT: "Accountant",
};

const UsersList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const userColumns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                header: "Name",
                cell: ({ row }) => (
                    <div className="font-medium">
                        {row.original.name}
                    </div>
                ),
            },
            {
                id: "email",
                accessorKey: "email",
                header: "Email",
                cell: ({ row }) => (
                    <span>{row.original.email}</span>
                ),
            },
            {
                id: "role",
                accessorKey: "role",
                header: "Role",
                cell: ({ row }) => (
                    <Badge variant="secondary">
                        {roleLabels[row.original.role]}
                    </Badge>
                ),
            },
            {
                id: "status",
                accessorKey: "isActive",
                header: "Status",
                cell: ({ row }) => (
                    <Badge
                        variant={
                            row.original.isActive
                                ? "default"
                                : "secondary"
                        }
                    >
                        {row.original.isActive ? "Active" : "Inactive"}
                    </Badge>
                ),
            },
            {
                id: "createdAt",
                accessorKey: "createdAt",
                header: "Joined",
                cell: ({ row }) => {
                    const date = new Date(row.original.createdAt);

                    return (
                        <span>
                            {date.toLocaleDateString()}
                        </span>
                    );
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <ShowButton
                        resource="users"
                        recordItemId={row.original.id}
                    />
                ),
            },
        ],
        [],
    );

    const searchFilters = searchQuery
        ? [
            {
                field: "search",
                operator: "eq" as const,
                value: searchQuery,
            },
        ]
        : [];

    const usersTable = useTable<User>({
        columns: userColumns,

        refineCoreProps: {
            resource: "users",

            pagination: {
                pageSize: 10,
                mode: "server",
            },

            filters: {
                permanent: searchFilters,
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Users</h1>

            <div className="intro-row">
                <p>Manage your organization users</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />

                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                        />
                    </div>

                    <CreateButton resource="users">
                        <UserPlus className="h-6 w-6" />
                        Invite User
                    </CreateButton>
                </div>
            </div>

            <DataTable table={usersTable} />
        </ListView>
    );
};

export default UsersList;