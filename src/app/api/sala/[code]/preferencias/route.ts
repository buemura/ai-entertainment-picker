import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { rooms, roomMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { ActivityType, Filters } from "@/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { code } = await params;
  const { activityType, filters } = (await req.json()) as {
    activityType: ActivityType;
    filters: Filters;
  };

  const validTypes = ["movie", "tv_show", "anime", "music"];
  if (!validTypes.includes(activityType)) {
    return NextResponse.json(
      { error: "Tipo de atividade inválido." },
      { status: 400 }
    );
  }

  const room = await db.query.rooms.findFirst({
    where: eq(rooms.code, code.toUpperCase()),
  });

  if (!room || room.status !== "waiting" || new Date() > room.expiresAt) {
    return NextResponse.json({ error: "Sala inválida." }, { status: 404 });
  }

  const membership = await db.query.roomMembers.findFirst({
    where: and(
      eq(roomMembers.roomId, room.id),
      eq(roomMembers.userId, session.user.id)
    ),
  });

  if (!membership) {
    return NextResponse.json(
      { error: "Não é membro desta sala." },
      { status: 403 }
    );
  }

  await db
    .update(roomMembers)
    .set({ activityType, filters: JSON.stringify(filters) })
    .where(
      and(
        eq(roomMembers.roomId, room.id),
        eq(roomMembers.userId, session.user.id)
      )
    );

  return NextResponse.json({ ok: true });
}
