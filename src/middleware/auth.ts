// src/middleware/auth.ts
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export function verifyToken(req: NextRequest): DecodedToken | NextResponse {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "No authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded;
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
