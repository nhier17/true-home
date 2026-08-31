export type ListResponse<T = unknown> = {
    data?: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type CreateResponse<T = unknown> = {
    data?: T;
};

export type GetOneResponse<T = unknown> = {
    data?: T;
};

declare global {
    interface CloudinaryUploadWidgetResults {
        event: string;
        info: {
            secure_url: string;
            public_id: string;
            delete_token?: string;
            resource_type: string;
            original_filename: string;
        };
    }

    interface CloudinaryWidget {
        open: () => void;
    }

    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (
                    error: unknown,
                    result: CloudinaryUploadWidgetResults
                ) => void
            ) => CloudinaryWidget;
        };
    }
}

export interface UploadWidgetValue {
    url: string;
    publicId: string;
}

export interface UploadWidgetProps {
    value?: UploadWidgetValue | null;
    onChange?: (value: UploadWidgetValue | null) => void;
    disabled?: boolean;
}
export enum UserRole {
    OWNER = "OWNER",
    MANAGER = "MANAGER",
    ACCOUNTANT = "ACCOUNTANT",
    CARETAKER = "CARETAKER",
    ADMIN = "ADMIN",
}

export type User = {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    name: string;
    role: UserRole;
    image?: string;
    imageCldPubId?: string;
    organizationId?: string;
};



export type SignUpPayload = {
    email: string;
    name: string;
    password: string;
    image?: string;
    imageCldPubId?: string;
    role: UserRole;
};

//property
export type Property = {
    id: string;
    code: string;
    name: string;
    propertyType: string;
    address: string;
    county: string;
    status: string;
}

export type Block = {
    id: string;
    name: string;
};

export type Floor = {
    id: string;
    name: string;
    level: number;
}

export type UnitType = {
    id: string;
    organizationId: string;
    name: string;
}

export type PropertyDetails = {
    id: string;
    code: string;
    name: string;
    propertyType: string;
    address: string;
    status: string;
    blocks: Block[];
    floors: Floor[];
    units: Unit[];
};
//lease
export type LeaseStatus =
    | "ACTIVE"
    | "EXPIRED"
    | "CANCELLED";

//unit
export type Unit = {
    id: string;
    unitNumber: string;
    organizationId: string;
    propertyId: string;
    propertyName: string;
    unitTypeId: string;
    unitTypeName: string;
}

//tenant
export type Tenant = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    email: string;
    status: string;
    occupation: string;
    dateOfBirth: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    nationalId: string;
    nationalIdImg: string;
    imageCldPubId: string;
}

export type Lease = {
    id: string;
    leaseNumber: string;
    tenant: Tenant;
    unit: Unit;
    startDate: string;
    endDate: string;
    moveInDate: string;
    monthlyRent: number;
    status: LeaseStatus;
    createdAt: string;
    updatedAt: string;
};


export type InvoiceType = {
    id: string;
    name: string;
}

export type Invoice = {
    id: string;
    invoiceNumber: string;
    leaseId: string;
    lease: Lease;
    invoiceType: InvoiceType;
    tenant: Tenant;
    unit: Unit;
    invoiceDate: string;
    dueDate: string;
    amount: number;
    status: InvoiceStatus;
    createdAt: string;
    updatedAt: string;
}

export type InvoiceStatus = | "DRAFT" | "ISSUED" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "VOID";

export type Payment = {
    id: string;
    invoiceId: string;
    tenantId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    receiptNumber: string;
    paymentReference: string | null;
    paidAt: string;
    notes: string | null;
    recordedBy: string;
    invoice: Invoice
    tenant: Tenant;
    unit: Unit;
};

export type PaymentMethod =
    | "MPESA"
    | "BANK_TRANSFER"
    | "CASH"
    | "CHEQUE";


