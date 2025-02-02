import dbConnect from "@/lib/mongoose";
import Habit, { IHabit } from "@/models/Habit";
import { NextResponse } from "next/server";

const calculateDailyActivity = (habits: IHabit[]) => {
  return habits.map((habit) => ({
    day: habit.createdAt,
    count: habit.logs.length,
  }));
};

const calculateStreaks = (habits: IHabit[]) => {
  return habits.map((habit) => ({
    id: habit.name,
    label: habit.name,
    value: habit.logs.length,
  }));
};

const calculateCompletionRate = (habits: IHabit[]) => {
  return (
    habits.reduce((acc, habit) => acc + habit.logs.length, 0) / habits.length
  );
};

export async function GET() {
  try {
    await dbConnect();

    // Get all habits with their logs
    const habits = await Habit.find({});

    // Calculate various analytics
    const analytics = {
      totalHabits: habits.length,
      totalLogs: habits.reduce((acc, habit) => acc + habit.logs.length, 0),
      habitDistribution: habits.map((habit) => ({
        id: habit.name,
        label: habit.name,
        value: habit.logs.length,
      })),
      dailyActivity: calculateDailyActivity(habits),
      streaks: calculateStreaks(habits),
      completionRate: calculateCompletionRate(habits),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
