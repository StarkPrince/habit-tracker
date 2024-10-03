// src/app/api/habits/[id]/log/route.ts
import dbConnect from "@/lib/mongoose";
import Habit from "@/models/Habit";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Habit ID" }, { status: 400 });
    }

    await dbConnect();

    const habit = await Habit.findOne({ _id: id, user: session.user.id });

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
