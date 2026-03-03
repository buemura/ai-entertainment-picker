"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MOVIE_GENRES,
  MUSIC_GENRES,
  MUSIC_LANGUAGES,
  type ActivityType,
  ACTIVITY_LABELS,
} from "@/types";

const CURRENT_YEAR = new Date().getFullYear();

function FiltersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityType = searchParams.get("activityType") as ActivityType;

  const [genre, setGenre] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [ratingMin, setRatingMin] = useState("");
  const [ratingMax, setRatingMax] = useState("");
  const [seasonsMin, setSeasonsMin] = useState("");
  const [seasonsMax, setSeasonsMax] = useState("");
  const [episodesMin, setEpisodesMin] = useState("");
  const [episodesMax, setEpisodesMax] = useState("");
  const [language, setLanguage] = useState("");

  if (!activityType || !ACTIVITY_LABELS[activityType]) {
    router.push("/");
    return null;
  }

  const isVisual = ["movie", "tv_show", "anime"].includes(activityType);
  const isMusic = activityType === "music";
  const showSeasons = activityType === "tv_show";
  const showEpisodes = activityType === "tv_show" || activityType === "anime";

  const genreOptions = isMusic ? MUSIC_GENRES : MOVIE_GENRES;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const filters: Record<string, string> = {};
    if (genre) filters.genre = genre;
    if (yearMin) filters.yearMin = yearMin;
    if (yearMax) filters.yearMax = yearMax;
    if (isVisual) {
      if (ratingMin) filters.ratingMin = ratingMin;
      if (ratingMax) filters.ratingMax = ratingMax;
      if (showSeasons && seasonsMin) filters.seasonsMin = seasonsMin;
      if (showSeasons && seasonsMax) filters.seasonsMax = seasonsMax;
      if (showEpisodes && episodesMin) filters.episodesMin = episodesMin;
      if (showEpisodes && episodesMax) filters.episodesMax = episodesMax;
    }
    if (isMusic && language) filters.language = language;

    const params = new URLSearchParams({
      activityType,
      ...filters,
    });

    router.push(`/resultado?${params.toString()}`);
  }

  function handleSkip() {
    router.push(`/resultado?activityType=${activityType}`);
  }

  const typeEmoji = {
    movie: "🎬",
    tv_show: "📺",
    anime: "⛩️",
    music: "🎵",
    random: "🎲",
  }[activityType];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="neo-btn mb-4 bg-white text-sm text-black"
        >
          ← Voltar
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{typeEmoji}</span>
          <div>
            <h1 className="font-display text-3xl text-black">
              {ACTIVITY_LABELS[activityType]}
            </h1>
            <p className="text-sm font-medium text-black/60">
              Configure seus filtros ou pule direto pra recomendação
            </p>
          </div>
        </div>
      </div>

      {/* Filter form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Genre */}
          <div className="neo-card-static animate-pop-in bg-white p-5">
            <label className="mb-2 block font-bold text-black">
              🎭 Gênero
            </label>
            <select
              className="neo-select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Qualquer gênero</option>
              {genreOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Year range */}
          <div
            className="neo-card-static animate-pop-in bg-white p-5"
            style={{ animationDelay: "80ms" }}
          >
            <label className="mb-2 block font-bold text-black">
              📅 Ano de Lançamento
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                className="neo-input"
                placeholder="De"
                min={1950}
                max={CURRENT_YEAR}
                value={yearMin}
                onChange={(e) => setYearMin(e.target.value)}
              />
              <span className="font-bold text-black/40">até</span>
              <input
                type="number"
                className="neo-input"
                placeholder="Até"
                min={1950}
                max={CURRENT_YEAR}
                value={yearMax}
                onChange={(e) => setYearMax(e.target.value)}
              />
            </div>
          </div>

          {/* Rating - visual only */}
          {isVisual && (
            <div
              className="neo-card-static animate-pop-in bg-white p-5"
              style={{ animationDelay: "160ms" }}
            >
              <label className="mb-2 block font-bold text-black">
                ⭐ Nota (0 a 10)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="neo-input"
                  placeholder="Mínima"
                  min={0}
                  max={10}
                  step={0.1}
                  value={ratingMin}
                  onChange={(e) => setRatingMin(e.target.value)}
                />
                <span className="font-bold text-black/40">até</span>
                <input
                  type="number"
                  className="neo-input"
                  placeholder="Máxima"
                  min={0}
                  max={10}
                  step={0.1}
                  value={ratingMax}
                  onChange={(e) => setRatingMax(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Seasons - tv_show only */}
          {showSeasons && (
            <div
              className="neo-card-static animate-pop-in bg-white p-5"
              style={{ animationDelay: "240ms" }}
            >
              <label className="mb-2 block font-bold text-black">
                📦 Temporadas
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="neo-input"
                  placeholder="De"
                  min={1}
                  value={seasonsMin}
                  onChange={(e) => setSeasonsMin(e.target.value)}
                />
                <span className="font-bold text-black/40">até</span>
                <input
                  type="number"
                  className="neo-input"
                  placeholder="Até"
                  min={1}
                  value={seasonsMax}
                  onChange={(e) => setSeasonsMax(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Episodes - tv_show and anime */}
          {showEpisodes && (
            <div
              className="neo-card-static animate-pop-in bg-white p-5"
              style={{ animationDelay: "320ms" }}
            >
              <label className="mb-2 block font-bold text-black">
                🔢 Episódios
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="neo-input"
                  placeholder="De"
                  min={1}
                  value={episodesMin}
                  onChange={(e) => setEpisodesMin(e.target.value)}
                />
                <span className="font-bold text-black/40">até</span>
                <input
                  type="number"
                  className="neo-input"
                  placeholder="Até"
                  min={1}
                  value={episodesMax}
                  onChange={(e) => setEpisodesMax(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Language - music only */}
          {isMusic && (
            <div
              className="neo-card-static animate-pop-in bg-white p-5"
              style={{ animationDelay: "160ms" }}
            >
              <label className="mb-2 block font-bold text-black">
                🌍 Idioma
              </label>
              <select
                className="neo-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="">Qualquer idioma</option>
                {MUSIC_LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="neo-btn flex-1 bg-brutal-yellow text-lg text-black"
          >
            🚀 Gerar Recomendação
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="neo-btn bg-white text-lg text-black"
          >
            ⚡ Pular Filtros
          </button>
        </div>
      </form>
    </div>
  );
}

export default function FiltrosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="animate-spin-slow text-5xl">🎲</div>
        </div>
      }
    >
      <FiltersContent />
    </Suspense>
  );
}
