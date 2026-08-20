import {UserCheck, UserRoundCog, Wrench, GraduationCap} from "lucide-react";

export const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const BASE_URL = import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;

export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

export const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

export const USER_ROLES = {
    OWNER: "OWNER",
    MANAGER: "MANAGER",
    CARETAKER: "CARETAKER",
    ACCOUNTANT: "ACCOUNTANT",
    ADMIN: "ADMIN",
};

export const ROLE_OPTIONS = [
    {
        value: USER_ROLES.OWNER,
        label: "Owner",
        icon: GraduationCap,
    },
    {
        value: USER_ROLES.MANAGER,
        label: "Manager",
        icon: UserRoundCog ,
    },
    {
        value: USER_ROLES.CARETAKER,
        label: "Caretaker",
        icon: Wrench,
    },
    {
        value: USER_ROLES.ACCOUNTANT,
        label: "Accountant",
        icon: UserCheck,
    }
];
