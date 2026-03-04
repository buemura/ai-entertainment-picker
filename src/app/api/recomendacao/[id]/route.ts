import { db } from "@/db";
import { recommendations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [recommendation] = await db
    .select({
      id: recommendations.id,
      activityType: recommendations.activityType,
      title: recommendations.title,
      description: recommendations.description,
      genre: recommendations.genre,
      releaseYear: recommendations.releaseYear,
      rating: recommendations.rating,
      seasons: recommendations.seasons,
      episodes: recommendations.episodes,
      artist: recommendations.artist,
      language: recommendations.language,
      imageUrl: recommendations.imageUrl,
    })
    .from(recommendations)
    .where(eq(recommendations.id, id))
    .limit(1);

  if (!recommendation) {
    return NextResponse.json(
      { error: "Recomendação não encontrada." },
      { status: 404 }
    );
  }

  return NextResponse.json({ recommendation });
}
