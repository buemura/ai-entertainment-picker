import { db } from "@/db";
import { recommendations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

const typeColors: Record<string, string> = {
  movie: "bg-brutal-yellow",
  tv_show: "bg-brutal-sky",
  anime: "bg-brutal-pink",
  music: "bg-brutal-green",
};

const typeEmojis: Record<string, string> = {
  movie: "🎬",
  tv_show: "📺",
  anime: "⛩️",
  music: "🎵",
};

const typeLabels: Record<string, string> = {
  movie: "Filme",
  tv_show: "Série",
  anime: "Anime",
  music: "Música",
};

async function getRecommendation(id: string) {
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

  return recommendation ?? null;
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const recommendation = await getRecommendation(id);

  if (!recommendation) {
    return { title: "Recomendação não encontrada" };
  }

  const typeLabel = typeLabels[recommendation.activityType] || "Recomendação";
  const title = `${typeLabel}: ${recommendation.title}`;
  const description = recommendation.description.slice(0, 200);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(recommendation.imageUrl && {
        images: [{ url: recommendation.imageUrl }],
      }),
    },
    twitter: {
      card: recommendation.imageUrl ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;
  const recommendation = await getRecommendation(id);

  if (!recommendation) {
    notFound();
  }

  const color = typeColors[recommendation.activityType] || "bg-brutal-purple";
  const emoji = typeEmojis[recommendation.activityType] || "🎲";
  const typeLabel =
    typeLabels[recommendation.activityType] || "Recomendação";

  return (
    <main className="min-h-screen bg-brutal-cream p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl text-black">
            Alguém compartilhou uma recomendação com você!
          </h2>
        </div>

        {/* Recommendation card */}
        <div className={`neo-card-static ${color} p-8`}>
          {/* Type badge */}
          <div className="mb-4 inline-block neo-card-static bg-white px-3 py-1 text-sm font-bold text-black">
            {emoji} {typeLabel}
          </div>

          {/* Poster + Info */}
          <div
            className={`flex gap-6 ${recommendation.imageUrl ? "flex-col sm:flex-row" : "flex-col"}`}
          >
            {recommendation.imageUrl && (
              <div className="neo-card-static shrink-0 overflow-hidden bg-white p-1 self-center sm:self-start">
                <Image
                  src={recommendation.imageUrl}
                  alt={recommendation.title}
                  width={200}
                  height={300}
                  className="h-auto w-50 rounded"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-display text-4xl leading-tight text-black sm:text-5xl">
                {recommendation.title}
              </h1>
              <p className="mt-4 text-lg font-medium leading-relaxed text-black/80">
                {recommendation.description}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap gap-2">
            {recommendation.genre && (
              <span className="neo-card-static bg-white px-3 py-1.5 text-sm font-bold text-black">
                🎭 {recommendation.genre}
              </span>
            )}
            {recommendation.releaseYear && (
              <span className="neo-card-static bg-white px-3 py-1.5 text-sm font-bold text-black">
                📅 {recommendation.releaseYear}
              </span>
            )}
            {recommendation.rating && (
              <span className="neo-card-static bg-white px-3 py-1.5 text-sm font-bold text-black">
                ⭐ {recommendation.rating.toFixed(1)}
              </span>
            )}
            {recommendation.seasons && (
              <span className="neo-card-static bg-white px-3 py-1.5 text-sm font-bold text-black">
                📦 {recommendation.seasons} temporada
                {recommendation.seasons > 1 ? "s" : ""}
              </span>
            )}
            {recommendation.episodes && (
              <span className="neo-card-static bg-white px-3 py-1.5 text-sm font-bold text-black">
                🔢 {recommendation.episodes} episódio
                {recommendation.episodes > 1 ? "s" : ""}
              </span>
            )}
            {recommendation.artist && (
              <span className="neo-card-static bg-white px-3 py-1.5 text-sm font-bold text-black">
                🎤 {recommendation.artist}
              </span>
            )}
            {recommendation.language && (
              <span className="neo-card-static bg-white px-3 py-1.5 text-sm font-bold text-black">
                🌍 {recommendation.language}
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="mb-4 font-medium text-black/60">
            Quer receber suas próprias recomendações?
          </p>
          <Link href="/" className="neo-btn inline-block bg-brutal-yellow text-lg text-black">
            Experimentar o RecommendAI
          </Link>
        </div>
      </div>
    </main>
  );
}
