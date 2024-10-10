'use client';

import { Habit } from '@/types';
import
{
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface HabitChartByHourProps
{
    habit: Habit;
}

const HabitChartByHour: React.FC<HabitChartByHourProps> = ({ habit }) =>
{
    const processHourDistributionData = (
        logs: string[]
    ): { hour: number; frequency: number }[] =>
    {
        const counts = Array(24).fill(0);
        logs.forEach((log) =>
        {
            const hour = new Date(log).getHours();
            counts[hour]++;
        });
        return counts
            .map((frequency, hour) => ({ hour, frequency }))
            .filter((data) => data.frequency > 0); // Exclude hours with zero frequency
    };

    const hourDistributionData = processHourDistributionData(habit.logs);

    const formatHour = (hour: number) =>
    {
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        return `${hour12.toString().padStart(2, '0')}:00 ${ampm}`;
    };

    const CustomTooltip = ({ active, payload }: any) =>
    {
        if (active && payload && payload.length) {
            const hourFormatted = formatHour(payload[0].payload.hour);
            const frequency = payload[0].value;
            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow">
                    <p className="text-sm text-gray-700">{`${hourFormatted}: ${frequency}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
                <XAxis
                    type="number"
                    dataKey="hour"
                    name="Hour"
                    domain={[0, 23]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatHour}
                    label={{
                        value: 'Hour',
                        position: 'insideBottom',
                        offset: -5,
                        fontSize: 14,
                    }}
                />
                <YAxis
                    type="number"
                    dataKey="frequency"
                    name="Frequency"
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    label={{
                        value: 'Frequency',
                        angle: -90,
                        position: 'insideLeft',
                        fontSize: 14,
                    }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={CustomTooltip} />
                <Scatter data={hourDistributionData} fill="#6366F1" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default HabitChartByHour;
