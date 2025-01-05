import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const logHabitGlobal = async (
  id: string,
  logdate: string,
  logtime: string
) => {
  const combinedDateTime = new Date(`${logdate}T${logtime}:00`);
  await axios.post(`/api/habits/${id}/log`, { combinedDateTime });
};
