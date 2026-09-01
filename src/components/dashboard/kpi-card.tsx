import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type OverviewCardProps = {
    title: string;
    value: number;
    icon: LucideIcon;
    accent: string;
};

export const KpiCard = ({
    title,
    value,
    icon: Icon,
    accent,
}: OverviewCardProps) => {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-xl border border-border bg-card p-5",
                "transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm",
            )}
        >
            <div
                className={cn(
                    "absolute left-0 top-0 h-full w-1",
                    accent.replace("text-", "bg-"),
                )}
            />

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight">
                        {value.toLocaleString()}
                    </p>
                </div>

                <div
                    className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        "bg-muted/60 transition-colors duration-200",
                        "group-hover:bg-muted",
                    )}
                >
                    <Icon
                        className={cn(
                            "h-5 w-5",
                            accent,
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

