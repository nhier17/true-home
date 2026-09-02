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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    const date = new Date(`${value}-01`);

    return new Intl.DateTimeFormat("en-KE", {
        month: "short",
    }).format(date);
};

export const RevenueTrendChart = ({
                                      data,

                                  }: RevenueTrendChartProps) => {

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Invoiced vs collected over the last 6 months
                </p>
            </CardHeader>

            <CardContent className="">
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 10,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="month"
                                tickFormatter={formatMonth}
                            />

                            <YAxis
                                tickFormatter={(value) =>
                                    `KES ${Number(value).toLocaleString()}`
                                }
                            />

                            <Tooltip
                                formatter={(value, name) => [
                                    formatCurrency(Number(value)),
                                    name === "invoiced"
                                        ? "Invoiced"
                                        : "Collected",
                                ]}
                                labelFormatter={formatMonth}
                            />

                            <Legend />

                            <Line
                                type="monotone"
                                dataKey="invoiced"
                                name="Invoiced"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />

                            <Line
                                type="monotone"
                                dataKey="collected"
                                name="Collected"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};