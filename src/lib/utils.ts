import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {BACKEND_BASE_URL} from "@/constants";
import {InvoiceStatus, User} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPropertyType = (
    value: string,
) =>
    value
        .toLowerCase()
        .replace(
            /\b\w/g,
            (char) => char.toUpperCase(),
        );

//get current user
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const response = await fetch(
            `${BACKEND_BASE_URL}users/me`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            },
        );


        if (!response.ok) {
            throw new Error(
                `Failed to fetch current user: ${response.status}`,
            );
        }

        const result = await response.json();

        return result.data ?? null;
    } catch (error) {
        console.error("Failed to get current user:", error);
        return null;
    }
};

export const getToday = () => {
    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
};

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
    }).format(amount);
}
export function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
}

export function formatDateTime(date: string | Date) {
    const parsedDate = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(parsedDate);
}
export function getStatusLabel(status: InvoiceStatus) {
    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export const statusStyles: Record< InvoiceStatus, string > = {
    DRAFT: "bg-muted text-muted-foreground",
    ISSUED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    PARTIALLY_PAID: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    PAID: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    OVERDUE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    VOID: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};