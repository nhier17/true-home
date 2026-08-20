import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view.tsx";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import AddUnitDialog from "@/components/units/add-unit-dialog";
import AddBlockDialog from "@/components/units/add-block.dialog.tsx";
import AddFloorDialog from "@/components/units/add-floor-dialog.tsx";
import type { Property, Block, Floor, Unit } from "@/types";


const PropertyDetails = () => {
    const { query } = useShow<Property>({
        resource: "properties",
    });

    const { data, isLoading } = query;

    const property = data?.data;

    const unitColumns = useMemo<ColumnDef<Unit>[]>(
        () => [
            {
                id: "unitNumber",
                accessorKey: "unitNumber",
                header: () => (
                    <p className="column-title">
                        Unit
                    </p>
                ),
                cell: ({ getValue }) => (
                    <span className="font-medium">
                        {getValue<string>()}
                    </span>
                ),
            },
            {
                id: "unitType",
                accessorKey: "unitTypeName",
                header: () => (
                    <p className="column-title">
                        Unit Type
                    </p>
                ),
                cell: ({ getValue }) => {
                    const value = getValue<string>();

                    return value ? (
                        <Badge variant="secondary">
                            {value}
                        </Badge>
                    ) : (
                        <span className="text-muted-foreground">
                            —
                        </span>
                    );
                },
            },
            {
                id: "floor",
                accessorKey: "floorName",
                header: () => (
                    <p className="column-title">
                        Floor
                    </p>
                ),
                cell: ({ getValue }) => (
                    <span>
                        {getValue<string>() || "—"}
                    </span>
                ),
            },
            {
                id: "block",
                accessorKey: "blockName",
                header: () => (
                    <p className="column-title">
                        Block
                    </p>
                ),
                cell: ({ getValue }) => (
                    <span>
                        {getValue<string>() || "—"}
                    </span>
                ),
            },
        ],
        [],
    );

    const floorColumns = useMemo<ColumnDef<Floor>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                header: () => (
                    <p className="column-title">
                        Floor
                    </p>
                ),
                cell: ({ getValue }) => (
                    <span className="font-medium">
                        {getValue<string>()}
                    </span>
                ),
            },
            {
                id: "level",
                accessorKey: "level",
                header: () => (
                    <p className="column-title">
                        Level
                    </p>
                ),
                cell: ({ getValue }) => (
                    <Badge variant="secondary">
                        {getValue<number>()}
                    </Badge>
                ),
            },
        ],
        [],
    );


    const blockColumns = useMemo<ColumnDef<Block>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                header: () => (
                    <p className="column-title">
                        Block
                    </p>
                ),
                cell: ({ getValue }) => (
                    <span className="font-medium">
                        {getValue<string>()}
                    </span>
                ),
            },
        ],
        [],
    );

    const unitTable = useTable<Unit>({
        columns: unitColumns,
        refineCoreProps: {
            resource: "units",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: property?.id
                    ? [
                        {
                            field: "propertyId",
                            operator: "eq",
                            value: property.id,
                        },
                    ]
                    : [],
            },
            sorters: {
                initial: [
                    {
                        field: "unitNumber",
                        order: "asc",
                    },
                ],
            },
        },
    });

    const floorTable = useTable<Floor>({
        columns: floorColumns,
        refineCoreProps: {
            resource: "floors",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: property?.id
                    ? [
                        {
                            field: "propertyId",
                            operator: "eq",
                            value: property.id,
                        },
                    ]
                    : [],
            },
            sorters: {
                initial: [
                    {
                        field: "level",
                        order: "asc",
                    },
                ],
            },
        },
    });

    const blockTable = useTable<Block>({
        columns: blockColumns,
        refineCoreProps: {
            resource: "blocks",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: property?.id
                    ? [
                        {
                            field: "propertyId",
                            operator: "eq",
                            value: property.id,
                        },
                    ]
                    : [],
            },
            sorters: {
                initial: [
                    {
                        field: "name",
                        order: "asc",
                    },
                ],
            },
        },
    });


    if (isLoading) {
        return (
            <ShowView className="space-y-6 tenant-view">
                <ShowViewHeader />

                <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                        Loading property...
                    </CardContent>
                </Card>
            </ShowView>
        );
    }


    if (!property) {
        return (
            <ShowView className="space-y-6 tenant-view">
                <ShowViewHeader />

                <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                        Property not found.
                    </CardContent>
                </Card>
            </ShowView>
        );
    }

    return (
        <ShowView className="space-y-6 tenant-view">
            <ShowViewHeader resource="properties" title={property.name} />

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex w-full flex-row items-center justify-between">
                    <CardTitle className="text-2xl">
                        {property.name}
                    </CardTitle>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                            {property.code}
                        </Badge>

                        <Badge variant="secondary">
                            {property.status}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Property Type
                            </p>

                            <p className="mt-1 font-medium">
                                {property.propertyType}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Address
                            </p>

                            <p className="mt-1 font-medium">
                                {property.address}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                County
                            </p>

                            <p className="mt-1 font-medium">
                                {property.county || "—"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-wrap items-center gap-3">
                <AddUnitDialog propertyId={property.id} />

                <AddBlockDialog propertyId={property.id} />

                <AddFloorDialog propertyId={property.id} />
            </div>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Units</CardTitle>
                    <AddUnitDialog propertyId={property.id} />
                </CardHeader>

                <CardContent>
                    <DataTable table={unitTable} paginationVariant="simple"  />
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Blocks</CardTitle>
                    <AddBlockDialog propertyId={property.id} />
                </CardHeader>

                <CardContent>
                    <DataTable table={blockTable} paginationVariant="simple"  />
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Floors</CardTitle>
                    <AddFloorDialog propertyId={property.id} />
                </CardHeader>

                <CardContent>
                    <DataTable table={floorTable} paginationVariant="simple"  />
                </CardContent>
            </Card>
        </ShowView>
    );
};

export default PropertyDetails;