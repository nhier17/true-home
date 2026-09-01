import {useCustom} from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";
import type { DashboardResponse } from "@/types";


export const useDashboard = () => {
    const { query: dashboardQuery } = useCustom<DashboardResponse>({
        url: `${BACKEND_BASE_URL}dashboard`,
        method: "get",
    });

    const dashboard = dashboardQuery.data?.data?.data;



    return {
        dashboard,
        overview: dashboard?.overview,
        financial: dashboard?.financial,
        invoiceStatuses: dashboard?.invoiceStatuses,
        overdueInvoices: dashboard?.overdueInvoices,
        recentPayments: dashboard?.recentPayments,
        expiringLeases: dashboard?.expiringLeases,
        isLoading: dashboardQuery.isLoading,
        isError: dashboardQuery.isError,
    };
};