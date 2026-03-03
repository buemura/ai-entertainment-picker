import { db } from "@/db";
import { recommendations } from "@/db/schema";
import { and, eq, gte } from "drizzle-orm";

export const DAILY_LIMIT = process.env.DAILY_LIMIT
  ? parseInt(process.env.DAILY_LIMIT)
  : 3;

function getStartOfDay(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export async function getTodayCount(userId: string): Promise<number> {
  const startOfDay = getStartOfDay();
  const todayRecs = await db
    .select({ id: recommendations.id })
    .from(recommendations)
    .where(
      and(
        eq(recommendations.userId, userId),
        gte(recommendations.createdAt, startOfDay),
      ),
    );
  return todayRecs.length;
}
