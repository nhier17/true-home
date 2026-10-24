import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";

import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {useTable} from "@refinedev/react-table";
import {useMemo,useState} from "react";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {Tenant} from "@/types";


const TenantsList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const tenantColumns = useMemo<ColumnDef<Tenant>[]>(
        () => [
            {
                id: "name",
                header: () => <p className="column-title">Full Name</p>,
                cell: ({ row }) => {
                    const { firstName, lastName } = row.original;

                    return (
                        <span className="text-base text-foreground">
        {firstName} {lastName}
      </span>
                    );
                },
                filterFn: "includesString"
            },
            {
                id: "phone",
                accessorKey: "phone",
                header: () => <p className="column-title">Phone</p>,
                cell: ({ getValue }) => (
                    <span className="text-base text-foreground">{getValue<string>()}</span>
                ),
            },
            {
                id: "gender",
                accessorKey: "gender",
                header: () => <p className="column-title">Gender</p>,
                cell: ({ getValue }) => (
                    <span className="text-base text-foreground">{getValue<string>()}</span>
                ),
            },
            {
                id: "email",
                accessorKey: "email",
                header: () => <p className="column-title">Email</p>,
                cell: ({ getValue }) => (
                    <span className="text-base text-foreground">{getValue<string>()}</span>
                ),
            },
            {
                id: "nationalId",
                accessorKey: "nationalId",
                header: () => <p className="column-title">National ID</p>,
                cell: ({ getValue }) => (
                    <span className="text-base text-foreground">{getValue<string>()}</span>
                ),
            },
            {
                id: "details",
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="tenants"
                        recordItemId={row.original.id}
                        variant="outline"
                        size="sm"
                    >
                        View
                    </ShowButton>
                ),
            }
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

    const tenantsTable = useTable<Tenant>({
        columns: tenantColumns,
        refineCoreProps: {
            resource: "tenants",
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
                        field: "id",
                        order: "desc",
                    },
                ],
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Tenants</h1>

            <div className="intro-row">
                <p>Manage tenant information and active leases.</p>

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
                    <CreateButton resource="tenants" name="Add Tenant">Add Tenant</CreateButton>
                </div>
            </div>

            <DataTable table={tenantsTable} />
        </ListView>
    )
}
export default TenantsList
