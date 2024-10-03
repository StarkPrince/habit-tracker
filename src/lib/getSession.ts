// src/lib/getSession.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function getSession(req: Request) {
  return await getServerSession(authOptions);
}
