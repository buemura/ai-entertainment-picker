import { db } from "@/db";
import { recommendations, users } from "@/db/schema";
import { and, eq, gte } from "drizzle-orm";

export const DAILY_LIMIT = process.env.DAILY_LIMIT
  ? parseInt(process.env.DAILY_LIMIT)
  : 3;

const WHITELIST_DAILY_LIMIT = process.env.WHITELIST_DAILY_LIMIT
  ? parseInt(process.env.WHITELIST_DAILY_LIMIT)
  : 50;

const whitelistedEmails: Set<string> = new Set(
  (process.env.WHITELIST_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

function getStartOfDay(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export async function getDailyLimit(userId: string): Promise<number> {
  if (whitelistedEmails.size === 0) return DAILY_LIMIT;

  const user = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .then((rows) => rows[0]);

  if (user?.email && whitelistedEmails.has(user.email.toLowerCase())) {
    return WHITELIST_DAILY_LIMIT;
  }

  return DAILY_LIMIT;
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
