"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Genre } from "@/types/media.types";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface MediaFiltersProps {
    genres: Genre[];
}

const MediaFilters = ({ genres }: MediaFiltersProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("searchTerm") ?? "");

    const updateParam = useCallback((key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    }, [pathname, router, searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParam("searchTerm", search || null);
    };

    const clearAll = () => {
        setSearch("");
        router.push(pathname);
    };

    const hasFilters = searchParams.toString().length > 0;

    return (
        <div className="flex flex-wrap gap-3 items-center">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search title, director, cast..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button type="submit" size="sm">Search</Button>
            </form>

            <Select value={searchParams.get("mediaType") ?? "all"} onValueChange={(v) => updateParam("mediaType", v)}>
                <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="MOVIE">Movies</SelectItem>
                    <SelectItem value="SERIES">Series</SelectItem>
                </SelectContent>
            </Select>

            <Select value={searchParams.get("pricingType") ?? "all"} onValueChange={(v) => updateParam("pricingType", v)}>
                <SelectTrigger className="w-32">
                    <SelectValue placeholder="Pricing" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="FREE">Free</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
            </Select>

            <Select value={searchParams.get("genre") ?? "all"} onValueChange={(v) => updateParam("genre", v)}>
                <SelectTrigger className="w-36">
                    <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((g) => (
                        <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={searchParams.get("sortBy") ?? "createdAt"} onValueChange={(v) => updateParam("sortBy", v)}>
                <SelectTrigger className="w-36">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdAt">Latest</SelectItem>
                    <SelectItem value="averageRating">Top Rated</SelectItem>
                    <SelectItem value="releaseYear">Release Year</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
            </Select>

            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
                    <X className="size-4 mr-1" /> Clear
                </Button>
            )}
        </div>
    );
};

export default MediaFilters;
