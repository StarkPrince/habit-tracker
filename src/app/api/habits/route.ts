import { getUserId } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Habit from "@/models/Habit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const habits = await Habit.find({ user: userId }).sort({ createdAt: -1 });
    return NextResponse.json(habits, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Habit name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingHabit = await Habit.findOne({ name, user: userId });

    if (existingHabit) {
      return NextResponse.json(
        { error: "Habit already exists" },
        { status: 400 }
      );
    }

    const habit = await Habit.create({ name, user: userId });

    return NextResponse.json(habit, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
