import { useShow } from "@refinedev/core";
import { useParams } from "react-router";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ShowView,
    ShowViewHeader,
} from "@/components/refine-ui/views/show-view";

import type { Tenant } from "@/types";

const TenantDetails = () => {
    const { id } = useParams();

    const { query } = useShow<Tenant>({
        resource: "tenants",
        id,
    });

    const tenant = query.data?.data;

    if (query.isLoading) {
        return (
            <ShowView className="space-y-6 tenant-view">
                <ShowViewHeader title="Tenant Details" />
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        Loading tenant details...
                    </CardContent>
                </Card>
            </ShowView>
        );
    }

    if (query.isError || !tenant) {
        return (
            <ShowView className="space-y-6 tenant-view">
                <ShowViewHeader title="Tenant Details" />
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="font-medium">Tenant not found</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            The tenant may have been removed or you may not
                            have permission to view this record.
                        </p>
                    </CardContent>
                </Card>
            </ShowView>
        );
    }

    const fullName = [
        tenant.firstName,
        tenant.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <ShowView className="space-y-6 tenant-view">
            <ShowViewHeader title="Tenant Details" />

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Personal Information
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem
                            label="Full Name"
                            value={fullName}
                        />
                        <DetailItem
                            label="Email"
                            value={tenant.email}
                        />
                        <DetailItem
                            label="Phone Number"
                            value={tenant.phone}
                        />
                        <DetailItem
                            label="Identification Number"
                            value={tenant.nationalId}
                        />
                        <DetailItem
                            label="Emergency Contact"
                            value={tenant.emergencyContactName}
                        />
                        <DetailItem
                            label="Emergency Contact Phone"
                            value={tenant.emergencyContactPhone}
                        />
                    </div>
                </CardContent>
            </Card>
        </ShowView>
    );
};

type DetailItemProps = {
    label: string;
    value?: string | number | Date | null;
};

const DetailItem = ({ label, value }: DetailItemProps) => (
    <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 break-words font-medium">
            {value ? String(value) : "—"}
        </p>
    </div>
);

const formatDate = (value?: string | Date | null) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
};

export default TenantDetails;
