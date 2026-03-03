import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { rooms, roomMembers, recommendations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getGroupRecommendation } from "@/lib/ai";
import { fetchImageUrl } from "@/lib/tmdb";
import { getTodayCount, DAILY_LIMIT } from "@/lib/rate-limit";
import type { ActivityType, Filters } from "@/types";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { code } = await params;

  const room = await db.query.rooms.findFirst({
    where: eq(rooms.code, code.toUpperCase()),
  });

  if (!room) {
    return NextResponse.json(
      { error: "Sala não encontrada." },
      { status: 404 }
    );
  }
  if (room.creatorId !== session.user.id) {
    return NextResponse.json(
      { error: "Apenas o criador pode iniciar." },
      { status: 403 }
    );
  }

  // Atomically claim the room to prevent race conditions (double-click, multiple tabs)
  const [claimed] = await db
    .update(rooms)
    .set({ status: "done" })
    .where(and(eq(rooms.id, room.id), eq(rooms.status, "waiting")))
    .returning({ id: rooms.id });

  if (!claimed) {
    return NextResponse.json(
      { error: "Sala já processada." },
      { status: 409 }
    );
  }

  const members = await db.query.roomMembers.findMany({
    where: eq(roomMembers.roomId, room.id),
  });

  if (members.some((m) => !m.activityType)) {
    await db
      .update(rooms)
      .set({ status: "waiting" })
      .where(eq(rooms.id, room.id));
    return NextResponse.json(
      { error: "Nem todos os membros enviaram suas preferências." },
      { status: 422 }
    );
  }

  for (const member of members) {
    const count = await getTodayCount(member.userId);
    if (count >= DAILY_LIMIT) {
      await db
        .update(rooms)
        .set({ status: "waiting" })
        .where(eq(rooms.id, room.id));
      return NextResponse.json(
        {
          error:
            "Um ou mais membros atingiram o limite diário de recomendações.",
        },
        { status: 429 }
      );
    }
  }

  const memberPreferences = members.map((m) => ({
    activityType: m.activityType as ActivityType,
    filters: JSON.parse(m.filters || "{}") as Filters,
  }));

  let recommendation;
  let imageUrl: string | null = null;
  try {
    recommendation = await getGroupRecommendation(memberPreferences);
    imageUrl = await fetchImageUrl(
      recommendation.title,
      recommendation.activityType
    );
  } catch (error: unknown) {
    // Revert room status on AI failure so creator can retry
    await db
      .update(rooms)
      .set({ status: "waiting" })
      .where(eq(rooms.id, room.id));
    const message = error instanceof Error ? error.message : "";
    if (message.includes("429")) {
      return NextResponse.json(
        { error: "IA temporariamente indisponível. Tente em instantes." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao gerar recomendação." },
      { status: 500 }
    );
  }

  const insertedIds: string[] = [];
  for (const member of members) {
    const [saved] = await db
      .insert(recommendations)
      .values({
        userId: member.userId,
        activityType: recommendation.activityType,
        title: recommendation.title,
        description: recommendation.description,
        genre: recommendation.genre,
        releaseYear: recommendation.releaseYear,
        rating: recommendation.rating,
        seasons: recommendation.seasons,
        episodes: recommendation.episodes,
        artist: recommendation.artist,
        language: recommendation.language,
        imageUrl,
      })
      .returning();
    insertedIds.push(saved.id);
  }

  const creatorIndex = members.findIndex(
    (m) => m.userId === room.creatorId
  );
  const creatorRecId = insertedIds[creatorIndex] || insertedIds[0];

  await db
    .update(rooms)
    .set({ recommendationId: creatorRecId })
    .where(eq(rooms.id, room.id));

  return NextResponse.json({ ok: true });
}
