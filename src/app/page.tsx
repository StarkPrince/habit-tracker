'use client'

import { HabitInsights } from '@/components/HabitInsights'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { logHabitGlobal } from '@/lib/utils'
import { IHabit } from '@/models/Habit'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveCalendar } from '@nivo/calendar'
import { ResponsivePie } from '@nivo/pie'
import axios from 'axios'
import { Calendar, Info, Plus } from "lucide-react"
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface DailyActivity
{
  day: string;
  count: number;
}

interface HabitDistribution
{
  id: string;
  label: string;
  value: number;
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
  const [habits, setHabits] = useState<IHabit[]>([])
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

  const logHabit = useCallback(async (id: string) =>
  {
    try {
      logHabitGlobal(id, new Date().toISOString().substring(0, 10), new Date().toTimeString().substring(0, 5))
      fetchHabits()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to log habit')
    }
  }, [])

  useEffect(() =>
  {
    fetchHabits()
  }, [])

  function GroupedInsights({ habits }: { habits: IHabit[] })
  {
    // Process data for insights
    const getHabitDistribution = (): HabitDistribution[] =>
    {
      return habits.map(habit => ({
        id: habit.name,
        label: habit.name,
        value: habit.logs.length
      }));
    };

    const getDailyActivityData = (): { [key: string]: number } =>
    {
      const activityData: { [key: string]: number } = {};
      habits.forEach(habit =>
      {
        habit.logs.forEach(log =>
        {
          const date = new Date(log).toISOString().split('T')[0];
          activityData[date] = (activityData[date] || 0) + 1;
        });
      });
      return activityData;
    };

    const getMostActiveHabits = () =>
    {
      return habits
        .map(habit => ({
          habit: habit.name,
          count: habit.logs.length
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    };

    const habitDistribution = getHabitDistribution();
    const dailyActivity = getDailyActivityData();
    const mostActiveHabits = getMostActiveHabits();

    return (
      <Card className="w-full mt-8">
        <CardHeader>
          <CardTitle>Habit Insights</CardTitle>
          <CardDescription>Overview of your habit tracking progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="distribution" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="distribution">
              <div className="h-[300px]">
                <ResponsivePie
                  data={habitDistribution}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: 'nivo' }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLabelsSkipAngle={10}
                />
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="h-[300px]">
                <ResponsiveCalendar
                  data={Object.entries(dailyActivity).map(([day, value]) => ({
                    day,
                    value
                  }))}
                  from={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]}
                  to={new Date().toISOString().split('T')[0]}
                  emptyColor="#eeeeee"
                  colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
                  margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                  yearSpacing={40}
                  monthBorderColor="#ffffff"
                  dayBorderWidth={2}
                  dayBorderColor="#ffffff"
                />
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <div className="h-[300px]">
                <ResponsiveBar
                  data={mostActiveHabits}
                  keys={['count']}
                  indexBy="habit"
                  margin={{ top: 50, right: 60, bottom: 80, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  colors={{ scheme: 'nivo' }}
                  animate={true}
                  motionConfig="gentle"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: 'Habits',
                    legendPosition: 'middle',
                    legendOffset: 60
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Count',
                    legendPosition: 'middle',
                    legendOffset: -50
                  }}
                  enableLabel={true}
                  label={d => `${d.value}`}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                  }}
                  role="application"
                  ariaLabel="Habit frequency chart"
                  tooltip={({ id, value, color }) => (
                    <div
                      style={{
                        padding: 12,
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    >
                      <strong>{id}</strong>
                      <br />
                      <span>Count: {value}</span>
                    </div>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-primary">Track Your Habits</h2>
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
          <div>
            <HabitInsights habits={habits} />
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
            {habits.length > 0 && <GroupedInsights habits={habits} />}
          </div>
        )}
      </div>
      {/* on small device make the width full screen */}
      {/* <Card className="w-full mt-72 sm:w-full">
        <CardContent className="my-2 p-0">
          <WorldMapUserDistribution />
        </CardContent>
      </Card> */}
    </>
  )
}