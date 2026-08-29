import React, {useMemo, useState} from 'react'
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/ui/breadcrumb.tsx";
import {Search} from "lucide-react";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {Input} from "@/components/ui/input.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";

type Payment = {
    id: string;
    tenantId: string;
    leaseId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const PaymentList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const paymnetColumns = useMemo()

    const searchFilters = searchQuery
        ? [
            {
                field: "name",
                operator: "contains" as const,
                value: searchQuery,
            },
        ]
        : [];

    const paymentTable = useTable<Payment>({
        columns: paymnetColumns,
        refineCoreProps: {
            resource: "payments",
            pagination: {
                pageSize: 10,
                mode: "server"
            },
            filters: {
                permanent: [...searchFilters]
            }
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Payments</h1>

            <div className="intro-row">
                <p>Manage Payments.</p>

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
                    <CreateButton resource="payments" name="Record Payment">Record Payment</CreateButton>
                </div>
            </div>

            <DataTable table={paymentTable} />
        </ListView>
    )
}
export default PaymentList
