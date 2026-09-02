import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import {Property} from "@/types";
import {formatPropertyType} from "@/lib/utils.ts";


const PropertyList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const propertyColumns =useMemo<ColumnDef<Property>[]>(
        () => [
            {
                id: "code",
                accessorKey: "code",
                size: 120,
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => {
                    const code = getValue<string>();

                    return code ? (
                        <Badge>{code}</Badge>
                    ) : (
                        <span className="text-muted-foreground ml-2">No code</span>
                    );
                },
            },
            {
                id: "name",
                accessorKey: "name",
                size: 200,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<string>()}</span>
                ),
                filterFn: "includesString",
            },
            {
                id: "propertyType",
                accessorKey: "propertyType",
                size: 200,
                header: () => <p className="column-title">Type</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{formatPropertyType(getValue<string>())}</span>
                ),
                filterFn: "includesString",
            },
            {
                id: "address",
                accessorKey: "address",
                header: () => <p className="column-title">Address</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<string>()}</span>
                ),
                filterFn: "includesString",
            },
            {
                id: "status",
                accessorKey: "status",
                size: 120,
                header: () => (
                    <p className="column-title">Status</p>
                ),
                cell: ({ getValue }) => {
                    const status = getValue<string>();

                    return (
                        <Badge variant="outline">
                            {status}
                        </Badge>
                    );
                },
            },
            {
                id: "details",
                size: 140,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="properties"
                        recordItemId={row.original.id}
                        variant="outline"
                        size="sm"
                    >
                        View
                    </ShowButton>
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
        : [];

    const propertyTable = useTable<Property>({
        columns: propertyColumns,
        refineCoreProps: {
            resource: "properties",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [...searchFilters],
            },
            sorters: {
                initial: [
                    {
                        field: "code",
                        order: "desc",
                    },
                ],
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Properties</h1>

            <div className="intro-row">
                <p>Manage your real estate with blocks, floors and units.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name or code..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                    <CreateButton name="Add Property" resource="properties">Add Property</CreateButton>
                </div>
            </div>

            <DataTable table={propertyTable} />
        </ListView>
    )
}
export default PropertyList
