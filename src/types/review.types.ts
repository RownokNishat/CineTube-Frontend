export interface Review {
    id: string;
    userId: string;
    mediaId: string;
    rating: number;
    content: string;
    isSpoiler: boolean;
    tags: string[];
    status: "PENDING" | "PUBLISHED" | "UNPUBLISHED";
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        image: string | null;
    };
    media?: {
        id: string;
        title: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
    likedByMe?: boolean;
    isLiked?: boolean;
}

export interface ReviewStats {
    mediaId: string;
    title: string;
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
    pendingReviewsCount: number;
    pendingReviews: Array<{
        id: string;
        createdAt: string;
        user?: {
            id: string;
            name: string;
            image?: string | null;
        };
    }>;
}

export interface Comment {
    id: string;
    reviewId: string;
    userId: string;
    content: string;
    parentId: string | null;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image: string | null;
    };
    _count: {
        likes: number;
        replies: number;
    };
    replies?: Comment[];
    likedByMe?: boolean;
    isLiked?: boolean;
}

export interface CreateReviewPayload {
    mediaId: string;
    rating: number;
    content: string;
    isSpoiler: boolean;
    tags: string[];
}
