import { IHabit } from "@/models/Habit"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface HabitInsightsProps
{
    habits: IHabit[]
}

export function HabitInsights({ habits }: HabitInsightsProps)
{
    const calculateStreak = (logs: Date[]) =>
    {
        // Sort logs by date
        const sortedLogs = [...logs].sort((a, b) =>
            b.getTime() - a.getTime()
        )

        let currentStreak = 0
        let lastDate = new Date()

        for (const log of sortedLogs) {
            const diffDays = Math.floor(
                (lastDate.getTime() - log.getTime()) / (1000 * 60 * 60 * 24)
            )

            if (diffDays === 1) {
                currentStreak++
                lastDate = log
            } else if (diffDays === 0) {
                lastDate = log
            } else {
                break
            }
        }

        return currentStreak
    }

    const getCompletionRate = (logs: Date[]) =>
    {
        const today = new Date()
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30))

        const recentLogs = logs.filter(log =>
            log >= thirtyDaysAgo
        )

        return (recentLogs.length / 30) * 100
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
                <CardHeader>
                    <CardTitle>Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">
                        {calculateStreak(habits.flatMap(h => h.logs.map(log => new Date(log))))} days
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>30-Day Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">
                        {getCompletionRate(habits.flatMap(h => h.logs.map(log => new Date(log)))).toFixed(1)}%
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Total Habits Tracked</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">
                        {habits.reduce((acc, habit) => acc + habit.logs.length, 0)}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 