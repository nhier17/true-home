import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {BACKEND_BASE_URL} from "@/constants";
import {User} from "@/types";

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