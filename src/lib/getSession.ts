// src/lib/getSession.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function getSession(_: Request) {
  return await getServerSession(authOptions);
}
