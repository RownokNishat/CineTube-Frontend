import MediaCard from "@/components/modules/Media/MediaCard";
import MediaFilters from "@/components/modules/Media/MediaFilters";
import QueryPagination from "@/components/shared/QueryPagination";
import { getGenres } from "@/services/genre.services";
import { getMediaList } from "@/services/media.services";
import { Genre } from "@/types/media.types";
import { Film } from "lucide-react";

interface MediaPageProps {
    searchParams: Promise<{
        page?: string;
        searchTerm?: string;
        mediaType?: string;
        pricingType?: string;
        genre?: string;
        streamingPlatform?: string;
        releaseYear?: string;
        minRating?: string;
        popularity?: string;
        featured?: string;
        editorPick?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}

export default async function MediaPage({ searchParams }: MediaPageProps) {
    const params = await searchParams;
    const page = Number(params.page ?? 1);
    const limit = 20;
    const parsedReleaseYear = params.releaseYear ? Number(params.releaseYear) : undefined;
    const parsedMinRating = params.minRating ? Number(params.minRating) : undefined;

    const [mediaRes, genreRes] = await Promise.all([
        getMediaList({
            page,
            limit,
            searchTerm: params.searchTerm,
            mediaType: params.mediaType as "MOVIE" | "SERIES" | undefined,
            pricingType: params.pricingType as "FREE" | "PREMIUM" | undefined,
            genre: params.genre,
            streamingPlatform: params.streamingPlatform,
            releaseYear: Number.isFinite(parsedReleaseYear) ? parsedReleaseYear : undefined,
            minRating: Number.isFinite(parsedMinRating) ? parsedMinRating : undefined,
            popularity: params.popularity,
            featured: params.featured === "true" ? true : undefined,
            editorPick: params.editorPick === "true" ? true : undefined,
            sortBy: params.sortBy,
            sortOrder: (params.sortOrder ?? "desc") as "asc" | "desc",
        }).catch(() => ({ data: [], meta: undefined, success: true, message: "" })),
        getGenres().catch(() => ({ data: [] as Genre[], success: true, message: "" })),
    ]);

    const mediaList = mediaRes.data ?? [];
    const genres = genreRes.data ?? [];
    const meta = mediaRes.meta;
    const totalPages = meta ? Math.ceil(meta.total / limit) : 1;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Film className="size-7" /> Movies & Series
                </h1>
                <p className="text-muted-foreground">Discover, rate, and review your favourite titles</p>
            </div>

            <div className="mb-6">
                <MediaFilters genres={genres} />
            </div>

            {mediaList.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {mediaList.map((media) => (
                            <MediaCard key={media.id} media={media} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <QueryPagination currentPage={page} totalPages={totalPages} totalItems={meta?.total} className="max-w-2xl mx-auto" />
                    )}
                </>
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    <Film className="size-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No titles found</p>
                    <p className="text-sm">Try adjusting your filters or search term</p>
                </div>
            )}
        </div>
    );
}
