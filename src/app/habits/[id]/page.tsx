'use client';

import HabitBarChart from '@/components/HabitBarChart';
import HabitHeatmap from '@/components/HabitHeatmap';
import HabitLineChart from '@/components/HabitLineChart';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Habit } from '@/types';
import { aggregateLogsByDay, DailyCount } from '@/utils/dataProcessing';
import axios from 'axios';
import { BarChart3, CalendarDays, LineChart } from "lucide-react";
import { useEffect, useState } from 'react';

const HabitDetailsPage = ({ params }: { params: { id: string } }) =>
{
    const { id } = params;
    const [habit, setHabit] = useState<Habit | null>(null);
    const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchHabit = async () =>
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
    };

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

            <Card>
                <CardHeader>
                    <CardTitle>Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    {habit.logs.length === 0 ? (
                        <p className="text-muted-foreground">No logs yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {habit.logs.map((log, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                    {new Date(log).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default HabitDetailsPage;