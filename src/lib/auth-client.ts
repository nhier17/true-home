import { createAuthClient } from "better-auth/react";
import { BACKEND_BASE_URL, USER_ROLES } from "@/constants";

const authBaseURL = BACKEND_BASE_URL.startsWith("/")
    ? `${window.location.origin}${BACKEND_BASE_URL}`
    : BACKEND_BASE_URL;

export const authClient = createAuthClient({
    baseURL: `${authBaseURL}auth`,
    user: {
        additionalFields: {
            role: {
                type: USER_ROLES,
                required: true,
                defaultValue: "OWNER",
                input: true,
            },
            imageCldPubId: {
                type: "string",
                required: true,
                input: true,
            },
        },
    },
});