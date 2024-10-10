'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Habit } from '@/types';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface AdvancedHabitAnalyticsProps
{
    habit: Habit;
}

const AdvancedHabitAnalytics: React.FC<AdvancedHabitAnalyticsProps> = ({ habit }) =>
{
    const dayDistributionData = processDayDistributionData(habit.logs);
    return (
        <div className="space-y-6">

            <Card>
                <CardHeader>
                    <CardTitle>Day of Week Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dayDistributionData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {dayDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 50%)`} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};



function processHeatmapData(logs: string[]): number[][]
{
    const data = Array(7).fill(0).map(() => Array(24).fill(0));
    logs.forEach(log =>
    {
        const date = new Date(log);
        data[date.getDay()][date.getHours()]++;
    });
    console.log(data);
    return data;
}

function processDayDistributionData(logs: string[]): { name: string; value: number }[]
{
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts = Array(7).fill(0);
    logs.forEach(log =>
    {
        const day = new Date(log).getDay();
        counts[day]++;
    });
    return days.map((name, index) => ({ name, value: counts[index] }));
}

export default AdvancedHabitAnalytics;