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
    _count: {
        likes: number;
        comments: number;
    };
    isLiked?: boolean;
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
    isLiked?: boolean;
}

export interface CreateReviewPayload {
    mediaId: string;
    rating: number;
    content: string;
    isSpoiler: boolean;
    tags: string[];
}
