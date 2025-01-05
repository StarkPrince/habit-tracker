'use client';

import HabitAreaBump from '@/components/HabitAreaBump';
import HabitBarChart from '@/components/HabitBarChart';
import HabitBoxPlot from '@/components/HabitBoxPlot';
// import HabitBullet from '@/components/HabitBulltet';
import HabitHeatmap from '@/components/HabitHeatmap';
import HabitLineChart from '@/components/HabitLineChart';
import HabitPieChartByDay from '@/components/HabitPieChartByDay';
import HabitPieChartByHour from '@/components/HabitScatterPlotByHour';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { logHabitGlobal } from '@/lib/utils';
import { Habit } from '@/types';
import { aggregateLogsByDay, DailyCount } from '@/utils/dataProcessing';
import axios from 'axios';
import { BarChart3, BoxIcon, CalendarDays, LineChart, Logs, LucideAreaChart, PieChart, ScatterChart } from "lucide-react";
import { useCallback, useEffect, useState } from 'react';
interface LogEntry
{
    day: string;
    date: string;
    time: string;
    difference: string;
    diffColor: string;
}
const HabitDetailsPage = ({ params }: { params: { id: string } }) =>
{
    const { id } = params;
    const [habit, setHabit] = useState<Habit | null>(null);
    const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [time, setTime] = useState(() =>
    {
        const now = new Date();
        now.setMinutes(Math.floor(now.getMinutes() / 15) * 15);
        now.setSeconds(0, 0);
        return now.toTimeString().substring(0, 5);
    });
    const [date, setDate] = useState(() =>
    {
        const now = new Date();
        return now.toISOString().substring(0, 10); // Default to current date
    });


    const handleTimeChange = (event) =>
    {
        setTime(event.target.value);
    };

    const generateTimeOptions = () =>
    {
        const times: Date[] = [];
        const start = new Date();
        start.setHours(0, 0, 0, 0); // Start of the day
        for (let i = 0; i < 24 * 4; i++) {
            const optionTime = new Date(start.getTime() + i * 15 * 60 * 1000);
            times.push(optionTime);
        }
        return times;
    };

    const fetchHabit = useCallback(async () =>
    {
        try {
            const response = await axios.get(`/api/habits/${id}`);
            setHabit(response.data);
            const aggregated = aggregateLogsByDay(response.data.logs);
            setDailyCounts(aggregated);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch habit');
        } finally {
            setLoading(false);
        }
    }, [id]);
    const logHabit = async (id: string, logdate: string, logtime: string) =>
    {
        try {
            logHabitGlobal(id, logdate, logtime)
            fetchHabit()
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to log habit')
        }
    }


    useEffect(() =>
    {
        fetchHabit();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <Skeleton className="h-8 w-2/3 mb-4" />
                <Skeleton className="h-4 w-1/3 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <Skeleton className="h-64 w-full mt-6" />
            </div>
        );
    }

    if (error) return (
        <Card className="max-w-6xl mx-auto p-6 bg-destructive/10">
            <CardContent>
                <p className="text-destructive">{error}</p>
            </CardContent>
        </Card>
    );

    if (!habit) return (
        <Card className="max-w-6xl mx-auto p-6">
            <CardContent>
                <p className="text-muted-foreground">Habit not found.</p>
            </CardContent>
        </Card>
    );
    const processLogs = (logs: string[]): LogEntry[] =>
    {
        return logs.map((log, index) =>
        {
            const currentDate = new Date(log);
            const day = currentDate.toLocaleDateString(undefined, { weekday: 'long' });
            const date = currentDate.toLocaleDateString();
            const time = currentDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });

            let difference: string = '-';
            let diffColor: string = 'text-gray-700'; // Default color

            if (index > 0) {
                const previousDate = new Date(logs[index - 1]);
                const diffInMilliseconds = currentDate.getTime() - previousDate.getTime();

                if (!isNaN(diffInMilliseconds)) {
                    const diffInMinutes = Math.round(diffInMilliseconds / 60000);
                    difference = `${Math.abs(diffInMinutes)} mins`;

                    if (index > 1) {
                        const secondPreviousDate = new Date(logs[index - 2]);
                        const prevDifferenceMs = previousDate.getTime() - secondPreviousDate.getTime();

                        if (!isNaN(prevDifferenceMs)) {
                            const prevDifferenceMinutes = Math.round(prevDifferenceMs / 60000);
                            diffColor = diffInMinutes > prevDifferenceMinutes ? 'text-green-500' : 'text-red-500';
                        }
                    }
                }
            }

            return {
                day: `${day}, ${date}`,
                time,
                difference,
                diffColor,
            } as LogEntry;
        });
    };

    const logEntries: LogEntry[] = processLogs(habit.logs);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{habit.name}</CardTitle>
                    <CardDescription>
                        Created on: {new Date(habit.createdAt).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-center gap-4">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="flex-grow sm:flex-grow-0 h-9 rounded-lg border bg-background px-3 py-2 text-sm shadow-sm ring-offset-background transition-shadow focus:border-ring focus:ring-2 focus:ring-ring/30 focus:ring-offset-2"
                            placeholder='YYYY-MM-DD'
                        />
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="flex-grow sm:flex-grow-0 h-9 rounded-lg border bg-background px-3 py-2 text-sm shadow-sm ring-offset-background transition-shadow focus:border-ring focus:ring-2 focus:ring-ring/30 focus:ring-offset-2"
                            title='HH:MM'
                        >
                            {generateTimeOptions().map((option) => (
                                <option key={option.toISOString()} value={option.toTimeString().substring(0, 5)}>
                                    {option.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </option>
                            ))}
                        </select>
                        <Button onClick={() => logHabit(id, date, time)} className="h-9">
                            Log Occurrence
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <LineChart className="mr-2 h-5 w-5" />
                        Trends
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HabitLineChart dailyCounts={dailyCounts} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <CalendarDays className="mr-2 h-5 w-5" />
                        Heatmap
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HabitHeatmap dailyCounts={dailyCounts} />
                </CardContent>
            </Card>
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Map className="mr-2 h-5 w-5" />
                        Heatmap Canvas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HabitHeatmapByMonthAndYear habit={habit} />
                </CardContent>
            </Card> */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <LucideAreaChart className="mr-2 h-5 w-5" />
                        Area Bump
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HabitAreaBump habit={habit} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Bar Chart
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HabitBarChart dailyCounts={dailyCounts} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BoxIcon className="mr-2 h-5 w-5" />
                        Box Plot
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HabitBoxPlot habit={habit} />
                </CardContent>
            </Card>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <PieChart className="mr-2 h-5 w-5" />
                        Pie Chart
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HabitPieChartByDay habit={habit} />
                </CardContent>
            </Card>
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <List className="mr-2 h-5 w-5" />
                        Bullet
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HabitBullet habit={habit} />
                </CardContent>
            </Card> */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <ScatterChart className="mr-2 h-5 w-5" />
                        Habit By Hour
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HabitPieChartByHour habit={habit} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Logs className="mr-2 h-5 w-5" />
                        Logs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {habit.logs.length === 0 ? (
                        <p className="text-muted-foreground">No logs yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Day
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Time
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Difference
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logEntries.map((entry, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.day}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.time}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${entry.diffColor}`}>
                                                {entry.difference}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
};

export default HabitDetailsPage;