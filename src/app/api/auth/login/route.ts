import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 400 }
        );
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User doesnt exists" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
