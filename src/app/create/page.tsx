// src/app/create/page.tsx
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateHabitPage()
{
    return (
        <ProtectedRoute>
            <CreateHabit />
        </ProtectedRoute>
    )
}

function CreateHabit()
{
    const [name, setName] = useState<string>('')
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault()
        if (!name.trim()) {
            setError('Habit name is required')
            return
        }
        try {
            await axios.post('/api/habits', { name })
            router.push('/')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create habit')
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Create New Habit</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Habit Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError('') }}
                        className="w-full mt-1 p-2 border rounded"
                        placeholder="e.g., Smoking"
                    />
                </label>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Create
                </button>
            </form>
        </div>
    )
}
