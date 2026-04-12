"use client";

import MediaCard from "@/components/modules/Media/MediaCard";
import { Button } from "@/components/ui/button";
import { Media } from "@/types/media.types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";

interface HomeMediaSectionProps {
    title: string;
    href: string;
    icon: ReactNode;
    items: Media[];
    initialVisible?: number;
    incrementBy?: number;
    theme?: "stars" | "reel" | "neon" | "vintage" | "night";
}

const HomeMediaSection = ({
    title,
    href,
    icon,
    items,
    initialVisible = 4,
    incrementBy = 4,
    theme = "stars",
}: HomeMediaSectionProps) => {
    const [visibleCount, setVisibleCount] = useState(initialVisible);

    const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
    const canLoadMore = visibleCount < items.length;
    const themeClass = `ct-theme-${theme}`;

    if (items.length === 0) {
        return null;
    }

    return (
        <section className="py-10 px-4 max-w-7xl mx-auto ct-fade-slide">
            <div className={`ct-section-shell ${themeClass} rounded-2xl p-4 sm:p-6 lg:p-7`}>
            <div className="mb-6 flex items-center justify-between gap-4 relative z-10">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                    {icon}
                    {title}
                </h2>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={href}>View all <ArrowRight className="ml-1 size-4" /></Link>
                </Button>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {visibleItems.map((media, index) => (
                    <div
                        key={media.id}
                        className="ct-fade-slide"
                        style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
                    >
                        <MediaCard media={media} />
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 relative z-10">
                {canLoadMore && (
                    <Button variant="outline" onClick={() => setVisibleCount((prev) => Math.min(prev + incrementBy, items.length))}>
                        Load more
                    </Button>
                )}
            </div>
            </div>
        </section>
    );
};

export default HomeMediaSection;
