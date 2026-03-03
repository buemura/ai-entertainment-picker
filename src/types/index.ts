export type ActivityType =
  | "movie"
  | "tv_show"
  | "anime"
  | "music"
  | "random";

export interface MovieTvFilters {
  genre?: string;
  yearMin?: number;
  yearMax?: number;
  ratingMin?: number;
  ratingMax?: number;
  seasonsMin?: number;
  seasonsMax?: number;
  episodesMin?: number;
  episodesMax?: number;
}

export interface MusicFilters {
  genre?: string;
  yearMin?: number;
  yearMax?: number;
  language?: string;
}

export type Filters = MovieTvFilters | MusicFilters;

export interface RecommendationRequest {
  activityType: ActivityType;
  filters: Filters;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  activityType: ActivityType;
  genre?: string;
  releaseYear?: number;
  rating?: number;
  seasons?: number;
  episodes?: number;
  artist?: string;
  language?: string;
  imageUrl?: string;
  createdAt: Date;
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  movie: "Assistir um Filme",
  tv_show: "Assistir uma Série",
  anime: "Assistir um Anime",
  music: "Ouvir uma Música",
  random: "Surpreenda-me!",
};

export const MOVIE_GENRES = [
  "Ação",
  "Aventura",
  "Animação",
  "Comédia",
  "Crime",
  "Documentário",
  "Drama",
  "Fantasia",
  "Ficção Científica",
  "Guerra",
  "Musical",
  "Mistério",
  "Romance",
  "Suspense",
  "Terror",
];

export const MUSIC_GENRES = [
  "Pop",
  "Rock",
  "Hip Hop",
  "R&B",
  "Sertanejo",
  "Funk",
  "MPB",
  "Pagode",
  "Forró",
  "Eletrônica",
  "Jazz",
  "Blues",
  "Clássica",
  "Reggae",
  "Metal",
  "Indie",
  "K-Pop",
  "Lo-fi",
];

export const MUSIC_LANGUAGES = [
  "Português",
  "Inglês",
  "Espanhol",
  "Japonês",
  "Coreano",
  "Francês",
  "Qualquer idioma",
];
