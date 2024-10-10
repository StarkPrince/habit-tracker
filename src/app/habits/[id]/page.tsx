'use client';

import HabitBarChart from '@/components/HabitBarChart';
import HabitHeatmap from '@/components/HabitHeatmap';
import HabitLineChart from '@/components/HabitLineChart';
import HabitPieChartByDay from '@/components/HabitPieChartByDay';
import HabitPieChartByHour from '@/components/HabitPieChartByHour';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Habit } from '@/types';
import { aggregateLogsByDay, DailyCount } from '@/utils/dataProcessing';
import axios from 'axios';
import { BarChart3, CalendarDays, LineChart, PieChart, ScatterChart } from "lucide-react";
import { useCallback, useEffect, useState } from 'react';

const HabitDetailsPage = ({ params }: { params: { id: string } }) =>
{
    const { id } = params;
    const [habit, setHabit] = useState<Habit | null>(null);
    const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

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

    const logHabit = async (id: string) =>
    {
        try {
            await axios.post(`/api/habits/${id}/log`)
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
                    <Button onClick={() => logHabit(id)} className="w-full sm:w-auto">
                        Log Occurrence
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <LineChart className="mr-2 h-5 w-5" />
                            Habit Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HabitLineChart dailyCounts={dailyCounts} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart3 className="mr-2 h-5 w-5" />
                            Habit Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HabitBarChart dailyCounts={dailyCounts} />
                    </CardContent>
                </Card>
            </div>



            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <CalendarDays className="mr-2 h-5 w-5" />
                        Habit Heatmap
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HabitHeatmap dailyCounts={dailyCounts} />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <PieChart className="mr-2 h-5 w-5" />
                            Habit By Day
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HabitPieChartByDay habit={habit} />
                    </CardContent>
                </Card>
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
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Logs</CardTitle>
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
                                    {habit.logs.map((log, index) =>
                                    {
                                        const currentDate: any = new Date(log);
                                        const day = currentDate.toLocaleDateString(undefined, { weekday: 'long' });
                                        const date = currentDate.toLocaleDateString();
                                        const time = currentDate.toLocaleTimeString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        });

                                        // Calculate the difference from the previous log
                                        let difference: any = null;
                                        let diffColor = 'text-gray-700'; // Default color

                                        if (index > 0) {
                                            const previousDate: any = new Date(habit.logs[index - 1]);
                                            difference = currentDate - previousDate; // difference in milliseconds

                                            if (!isNaN(difference)) {
                                                // Calculate difference in minutes
                                                const diffInMinutes = Math.round(difference / 60000);

                                                // Determine color for difference based on comparison with previous difference
                                                if (index === 1) {
                                                    diffColor = 'text-gray-700'; // No comparison for first difference
                                                } else {
                                                    const prevDifference =
                                                        // @ts-expect-error
                                                        new Date(habit.logs[index - 1]) - new Date(habit.logs[index - 2]);

                                                    diffColor = difference > prevDifference ? 'text-green-500' : 'text-red-500';
                                                }

                                                difference = `${diffInMinutes} mins`;
                                            } else {
                                                difference = '-';
                                            }
                                        }

                                        return (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{`${day}, ${date}`}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{time}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${diffColor}`}>
                                                    {difference === null ? '-' : difference}
                                                </td>
                                            </tr>
                                        );
                                    })}
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