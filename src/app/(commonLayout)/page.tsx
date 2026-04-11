import MediaCard from "@/components/modules/Media/MediaCard";
import PricingSection from "@/components/modules/Home/PricingSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGenres } from "@/services/genre.services";
import { getMediaList } from "@/services/media.services";
import { Media } from "@/types/media.types";
import { ArrowRight, Clapperboard, Compass, Film, Search, Sparkles, Star, Tv } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import FAQSection from "@/components/modules/Home/FAQSection";
import NewsletterSection from "@/components/modules/Home/NewsletterSection";
import TestimonialSection from "@/components/modules/Home/TestimonialSection";

async function fetchMedia(params: object): Promise<Media[]> {
    try {
        const res = await getMediaList(params);
        return res.data ?? [];
    } catch {
        return [];
    }
}

function HomeSection({
    title,
    href,
    icon,
    items,
}: {
    title: string;
    href: string;
    icon: ReactNode;
    items: Media[];
}) {
    if (items.length === 0) return null;

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                    {icon}
                    {title}
                </h2>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={href}>View all <ArrowRight className="ml-1 size-4" /></Link>
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
                {items.map((media) => (
                    <MediaCard key={media.id} media={media} />
                ))}
            </div>
        </section>
    );
}

export default async function Home() {
    const [topRated, newlyAdded, movies, series, featuredCandidates, editorPickCandidates, genresRes] = await Promise.all([
        fetchMedia({ sortBy: "averageRating", sortOrder: "desc", limit: 8 }),
        fetchMedia({ sortBy: "createdAt", sortOrder: "desc", limit: 8 }),
        fetchMedia({ mediaType: "MOVIE", limit: 4 }),
        fetchMedia({ mediaType: "SERIES", limit: 4 }),
        fetchMedia({ featured: true, sortBy: "averageRating", sortOrder: "desc", limit: 5 }),
        fetchMedia({ editorPick: true, sortBy: "averageRating", sortOrder: "desc", limit: 8 }),
        getGenres().catch(() => ({ data: [] })),
    ]);

    const genres = genresRes.data ?? [];
    const featured = featuredCandidates.length > 0 ? featuredCandidates[0] : topRated[0] ?? newlyAdded[0] ?? null;
    const editorPicks = editorPickCandidates.length > 0
        ? editorPickCandidates
        : [...topRated.filter((item) => item.pricingType === "PREMIUM"), ...newlyAdded].slice(0, 8);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 sm:py-16 md:py-24 px-3 sm:px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
                        Discover & Rate <br />
                        <span className="text-primary">Movies & Series</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                        Explore thousands of movies and TV series, share your reviews, and discover what to watch next.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/media">Browse All <ArrowRight className="ml-2 size-4" /></Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white/90 bg-white text-gray-900 hover:bg-gray-100 hover:text-black" asChild>
                            <Link href="/register">Join Free</Link>
                        </Button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 mt-8 sm:mt-10 md:mt-12 text-gray-300 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                            <Film className="size-4 sm:size-5 text-primary" />
                            <span>Movies</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tv className="size-4 sm:size-5 text-primary" />
                            <span>Series</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="size-4 sm:size-5 text-yellow-400" />
                            <span>Rate & Review</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="-mt-8 sm:-mt-10 px-2 sm:px-4 relative z-10">
                <div className="mx-auto max-w-6xl rounded-xl sm:rounded-2xl md:rounded-3xl border bg-background/95 p-3 sm:p-4 md:p-6 shadow-xl md:shadow-2xl backdrop-blur">
                    <div className="mb-3 sm:mb-4 flex items-center gap-2">
                        <Compass className="size-4 sm:size-5 text-primary" />
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold">Find your next watch</h2>
                    </div>
                    <form action="/media" className="grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-5">
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs sm:text-sm font-medium">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-3 sm:size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    name="searchTerm"
                                    placeholder="Search title, cast, director"
                                    className="h-9 sm:h-10 w-full rounded-md border bg-background pl-8 pr-3 text-xs sm:text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs sm:text-sm font-medium">Genre</label>
                            <select name="genre" className="h-9 sm:h-10 w-full rounded-md border bg-background px-2 sm:px-3 text-xs sm:text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <option value="">All genres</option>
                                {genres.map((genre) => (
                                    <option key={genre.id} value={genre.name}>{genre.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs sm:text-sm font-medium">Platform</label>
                            <input
                                name="streamingPlatform"
                                placeholder="Netflix, Disney+"
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs sm:text-sm font-medium">Release year</label>
                            <input
                                name="releaseYear"
                                type="number"
                                min={1900}
                                max={2100}
                                placeholder="2026"
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                        <div className="sm:col-span-2 md:col-span-5 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                            <Button type="submit">Search Library</Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/media?sortBy=averageRating&sortOrder=desc">Explore Top Rated</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            {featured && (
                <section className="px-4 py-12">
                    <div className="mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-3xl border bg-muted/30 p-6 md:grid-cols-[1.3fr_0.9fr] md:p-8">
                        <div className="space-y-4">
                            <Badge className="gap-2 rounded-full px-3 py-1 text-xs">
                                <Sparkles className="size-3.5" /> Featured Spotlight
                            </Badge>
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold md:text-4xl">{featured.title}</h2>
                                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{featured.synopsis}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm">
                                <Badge variant="outline">{featured.mediaType}</Badge>
                                <Badge variant="outline">{featured.releaseYear}</Badge>
                                <Badge variant="outline">{featured.streamingPlatform}</Badge>
                                <Badge variant={featured.pricingType === "PREMIUM" ? "default" : "secondary"}>{featured.pricingType}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild>
                                    <Link href={`/media/${featured.id}`}>View details</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/media?sortBy=createdAt&sortOrder=desc">Browse newly added</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-background/80 p-4">
                            {editorPicks.slice(0, 4).map((item) => (
                                <MediaCard key={item.id} media={item} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <HomeSection
                title="Top Rated This Week"
                href="/media?sortBy=averageRating&sortOrder=desc"
                icon={<Star className="size-5 fill-yellow-400 text-yellow-400" />}
                items={topRated}
            />

            <HomeSection
                title="Newly Added"
                href="/media?sortBy=createdAt&sortOrder=desc"
                icon={<Clapperboard className="size-5 text-primary" />}
                items={newlyAdded}
            />

            <HomeSection
                title="Editor's Picks"
                href="/media?editorPick=true"
                icon={<Sparkles className="size-5 text-primary" />}
                items={editorPicks}
            />

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

            <TestimonialSection />
            <PricingSection />
            <FAQSection />
            <NewsletterSection />
        </div>
    );
}
