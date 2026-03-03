"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface RecommendationData {
  id: string;
  activityType: string;
  title: string;
  description: string;
  genre?: string;
  releaseYear?: number;
  rating?: number;
  seasons?: number;
  episodes?: number;
  artist?: string;
  language?: string;
  imageUrl?: string | null;
  createdAt: string;
}

const typeConfig: Record<
  string,
  { emoji: string; color: string; label: string }
> = {
  movie: { emoji: "🎬", color: "bg-brutal-yellow", label: "Filme" },
  tv_show: { emoji: "📺", color: "bg-brutal-sky", label: "Série" },
  anime: { emoji: "⛩️", color: "bg-brutal-pink", label: "Anime" },
  music: { emoji: "🎵", color: "bg-brutal-green", label: "Música" },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function groupByDate(
  items: RecommendationData[]
): Record<string, RecommendationData[]> {
  const groups: Record<string, RecommendationData[]> = {};
  for (const item of items) {
    const key = formatDate(item.createdAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

export default function HistoricoPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<
    RecommendationData[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/recomendacao");
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin-slow mb-4 inline-block text-6xl">
            📜
          </div>
          <p className="text-lg font-bold text-black/60">
            Carregando histórico...
          </p>
        </div>
      </div>
    );
  }

  const grouped = groupByDate(recommendations);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-black sm:text-4xl">
            📜 Seu Histórico
          </h1>
          <p className="mt-1 font-medium text-black/60">
            {recommendations.length} recomendaç
            {recommendations.length !== 1 ? "ões" : "ão"} no total
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="neo-btn bg-brutal-yellow text-black"
        >
          + Nova
        </button>
      </div>

      {/* Empty state */}
      {recommendations.length === 0 && (
        <div className="neo-card-static bg-white p-12 text-center">
          <div className="mb-4 text-6xl">🫥</div>
          <h2 className="font-display text-2xl text-black">
            Nada por aqui ainda
          </h2>
          <p className="mt-2 font-medium text-black/60">
            Suas recomendações aparecerão aqui depois que você pedir a primeira.
          </p>
          <button
            onClick={() => router.push("/")}
            className="neo-btn mt-6 bg-brutal-yellow text-black"
          >
            🎲 Pedir Recomendação
          </button>
        </div>
      )}

      {/* Grouped list */}
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-0.5 w-4 bg-black/30" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-black/50">
              {date}
            </h3>
            <div className="h-0.5 flex-1 bg-black/30" />
          </div>

          <div className="space-y-4">
            {items.map((rec, i) => {
              const config = typeConfig[rec.activityType] || {
                emoji: "🎲",
                color: "bg-brutal-purple",
                label: "Outro",
              };
              return (
                <div
                  key={rec.id}
                  className={`neo-card-static animate-pop-in ${config.color} p-5`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {rec.imageUrl ? (
                      <div className="neo-card-static shrink-0 overflow-hidden bg-white p-0.5">
                        <Image
                          src={rec.imageUrl}
                          alt={rec.title}
                          width={64}
                          height={96}
                          className="h-24 w-16 rounded object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-3xl">{config.emoji}</div>
                    )}
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="neo-card-static bg-white px-2 py-0.5 text-xs font-bold text-black">
                          {config.label}
                        </span>
                        {rec.genre && (
                          <span className="text-xs font-bold text-black/50">
                            {rec.genre}
                          </span>
                        )}
                      </div>
                      <h4 className="font-display text-xl text-black">
                        {rec.title}
                      </h4>
                      <p className="mt-1 text-sm font-medium text-black/70">
                        {rec.description}
                      </p>

                      {/* Metadata chips */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {rec.releaseYear && (
                          <span className="rounded-md bg-white/60 px-2 py-0.5 text-xs font-bold text-black/70">
                            📅 {rec.releaseYear}
                          </span>
                        )}
                        {rec.rating && (
                          <span className="rounded-md bg-white/60 px-2 py-0.5 text-xs font-bold text-black/70">
                            ⭐ {rec.rating.toFixed(1)}
                          </span>
                        )}
                        {rec.artist && (
                          <span className="rounded-md bg-white/60 px-2 py-0.5 text-xs font-bold text-black/70">
                            🎤 {rec.artist}
                          </span>
                        )}
                        {rec.language && (
                          <span className="rounded-md bg-white/60 px-2 py-0.5 text-xs font-bold text-black/70">
                            🌍 {rec.language}
                          </span>
                        )}
                        {rec.seasons && (
                          <span className="rounded-md bg-white/60 px-2 py-0.5 text-xs font-bold text-black/70">
                            📦 {rec.seasons}T
                          </span>
                        )}
                        {rec.episodes && (
                          <span className="rounded-md bg-white/60 px-2 py-0.5 text-xs font-bold text-black/70">
                            🔢 {rec.episodes}ep
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
