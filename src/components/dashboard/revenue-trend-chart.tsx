import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type RevenueTrend = {
    month: string;
    invoiced: number;
    collected: number;
};

type RevenueTrendChartProps = {
    data: RevenueTrend[];
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
    }).format(value);

const formatMonth = (value: string) => {
    const [year, month] = value.split("-").map(Number);

    if (!year || !month) return value;

    return new Date(year, month - 1, 1).toLocaleDateString("en-KE", {
        month: "short",
        year: "2-digit",
    });
};

const formatAxisValue = (value: number) => {
    if (Math.abs(value) >= 1_000_000) {
        return `KES ${(value / 1_000_000).toFixed(1)}M`;
    }

    if (Math.abs(value) >= 1_000) {
        return `KES ${(value / 1_000).toFixed(0)}K`;
    }

    return `KES ${value}`;
};

export const RevenueTrendChart = ({
                                      data = [],
                                  }: RevenueTrendChartProps) => {
    return (
        <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                    Revenue Trends
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                    Compare invoiced amounts with payments collected
                    over the last 6 months.
                </p>
            </CardHeader>

            <CardContent>
                {data.length > 0 ? (
                    <div className="h-[300px] w-full sm:h-[340px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{
                                    top: 12,
                                    right: 12,
                                    left: 8,
                                    bottom: 4,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="currentColor"
                                    opacity={0.12}
                                />

                                <XAxis
                                    dataKey="month"
                                    tickFormatter={formatMonth}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12 }}
                                    minTickGap={16}
                                />

                                <YAxis
                                    tickFormatter={formatAxisValue}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 11 }}
                                    width={82}
                                    allowDecimals={false}
                                />

                                <Tooltip
                                    labelFormatter={(label) =>
                                        formatMonth(String(label))
                                    }
                                    formatter={(value, name) => [
                                        formatCurrency(Number(value)),
                                        name === "invoiced"
                                            ? "Invoiced"
                                            : "Collected",
                                    ]}
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: "1px solid #e5e7eb",
                                        boxShadow:
                                            "0 4px 16px rgba(0,0,0,0.08)",
                                        padding: "10px 14px",
                                    }}
                                    labelStyle={{
                                        fontWeight: 600,
                                        marginBottom: 6,
                                    }}
                                    cursor={{
                                        stroke: "#94a3b8",
                                        strokeDasharray: "4 4",
                                    }}
                                />

                                <Legend
                                    verticalAlign="top"
                                    align="right"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: 12 }}
                                    formatter={(value) =>
                                        value === "Invoiced"
                                            ? "Invoiced"
                                            : "Collected"
                                    }
                                />

                                <Line
                                    type="monotone"
                                    dataKey="invoiced"
                                    name="Invoiced"
                                    stroke="#8b5cf6"
                                    strokeWidth={2.5}
                                    dot={{
                                        r: 3,
                                        fill: "#8b5cf6",
                                        strokeWidth: 0,
                                    }}
                                    activeDot={{
                                        r: 6,
                                        stroke: "#ffffff",
                                        strokeWidth: 2,
                                    }}
                                    animationDuration={700}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="collected"
                                    name="Collected"
                                    stroke="#0d9488"
                                    strokeWidth={3}
                                    dot={{
                                        r: 3,
                                        fill: "#0d9488",
                                        strokeWidth: 0,
                                    }}
                                    activeDot={{
                                        r: 6,
                                        stroke: "#ffffff",
                                        strokeWidth: 2,
                                    }}
                                    animationDuration={700}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center">
                        <p className="font-medium text-muted-foreground">
                            No revenue data available yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Your invoiced amounts and collected payments
                            will appear here when data is available.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};