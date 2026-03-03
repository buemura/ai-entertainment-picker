const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const headers = {
  Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

interface TmdbSearchResult {
  poster_path: string | null;
}

interface TmdbSearchResponse {
  results: TmdbSearchResult[];
}

export async function fetchImageUrl(
  title: string,
  activityType: string
): Promise<string | null> {
  if (activityType === "music") return null;

  try {
    const endpoint =
      activityType === "movie" ? "/search/movie" : "/search/tv";
    const url = `${TMDB_BASE_URL}${endpoint}?query=${encodeURIComponent(title)}&language=pt-BR`;

    const res = await fetch(url, { headers });
    if (!res.ok) return null;

    const data: TmdbSearchResponse = await res.json();
    const posterPath = data.results?.[0]?.poster_path;

    return posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null;
  } catch {
    return null;
  }
}
