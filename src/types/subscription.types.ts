export interface SubscriptionPlan {
    plan: "FREE" | "MONTHLY" | "YEARLY";
    price: number;
    duration: string;
    features: string[];
}

export interface Subscription {
    id: string;
    userId: string;
    plan: "FREE" | "MONTHLY" | "YEARLY";
    status: "ACTIVE" | "EXPIRED" | "CANCELLED";
    startDate: string;
    endDate: string;
    amount: number;
    stripeCustomerId: string | null;
    stripePaymentId: string | null;
}

export interface WatchlistItem {
    id: string;
    userId: string;
    mediaId: string;
    createdAt: string;
    media: {
        id: string;
        title: string;
        posterUrl: string;
        mediaType: "MOVIE" | "SERIES";
        pricingType: "FREE" | "PREMIUM";
        releaseYear: number;
        genres: Array<{ id: string; name: string }>;
    };
}
