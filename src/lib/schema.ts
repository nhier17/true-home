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
    startDate: z.string().date(),
    endDate: z.string().date(),
    moveInDate:z.string().date(),
    monthlyRent: z.number().int().positive("Monthly rent must be greater than 0"),
    securityDeposit: z.number().int().nonnegative("Security deposit cannot be negative"),
    rentDueDay: z.number().int().min(1).max(31,"Rent due day must be between 1 and 31"),
    gracePeriodDays: z.number().int().min(0).max(30,"Grace period cannot exceed 30 days"),
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

//invoice
export const invoiceSchema = z.object({
    leaseId: z.string().min(1,"Please select a lease"),
    invoiceTypeId: z.string().min(1,"Please select an invoice type"),invoiceNumber: z .string() .trim() .min(1, "Invoice number is required") .max(50, "Invoice number cannot exceed 50 characters"),
    invoiceDate: z.string().date(),
    dueDate: z.string().date(),
    amount: z .number({ message: "Invoice amount is required", }) .int("Amount must be a whole number") .positive("Invoice amount must be greater than 0"),
});

export const paymentSchema = z.object({
    invoiceId: z.string().min(1,"Please select an invoice"),
    receiptNumber: z.string().trim().min(1, "Receipt number is required").max(50, "Receipt number cannot exceed 50 characters"),
    paymentReference: z.string().trim().max(100,"Payment reference cannot exceed 100 characters").optional(),
    amount: z.coerce.number().int().positive("Payment amount must be greater than 0"),
    paymentMethod: z.enum(["MPESA", "BANK_TRANSFER", "CASH", "CHEQUE"]),
    paidAt: z.string().date().optional(),
});