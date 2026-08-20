import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {LeaseStatus, Lease} from "@/types";

const statusVariant = (
    status: LeaseStatus,
) => {
    switch (status) {
        case "ACTIVE":
            return "default";

        case "EXPIRED":
            return "secondary";

        case "CANCELLED":
            return "destructive";

        default:
            return "secondary";
    }
};

const LeasesList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const leaseColumns = useMemo<ColumnDef<Lease>[]>(
        () => [
            {
                id: "leaseNumber",
                accessorKey: "leaseNumber",
                size: 150,
                header: () => (
                    <p className="column-title ml-2">
                        Lease
                    </p>
                ),
                cell: ({ getValue }) => (
                    <Badge variant="outline">
                        {getValue<string>()}
                    </Badge>
                ),
            },

            {
                id: "tenant",
                accessorFn: (row) =>
                    `${row.tenant.firstName} ${row.tenant.lastName}`,
                header: () => (
                    <p className="column-title">
                        Tenant
                    </p>
                ),
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">
                            {
                                row.original
                                    .tenant
                                    .firstName
                            }{" "}
                            {
                                row.original
                                    .tenant
                                    .lastName
                            }
                        </p>
                    </div>
                ),
            },

            {
                id: "unit",
                accessorFn: (row) =>
                    row.unit.unitNumber,
                header: () => (
                    <p className="column-title">
                        Unit
                    </p>
                ),
                cell: ({ row }) => (
                    <Badge variant="outline">
                        {
                            row.original.unit
                                .unitNumber
                        }
                    </Badge>
                ),
            },

            {
                id: "period",
                accessorFn: (row) =>
                    `${row.startDate} ${row.endDate}`,
                header: () => (
                    <p className="column-title">
                        Lease Period
                    </p>
                ),
                cell: ({ row }) => (
                    <div className="text-sm">
                        <p>
                            {row.original.startDate}
                        </p>
                        <p className="text-muted-foreground">
                            -{" "}
                            {
                                row.original
                                    .endDate
                            }
                        </p>
                    </div>
                ),
            },

            {
                id: "monthlyRent",
                accessorKey: "monthlyRent",
                header: () => (
                    <p className="column-title">
                        Monthly Rent
                    </p>
                ),
                cell: ({ getValue }) => (
                    <span className="font-medium">
                            KES{" "}
                        {getValue<number>().toLocaleString()}
                        </span>
                ),
            },

            {
                id: "status",
                accessorKey: "status",
                header: () => (
                    <p className="column-title">
                        Status
                    </p>
                ),
                cell: ({ getValue }) => {
                    const status =
                        getValue<LeaseStatus>();

                    return (
                        <Badge
                            variant={statusVariant(
                                status,
                            )}
                        >
                            {status}
                        </Badge>
                    );
                },
            },

            {
                id: "actions",
                header: () => (
                    <p className="column-title text-right">
                        Actions
                    </p>
                ),
                cell: ({ row }) => (
                    <div className="flex justify-end">
                        <ShowButton
                            resource="leases"
                            recordItemId={
                                row.original.id
                            }
                        />
                    </div>
                ),
            },
        ],
        []
    );

    const searchFilters = searchQuery
    ? [
            {
                field: "name",
                operator: "contains" as const,
                value: searchQuery,
            }
        ]
        : []

    const leaseTable = useTable<Lease>({
        columns: leaseColumns,
        refineCoreProps: {
            resource: "leases",
            pagination: {
                pageSize: 10,
                mode: "server"
            },
            filters: {
                permanent: [...searchFilters]
            },
            sorters: {
                initial: [
                    {
                        field: "createdAt",
                        order: "desc"
                    }
                ]
            }
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Leases</h1>

                <div className="intro-row">
                    <p className="text-lg font-medium">All Leases</p>

                    <div className="actions-row">
                        <div className="search-field">
                            <Search className="search-icon" />
                            <Input
                                className="pl-10 w-full"
                                type="text"
                                placeholder="Search leases..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                            />
                        </div>
                        <CreateButton name="Create Lease" resource="leases">Create Lease</CreateButton>
                    </div>
            </div>
            <DataTable table={leaseTable} />
        </ListView>
    )
}
export default LeasesList
