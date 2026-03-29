import MediaCard from "@/components/modules/Media/MediaCard";
import PricingSection from "@/components/modules/Home/PricingSection";
import { Button } from "@/components/ui/button";
import { getMediaList } from "@/services/media.services";
import { Media } from "@/types/media.types";
import { ArrowRight, Film, Star, Tv } from "lucide-react";
import Link from "next/link";

async function fetchMedia(params: object): Promise<Media[]> {
    try {
        const res = await getMediaList(params);
        return res.data ?? [];
    } catch {
        return [];
    }
}

export default async function Home() {
    const [topRated, newlyAdded, movies, series] = await Promise.all([
        fetchMedia({ sortBy: "averageRating", sortOrder: "desc", limit: 8 }),
        fetchMedia({ sortBy: "createdAt", sortOrder: "desc", limit: 8 }),
        fetchMedia({ mediaType: "MOVIE", limit: 4 }),
        fetchMedia({ mediaType: "SERIES", limit: 4 }),
    ]);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        Discover & Rate <br />
                        <span className="text-primary">Movies & Series</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Explore thousands of movies and TV series, share your reviews, and discover what to watch next.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/media">Browse All <ArrowRight className="ml-2 size-4" /></Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black" asChild>
                            <Link href="/register">Join Free</Link>
                        </Button>
                    </div>
                    <div className="flex justify-center gap-8 mt-12 text-gray-300">
                        <div className="flex items-center gap-2">
                            <Film className="size-5 text-primary" />
                            <span className="text-sm">Movies</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tv className="size-5 text-primary" />
                            <span className="text-sm">Series</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="size-5 text-yellow-400" />
                            <span className="text-sm">Rate & Review</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Top Rated */}
            {topRated.length > 0 && (
                <section className="py-12 px-4 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Star className="size-5 fill-yellow-400 text-yellow-400" />
                            Top Rated This Week
                        </h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/media?sortBy=averageRating&sortOrder=desc">View all <ArrowRight className="ml-1 size-4" /></Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {topRated.map((media) => (
                            <MediaCard key={media.id} media={media} />
                        ))}
                    </div>
                </section>
            )}

            {/* Newly Added */}
            {newlyAdded.length > 0 && (
                <section className="py-12 px-4 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Newly Added</h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/media?sortBy=createdAt&sortOrder=desc">View all <ArrowRight className="ml-1 size-4" /></Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {newlyAdded.map((media) => (
                            <MediaCard key={media.id} media={media} />
                        ))}
                    </div>
                </section>
            )}

            {/* Movies & Series split */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {movies.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Film className="size-5" /> Movies
                                </h2>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/media?mediaType=MOVIE">View all</Link>
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {movies.map((media) => <MediaCard key={media.id} media={media} />)}
                            </div>
                        </div>
                    )}
                    {series.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Tv className="size-5" /> Series
                                </h2>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/media?mediaType=SERIES">View all</Link>
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {series.map((media) => <MediaCard key={media.id} media={media} />)}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Pricing */}
            <PricingSection />
        </div>
    );
}
