import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import {useState} from "react";

;

type MpesaIntegration = {
    id: string;
    paybillNumber: string;
    shortcode: string;
    environment: "SANDBOX" | "PRODUCTION";
    status: "PENDING" | "ACTIVE" | string;
};

const SettingsList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <ListView>
            <Breadcrumb />

        </ListView>
    );
};

export default SettingsList;
