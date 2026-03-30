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

// Premium Media Purchase Types
export interface MediaPurchase {
    id: string;
    userId: string;
    mediaId: string;
    media: Media;
    purchaseDate: string;
    expiryDate: string | null; // null for permanent access
    amount: number;
    stripePaymentIntentId: string;
    status: "COMPLETED" | "PENDING" | "FAILED";
}

export interface MediaCheckoutSession {
    checkoutUrl: string;
    sessionId: string;
}

export interface MediaAccessInfo {
    hasAccess: boolean;
    purchase?: MediaPurchase;
}
