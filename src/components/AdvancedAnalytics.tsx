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
    // Process data for heatmap
    // const heatmapData = processHeatmapData(habit.logs);

    // Process data for day of week distribution
    const dayDistributionData = processDayDistributionData(habit.logs);
    return (
        <div className="space-y-6">
            {/* <Card>
                <CardHeader>
                    <CardTitle>Habit Occurrence Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-64">
                        <HeatMap data={heatmapData} />
                    </div>
                </CardContent>
            </Card> */}

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


// interface HeatMapProps
// {
//     data: number[][];
// }

// const HeatMap: React.FC<HeatMapProps> = ({ data }) => 
// {
//     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const hours = Array.from({ length: 24 }, (_, i) => i);

//     const maxValue = Math.max(...data.flat());

//     return (
//         <Card className="w-full">
//             <CardHeader>
//                 <CardTitle>Weekly Habit Heatmap</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="w-full overflow-x-auto">
//                     <div className="min-w-[600px]">
//                         <div className="flex">
//                             <div className="w-10" /> {/* Spacer for day labels */}
//                             <div className="flex-grow grid grid-cols-24 gap-px">
//                                 {hours.map(hour => (
//                                     <div key={hour} className="text-center text-xs text-muted-foreground">
//                                         {hour}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                         <div className="flex">
//                             <div className="w-10 flex flex-col justify-between text-xs text-muted-foreground">
//                                 {days.map(day => (
//                                     <div key={day} className="h-8 flex items-center">
//                                         {day}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="flex-grow grid grid-cols-24 grid-rows-7 gap-px">
//                                 {data.flatMap((row, i) =>
//                                     row.map((value, j) => (
//                                         <div
//                                             key={`${i}-${j}`}
//                                             className="w-full h-8"
//                                             style={{
//                                                 backgroundColor: `hsl(var(--primary) / ${value / maxValue})`,
//                                             }}
//                                             title={`${days[i]} ${hours[j]}:00 - ${value} occurrences`}
//                                         />
//                                     ))
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

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