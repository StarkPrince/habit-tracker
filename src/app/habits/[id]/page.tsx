// src/app/habits/[id]/page.tsx
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Habit
{
    _id: string
    name: string
    createdAt: string
    logs: string[]
}

export default function HabitDetailsPage()
{
    return (
        <ProtectedRoute>
            <HabitDetails />
        </ProtectedRoute>
    )
}

function HabitDetails()
{
    const { id } = useParams()
    const [habit, setHabit] = useState<Habit | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const [selectedLog, setSelectedLog] = useState<string | null>(null)

    const fetchHabit = async () =>
    {
        try {
            const res = await axios.get(`/api/habits/${id}`)
            setHabit(res.data)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch habit')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() =>
    {
        fetchHabit()
    }, [id])

    const calculateLongestStreak = (logs: string[]): string =>
    {
        if (logs.length === 0) return 'No logs yet.'

        const sortedLogs = logs.map(log => new Date(log)).sort((a, b) => a.getTime() - b.getTime())
        let longest = 0
        let current = 0
        let previous: any = null

        sortedLogs.forEach(log =>
        {
            if (previous) {
                const diffInDays = Math.floor((log.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24))
                if (diffInDays > 1) {
                    current += diffInDays - 1
                }
            }
            longest = Math.max(longest, current)
            previous = log
        })

        return `${longest} day(s)`
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p className="text-red-500">{error}</p>
    if (!habit) return <p>Habit not found.</p>

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">{habit.name}</h2>
            <p className="text-gray-600 mb-2">Created on: {new Date(habit.createdAt).toLocaleDateString()}</p>
            <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Logs</h3>
                {habit.logs.length === 0 ? (
                    <p>No logs yet.</p>
                ) : (
                    <ul className="list-disc list-inside">
                        {habit.logs.map((log, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setSelectedLog(log)}
                                    className="text-blue-500 hover:underline"
                                >
                                    {new Date(log).toLocaleString()}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedLog && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <h4 className="font-semibold">Log Details</h4>
                    <p>Date & Time: {new Date(selectedLog).toLocaleString()}</p>
                    <button
                        onClick={() => setSelectedLog(null)}
                        className="mt-2 text-blue-500 hover:underline"
                    >
                        Close
                    </button>
                </div>
            )}
            <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Statistics</h3>
                <p>Longest streak without performing the habit: {calculateLongestStreak(habit.logs)}</p>
            </div>
        </div>
    )
}
