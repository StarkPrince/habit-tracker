'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import WorldMapUserDistribution from '@/components/WorldMap'
import axios from 'axios'
import { Calendar, Info, Plus } from "lucide-react"
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-primary">Bad Habits</h2>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="w-full bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : habits.length === 0 ? (
        <Card className="w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No habits found.</p>
            <Link href="/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create a habit
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <Card key={habit._id} className="w-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{habit.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Created on: {new Date(habit.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm text-muted-foreground flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Logs: {habit.logs.length}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/habits/${habit._id}`}>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </Link>
                <Button
                  onClick={() => logHabit(habit._id)}
                  variant="destructive"
                  size="sm"
                >
                  Did it again!
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Card className="w-full mt-72">
        <CardContent className="p-4">
          <WorldMapUserDistribution />
        </CardContent>
      </Card>
    </div>
  )
}