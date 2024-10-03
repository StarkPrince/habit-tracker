// src/app/page.tsx
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Habit
{
  _id: string
  name: string
  createdAt: string
  logs: string[]
}

export default function Home()
{
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  )
}

function HomeContent()
{
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const fetchHabits = async () =>
  {
    try {
      const res = await axios.get('/api/habits')
      setHabits(res.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch habits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() =>
  {
    fetchHabits()
  }, [])

  const logHabit = async (id: string) =>
  {
    try {
      await axios.post(`/api/habits/${id}/log`)
      fetchHabits()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to log habit')
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bad Habits</h2>
      {habits.length === 0 ? (
        <p>No habits found. <Link href="/create" className="text-blue-500">Create one!</Link></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit) => (
            <div key={habit._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold">{habit.name}</h3>
              <p className="text-sm text-gray-600">Created on: {new Date(habit.createdAt).toLocaleDateString()}</p>
              <div className="mt-2 flex space-x-2">
                <Link href={`/habits/${habit._id}`} className="text-blue-500 hover:underline">
                  Details
                </Link>
                <button
                  onClick={() => logHabit(habit._id)}
                  className="text-red-500 hover:underline"
                >
                  Did it again!
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-700">Logs: {habit.logs.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
