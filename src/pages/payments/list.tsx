import React, { useMemo, useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "@/components/ui/breadcrumb.tsx";
import { Search } from "lucide-react";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { useTable } from "@refinedev/react-table";
import { Input } from "@/components/ui/input.tsx";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge.tsx";
import {formatCurrency, formatDateTime} from "@/lib/utils";
import {Payment} from "@/types";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";


const paymentMethodLabels: Record<
    Payment["paymentMethod"],
    string
> = {
    MPESA: "M-Pesa",
    BANK_TRANSFER: "Bank Transfer",
    CASH: "Cash",
    CHEQUE: "Cheque",
};

const PaymentList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const paymentColumns = useMemo<ColumnDef<Payment>[]>(
        () => [
            {
                id: "receiptNumber",
                accessorKey: "receiptNumber",
                header: "Receipt",
                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.receiptNumber}
                    </span>
                ),
            },
            {
                id: "tenant",
                header: "Tenant",
                accessorFn: (row) =>
                    `${row.tenant.firstName} ${row.tenant.lastName}`,
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">
                            {row.original.tenant.firstName}{" "}
                            {row.original.tenant.lastName}
                        </p>
                    </div>
                ),
            },
            {
                id: "invoice",
                header: "Invoice",
                accessorFn: (row) =>
                    row.invoice.invoiceNumber,
                cell: ({ row }) => (
                    <span>
                        {row.original.invoice.invoiceNumber}
                    </span>
                ),
            },
            {
                id: "amount",
                accessorKey: "amount",
                header: "Amount",
                cell: ({ row }) => (
                    <span className="font-medium">
                        {formatCurrency(row.original.amount)}
                    </span>
                ),
            },
            {
                id: "paymentMethod",
                accessorKey: "paymentMethod",
                header: "Method",
                cell: ({ row }) => (
                    <Badge variant="outline">
                        {
                            paymentMethodLabels[
                                row.original.paymentMethod
                                ]
                        }
                    </Badge>
                ),
            },
            {
                id: "paidAt",
                accessorKey: "paidAt",
                header: "Payment Date",
                cell: ({ row }) => (
                    formatDateTime(row.original.paidAt)
                ),
            },
            {
                id: "paymentReference",
                accessorKey: "paymentReference",
                header: "Reference",
                cell: ({ row }) =>
                    row.original.paymentReference || "—",
            },
            {
                id: "details",
                size: 140,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="payments"
                        recordItemId={row.original.id}
                        variant="outline"
                        size="sm"
                    >
                        View
                    </ShowButton>
                ),
            },
        ],
        [],
    );

    const searchFilters = searchQuery
        ? [
            {
                field: "search",
                operator: "contains" as const,
                value: searchQuery,
            },
        ]
        : [];

    const paymentTable = useTable<Payment>({
        columns: paymentColumns,
        refineCoreProps: {
            resource: "payments",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [...searchFilters],
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Payments</h1>

            <div className="intro-row">
                <p>Manage payments.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />

                        <Input
                            type="text"
                            placeholder="Search by tenant, receipt or reference..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value,
                                )
                            }
                        />
                    </div>

                    <CreateButton
                        resource="payments"
                        name="Record Payment"
                    >
                        Record Payment
                    </CreateButton>
                </div>
            </div>

            <DataTable table={paymentTable} />
        </ListView>
    );
};

export default PaymentList;