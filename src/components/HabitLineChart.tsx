'use client';

import { DailyCount } from '@/utils/dataProcessing';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface HabitLineChartProps
{
    dailyCounts: DailyCount[];
}

const HabitLineChart: React.FC<HabitLineChartProps> = ({ dailyCounts }) =>
{
    const sortedData = [...dailyCounts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sortedData}>
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
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default HabitLineChart;