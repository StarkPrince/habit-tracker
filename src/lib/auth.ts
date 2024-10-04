// src/lib/auth.ts
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { authOptions } from "../app/api/auth/[...nextauth]/authOptions";

export async function getUserId(req: NextRequest): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (session && session.user && session.user.id) {
    return session.user.id;
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7); // Remove 'Bearer ' from the header
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      return decoded.id;
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }

  // No valid authentication found
  return null;
}
