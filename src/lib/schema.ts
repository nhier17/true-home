import { z } from "zod";

//properties
export const propertySchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().trim().min(1, "Property code is required").max(
        20,
        "Property code cannot exceed 20 characters",
    ),
    propertyType: z.string().min(1, "Property type is required"),
    address: z.string().min(1, "Address is required"),
    county: z.string().optional(),
});

//units
export const unitSchema = z.object({
    unitNumber: z.string().trim().min(1, "Unit number is required").max(50, "Unit number cannot exceed 50 characters"),
    unitTypeId: z.string().min(1,"Please select a unit type"),
    blockId: z.string().optional().nullable(),
    floorId: z.string().optional().nullable(),
    defaultRent: z.number().int().positive("Default rent must be greater than 0"),
});

//floor
export const floorSchema = z.object({
    blockId: z.string().optional(),
    name: z
        .string()
        .trim()
        .min(1, "Floor name is required")
        .max(255, "Floor name is too long"),
    level: z.coerce
        .number()
        .int("Level must be an integer"),
});

//leases
export const leaseSchema = z.object({
    leaseNumber: z
        .string()
        .trim()
        .min(1, "Lease number is required")
        .max(
            50,
            "Lease number cannot exceed 50 characters",
        ),

    tenantId: z.string().min(1, "Please select a tenant"),
    unitId: z.string().min(1,"Please select a unit"),
    startDate: z.coerce.date({required_error: "Start date is required"}),
    endDate: z.coerce.date({required_error: "End date is required"}),
    moveInDate: z.coerce.date().nullable().optional(),
    monthlyRent: z.number().int().positive("Monthly rent must be greater than 0"),
    securityDeposit: z
        .number()
        .int()
        .nonnegative(
            "Security deposit cannot be negative",
        ),

    rentDueDay: z
        .number()
        .int()
        .min(1)
        .max(
            31,
            "Rent due day must be between 1 and 31",
        ),

    gracePeriodDays: z
        .number()
        .int()
        .min(0)
        .max(
            30,
            "Grace period cannot exceed 30 days",
        ),
});

//tenants
export const tenantSchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    gender: z.enum(['MALE', 'FEMALE']),
    phone: z
        .string()
        .min(10)
        .regex(/^(0|\+254|254)/, "Invalid Kenyan phone format"),
    email: z.string().email("Email is required."),
    emergencyContact:  z
        .string()
        .min(10)
        .regex(/^(0|\+254|254)/, "Invalid Kenyan phone format"),
    occupation: z.string().optional(),
    nationalId: z.string().optional(),
    nationalIdImg: z.string().optional(),
    imageCldPubId: z.string().optional(),
});