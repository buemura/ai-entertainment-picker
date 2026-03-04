import { db } from "@/db";
import { recommendations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, not } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;

  const [updated] = await db
    .update(recommendations)
    .set({ watched: not(recommendations.watched) })
    .where(
      and(
        eq(recommendations.id, id),
        eq(recommendations.userId, session.user.id)
      )
    )
    .returning({ id: recommendations.id, watched: recommendations.watched });

  if (!updated) {
    return NextResponse.json(
      { error: "Recomendação não encontrada." },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}
