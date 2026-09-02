import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type OccupancyChartProps = {
    occupiedUnits: number;
    vacantUnits: number;
};

export const OccupancyChart = ({
                                   occupiedUnits,
                                   vacantUnits,
                               }: OccupancyChartProps) => {

    const totalUnits = occupiedUnits + vacantUnits;

    const occupancyPercentage =
        totalUnits > 0
            ? Math.round((occupiedUnits / totalUnits) * 100)
            : 0;

    const data = [
        {
            name: "Occupied",
            value: occupiedUnits,
        },
        {
            name: "Vacant",
            value: vacantUnits,
        },
    ];

    const occupiedColors = ["#0ea5e9", "#f97316", ];

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle>Unit Occupancy</CardTitle>

                <p className="text-sm text-muted-foreground">
                    Current occupancy across all units
                </p>
            </CardHeader>

            <CardContent>
                <div className="relative h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                strokeWidth={0}
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={occupiedColors[index]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />

                            <Legend
                                verticalAlign="bottom"
                                height={36}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <p className="text-3xl font-bold">
                                {occupancyPercentage}%
                            </p>

                            <p className="text-sm text-muted-foreground">
                                Occupied
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-semibold">
                            {occupiedUnits}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Occupied
                        </p>
                    </div>

                    <div>
                        <p className="text-2xl font-semibold">
                            {vacantUnits}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Vacant
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};