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
}

const HomeMediaSection = ({
    title,
    href,
    icon,
    items,
    initialVisible = 4,
    incrementBy = 4,
}: HomeMediaSectionProps) => {
    const [visibleCount, setVisibleCount] = useState(initialVisible);

    const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
    const canLoadMore = visibleCount < items.length;

    if (items.length === 0) {
        return null;
    }

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

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {visibleItems.map((media) => (
                    <MediaCard key={media.id} media={media} />
                ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
                {canLoadMore && (
                    <Button variant="outline" onClick={() => setVisibleCount((prev) => Math.min(prev + incrementBy, items.length))}>
                        Load more
                    </Button>
                )}
            </div>
        </section>
    );
};

export default HomeMediaSection;
