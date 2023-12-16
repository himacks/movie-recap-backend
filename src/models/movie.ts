// object type for movie

export interface Movie {
    id: number;
    original_language?: string;
    overview?: string;
    poster_path?: string;
    release_date?: Date;
    revenue?: number;
    tagline?: string;
    title?: string;
}
