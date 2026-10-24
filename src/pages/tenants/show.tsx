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

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="text-lg">
                        ID / Passport Document
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {tenant.nationalIdImg ? (
                        <a
                            href={tenant.nationalIdImg}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                        >
                            <img
                                src={tenant.nationalIdImg}
                                alt={`${fullName}'s ID or passport`}
                                className="max-h-96 w-auto max-w-full rounded-lg border object-contain"
                                loading="lazy"
                            />
                            <p className="mt-2 text-sm text-muted-foreground">
                                Click the image to view it in full size.
                            </p>
                        </a>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No ID or passport image has been uploaded.
                        </p>
                    )}
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


export default TenantDetails;
