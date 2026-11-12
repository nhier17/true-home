import React, { useMemo, useState } from "react";
import {AlertCircle, CheckCircle2, CircleDollarSign, Download, Search} from "lucide-react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {FinancialCard} from "@/components/dashboard/financial-card.tsx";
import {useDashboard} from "@/components/dashboard/hooks/use-custom.ts";
import type {Invoice, InvoiceStatus} from "@/types";
import {Button} from "@/components/ui/button.tsx";
import {useCustomMutation, useInvalidate, useNotification} from "@refinedev/core";
import {exportToExcel, formatCurrency} from "@/lib/utils.ts";
import {BACKEND_BASE_URL} from "@/constants";


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
    const [selectedStatus, setSelectedStatus] = useState<Invoice["status"] | "ALL">("ALL");
  const { financial, overdueInvoices } = useDashboard();

    const { mutate, mutation: { isPending: isIssuing } } = useCustomMutation();
    const invalidate = useInvalidate();
    const { open } = useNotification();

  const totalOverdue = useMemo(
    () => overdueInvoices.reduce((acc, invoice) => acc + Number(invoice.amount), 0),
    [overdueInvoices],
  );

  const invoiceCards = [
    {
      title: "Paid",
      key: "paid",
      value: financial?.totalCollected ?? 0,
      icon: CheckCircle2,
      accent: "text-emerald-600",
      description: "Payments collected",
    },
    {
      title: "Outstanding",
      key: "outstanding",
      value: financial?.outstanding ?? 0,
      icon: CircleDollarSign,
      accent: "text-orange-600",
      description: "Amount still to collect",
    },
    {
      title: "Overdue",
      key: "overdue",
      value: totalOverdue,
      icon: AlertCircle,
      accent: "text-red-600",
      description: "Past due date amount",
    },
  ] as const;

    const handleIssueInvoice = (invoice: Invoice) => {
        mutate(
            {
                url: `${BACKEND_BASE_URL}invoices/${invoice.id}/issue`,
                method: "post",
                config: {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                values: {},
            },
            {
                onSuccess: () => {
                    open?.({
                        type: "success",
                        message: "Invoice issued successfully",
                        description: `${invoice.invoiceNumber} has been issued.`,
                    });

                    invalidate({
                        resource: "invoices",
                        invalidates: ["detail", "list"],
                        id: invoice.id,
                    });
                },
                onError: (error) => {
                    open?.({
                        type: "error",
                        message: "Failed to issue invoice",
                        description: error?.message ?? "Something went wrong.",
                    });
                },
            },
        );
    };

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
            header: () => <p className="column-title">Action</p>,
            cell: ({ row }) => {
                const invoice = row.original;

                if (invoice.status === "DRAFT") {
                    return (
                        <Button
                            size="sm"
                            onClick={() => handleIssueInvoice(invoice)}
                            disabled={isIssuing}
                        >
                            Issue invoice
                        </Button>
                    );
                }

                return (
                    <ShowButton
                        resource="invoices"
                        recordItemId={invoice.id}
                        variant="outline"
                        size="sm"
                    >
                        View details
                    </ShowButton>
                );
            },
        }
    ],
    [],
  );

    const invoiceExportColumns = [
        {
            header: "Invoice",
            accessor: (invoice: Invoice) => invoice.invoiceNumber,
        },
        {
            header: "Tenant",
            accessor: (invoice: Invoice) =>
                `${invoice.tenant.firstName} ${invoice.tenant.lastName}`,
        },
        {
            header: "Unit",
            accessor: (invoice: Invoice) => invoice.unit.unitNumber,
        },
        {
            header: "Type",
            accessor: (invoice: Invoice) => invoice.invoiceType.name,
        },
        {
            header: "Amount",
            accessor: (invoice: Invoice) => Number(invoice.amount),
        },
        {
            header: "Due Date",
            accessor: (invoice: Invoice) => formatDate(invoice.dueDate),
        },
        {
            header: "Status",
            accessor: (invoice: Invoice) => getStatusLabel(invoice.status),
        },
    ];

    const searchFilters = [
        ...(searchQuery
            ? [
                {
                    field: "invoiceNumber",
                    operator: "contains" as const,
                    value: searchQuery,
                },
            ]
            : []),
        ...(selectedStatus !== "ALL"
            ? [
                {
                    field: "status",
                    operator: "eq" as const,
                    value: selectedStatus,
                },
            ]
            : []),
    ];

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

    const invoices = invoiceTable.refineCore.tableQuery.data?.data ?? [];

    const handleExport = () => {
        exportToExcel({
            data: invoices,
            columns: invoiceExportColumns,
            fileName: "invoices",
            sheetName: "Invoices",
        });
    };

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
                          placeholder="Search by name..."
                          className="pl-10 w-full"
                          value={searchQuery}
                          onChange={(event) => setSearchQuery(event.target.value)}
                      />
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                      <Select
                          value={selectedStatus}
                          onValueChange={(value) =>
                              setSelectedStatus(value as Invoice["status"] | "ALL")
                          }
                      >
                          <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>

                          <SelectContent>
                              <SelectItem value="ALL">All invoices</SelectItem>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="ISSUED">Issued</SelectItem>
                              <SelectItem value="PARTIALLY_PAID">Partially paid</SelectItem>
                              <SelectItem value="OVERDUE">Overdue</SelectItem>
                              <SelectItem value="PAID">Paid</SelectItem>
                              <SelectItem value="VOID">Void</SelectItem>
                          </SelectContent>
                      </Select>
                      <Button
                          variant="secondary"
                          onClick={handleExport}
                          disabled={!invoices.length}
                      >
                          <Download className="mr-2 h-4 w-4" />
                          Export Excel
                      </Button>
                      <CreateButton name="Create Invoice" resource="invoices">Create Invoice</CreateButton>
                  </div>
              </div>
          </div>
          <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                  <CardTitle>Invoice Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                      {invoiceCards.map((card) => (
                          <FinancialCard
                              key={card.key}
                              title={card.title}
                              value={card.value}
                              icon={card.icon}
                              accent={card.accent}
                              description={card.description}
                          />
                      ))}
                  </div>
              </CardContent>
          </Card>

          <DataTable table={invoiceTable} />
      </ListView>
  );
};

export default InvoiceList;
