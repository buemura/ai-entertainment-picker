import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { rooms, roomMembers } from "@/db/schema";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

  const [room] = await db
    .insert(rooms)
    .values({ code, creatorId: session.user.id, expiresAt })
    .returning();

  await db.insert(roomMembers).values({
    roomId: room.id,
    userId: session.user.id,
  });

  return NextResponse.json({ roomId: room.id, code: room.code });
}
