import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FinancialCardProps = {
    title: string;
    value: number;
    icon: LucideIcon;
    accent: string;
    description: string;
};

export const FinancialCard = ({
                                  title,
                                  value,
                                  icon: Icon,
                                  accent,
                                  description,

                              }: FinancialCardProps) => {
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
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight">
                        KES {value.toLocaleString("en-KE")}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/60"
                >
                    <Icon className={cn("h-5 w-5", accent)} />
                </div>
            </div>
        </div>
    );
};