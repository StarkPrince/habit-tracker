'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { AlertCircle } from "lucide-react"
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
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault()
        if (!name.trim()) {
            setError('Habit name is required')
            return
        }
        setIsLoading(true)
        try {
            await axios.post('/api/habits', { name })
            router.push('/')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create habit')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create New Habit</CardTitle>
                    <CardDescription>Enter a name for the habit you want to break</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="habit-name">Habit Name</Label>
                                <Input
                                    id="habit-name"
                                    type="text"
                                    placeholder="e.g., Smoking"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setError('') }}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="flex items-center space-x-2 text-destructive">
                                    <AlertCircle size={16} />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Habit'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}