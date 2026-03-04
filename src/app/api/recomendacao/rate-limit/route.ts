import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTodayCount, getDailyLimit } from "@/lib/rate-limit";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const dailyLimit = await getDailyLimit(session.user.id);
  const used = await getTodayCount(session.user.id);

  return NextResponse.json({
    limit: dailyLimit,
    used,
    remaining: Math.max(0, dailyLimit - used),
  });
}
