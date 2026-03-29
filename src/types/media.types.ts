export interface Genre {
    id: string;
    name: string;
}

export interface Media {
    id: string;
    title: string;
    synopsis: string;
    releaseYear: number;
    director: string;
    cast: string[];
    streamingPlatform: string;
    streamingLink: string;
    posterUrl: string;
    trailerUrl: string | null;
    mediaType: "MOVIE" | "SERIES";
    status: "DRAFT" | "PUBLISHED";
    pricingType: "FREE" | "PREMIUM";
    createdAt: string;
    updatedAt: string;
    genres: Genre[];
    _count?: {
        reviews: number;
    };
    averageRating?: number;
}

export interface MediaQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    mediaType?: "MOVIE" | "SERIES";
    pricingType?: "FREE" | "PREMIUM";
    genre?: string;
    releaseYear?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
