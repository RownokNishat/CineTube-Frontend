import MediaCard from "@/components/modules/Media/MediaCard";
import MediaFilters from "@/components/modules/Media/MediaFilters";
import { Button } from "@/components/ui/button";
import { getGenres } from "@/services/genre.services";
import { getMediaList } from "@/services/media.services";
import { Genre } from "@/types/media.types";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";
import Link from "next/link";

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

    const buildPageUrl = (p: number) => {
        const sp = new URLSearchParams();
        if (params.searchTerm) sp.set("searchTerm", params.searchTerm);
        if (params.mediaType) sp.set("mediaType", params.mediaType);
        if (params.pricingType) sp.set("pricingType", params.pricingType);
        if (params.genre) sp.set("genre", params.genre);
        if (params.streamingPlatform) sp.set("streamingPlatform", params.streamingPlatform);
        if (params.releaseYear) sp.set("releaseYear", params.releaseYear);
        if (params.minRating) sp.set("minRating", params.minRating);
        if (params.popularity) sp.set("popularity", params.popularity);
        if (params.featured) sp.set("featured", params.featured);
        if (params.editorPick) sp.set("editorPick", params.editorPick);
        if (params.sortBy) sp.set("sortBy", params.sortBy);
        if (params.sortOrder) sp.set("sortOrder", params.sortOrder);
        sp.set("page", String(p));
        return `/media?${sp.toString()}`;
    };

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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                        {mediaList.map((media) => (
                            <MediaCard key={media.id} media={media} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
                                {page > 1 ? (
                                    <Link href={buildPageUrl(page - 1)}><ChevronLeft className="size-4" /> Prev</Link>
                                ) : (
                                    <span><ChevronLeft className="size-4" /> Prev</span>
                                )}
                            </Button>
                            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                            <Button variant="outline" size="sm" disabled={page >= totalPages} asChild={page < totalPages}>
                                {page < totalPages ? (
                                    <Link href={buildPageUrl(page + 1)}>Next <ChevronRight className="size-4" /></Link>
                                ) : (
                                    <span>Next <ChevronRight className="size-4" /></span>
                                )}
                            </Button>
                        </div>
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
