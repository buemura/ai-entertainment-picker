import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTodayCount, DAILY_LIMIT } from "@/lib/rate-limit";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const used = await getTodayCount(session.user.id);

  return NextResponse.json({
    limit: DAILY_LIMIT,
    used,
    remaining: Math.max(0, DAILY_LIMIT - used),
  });
}
