import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {Input} from "@/components/ui/input.tsx";

type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "VOID";

type InvoiceType = {
  id: string;
  name: string;
};

type InvoiceTenant = {
  id: string;
  firstName: string;
  lastName: string;
};

type InvoiceUnit = {
  id: string;
  unitNumber: string;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  description: string | null;
  notes: string | null;
  invoiceType: InvoiceType;
  tenant: InvoiceTenant;
  unit: InvoiceUnit;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date(date));
};

const getStatusLabel = (status: InvoiceStatus) => {
  switch (status) {
    case "PARTIALLY_PAID":
      return "Partially Paid";

    default:
      return status.charAt(0) + status.slice(1).toLowerCase();
  }
};

const InvoiceList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const invoiceColumns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        id: "invoiceNumber",
        accessorKey: "invoiceNumber",
        header: "Invoice",
          cell: ({ getValue }) => (
              <span className="text-foreground">{getValue<string>()}</span>
          ),
          filterFn: "includesString",
      },
      {
        id: "tenant",
        header: "Tenant",
        accessorFn: (row) =>
          `${row.tenant.firstName} ${row.tenant.lastName}`,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">
              {row.original.tenant.firstName}{" "}
              {row.original.tenant.lastName}
            </span>
          </div>
        ),
      },
      {
        id: "unit",
        header: "Unit",
        accessorFn: (row) => row.unit.unitNumber,
        cell: ({ row }) => row.original.unit.unitNumber,
      },
      {
        id: "invoiceType",
        header: "Type",
        accessorFn: (row) => row.invoiceType.name,
        cell: ({ row }) => row.original.invoiceType.name,
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
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => formatDate(row.original.dueDate),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <span
              className={
                status === "PAID"
                  ? "text-green-600"
                  : status === "OVERDUE"
                    ? "text-destructive"
                    : status === "PARTIALLY_PAID"
                      ? "text-orange-600"
                      : status === "VOID"
                        ? "text-muted-foreground"
                        : "text-foreground"
              }
            >
              {getStatusLabel(status)}
            </span>
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
                        resource="invoices"
                        recordItemId={
                            row.original.id
                        }
                    />
                </div>
            ),
        },
    ],
    [],
  );

    const searchFilters = searchQuery
        ? [
            {
                field: "name",
                operator: "contains" as const,
                value: searchQuery,
            },
        ]
        : [];

  const invoiceTable = useTable<Invoice>({
    columns: invoiceColumns,
    refineCoreProps: {
      resource: "invoices",
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
                  field: "createdAt",
                  order: "desc"
              }
          ]
        }
    },
  });

  return (
      <ListView>
          <Breadcrumb />
          <h1 className="page-title">Invoices</h1>

          <div className="intro-row">
              <p>Manage tenant invoices and track outstanding balances.</p>

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
                  <CreateButton resource="invoices" name="Create Invoice">Create Invoice</CreateButton>
              </div>
          </div>

          <DataTable table={invoiceTable} />
      </ListView>
  );
};

export default InvoiceList;
