'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyCount } from '@/utils/dataProcessing';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface HabitBarChartProps
{
    dailyCounts: DailyCount[];
}

const HabitBarChart: React.FC<HabitBarChartProps> = ({ dailyCounts }) =>
{
    const sortedData = [...dailyCounts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <Card>
            <CardHeader>
                <CardTitle>Habit Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sortedData}>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ background: 'hsl(var(--card))', border: 'none', borderRadius: '6px' }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Bar
                            dataKey="count"
                            fill="hsl(var(--primary))"
                            barSize={20}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default HabitBarChart;