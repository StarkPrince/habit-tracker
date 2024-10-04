'use client';

import HabitBarChart from '@/components/HabitBarChart';
import HabitHeatmap from '@/components/HabitHeatmap';
import HabitLineChart from '@/components/HabitLineChart';
import { Habit } from '@/types';
import { aggregateLogsByDay, DailyCount } from '@/utils/dataProcessing';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Circles } from 'react-loader-spinner';

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

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <Circles color="#4fa94d" height={80} width={80} />
            </div>
        );
    if (error) return <p className="text-red-500">{error}</p>;
    if (!habit) return <p className="text-red-500">Habit not found.</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">{habit.name}</h1>
            <p className="text-gray-600 mb-4">Created on: {new Date(habit.createdAt).toLocaleDateString()}</p>

            <div className="mb-6">
                <button
                    onClick={() => logHabit(id)}
                    className="text-blue-500 hover:underline"
                >
                    Log Occurrence
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HabitLineChart dailyCounts={dailyCounts} />
                <HabitBarChart dailyCounts={dailyCounts} />
            </div>
            <HabitHeatmap dailyCounts={dailyCounts} />


            <div className="mt-6">
                <h3 className="text-lg font-semibold">Logs:</h3>
                {habit.logs.length === 0 ? (
                    <p>No logs yet.</p>
                ) : (
                    <ul className="list-disc list-inside">
                        {habit.logs.map((log, index) => (
                            <li key={index}>{new Date(log).toLocaleString()}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HabitDetailsPage;
