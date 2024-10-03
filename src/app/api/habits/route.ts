import dbConnect from "@/lib/mongoose";
import Habit from "@/models/Habit";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const habits = await Habit.find({ user: session.user.id }).sort({
      createdAt: -1,
    });
    return NextResponse.json(habits, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("session", session, request);

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Habit name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingHabit = await Habit.findOne({ name, user: session.user.id });

    if (existingHabit) {
      return NextResponse.json(
        { error: "Habit already exists" },
        { status: 400 }
      );
    }

    const habit = await Habit.create({ name, user: session.user.id });

    return NextResponse.json(habit, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
