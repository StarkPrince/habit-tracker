// src/app/api/habits/[id]/log/route.ts
import { getUserId } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Habit from "@/models/Habit";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Habit ID" }, { status: 400 });
    }

    await dbConnect();

    const habit = await Habit.findOne({ _id: id, user: userId });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    habit.logs.push(new Date());
    await habit.save();

    return NextResponse.json(habit, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
