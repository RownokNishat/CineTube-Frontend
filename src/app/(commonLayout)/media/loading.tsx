import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Heading */}
            <div className="mb-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>

            {/* Sticky filter bar skeleton */}
            <div className="sticky top-14 z-20 mb-6 rounded-xl border bg-background/95 p-3 shadow-sm">
                <div className="flex flex-wrap gap-2 items-center">
                    <Skeleton className="h-9 flex-1 min-w-[160px] max-w-xs rounded-md" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-28 rounded-md" />
                    <Skeleton className="h-9 w-28 rounded-md" />
                    <Skeleton className="h-9 w-32 rounded-md" />
                    <Skeleton className="h-9 w-28 rounded-md" />
                </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex flex-col h-full rounded-lg border overflow-hidden">
                        <Skeleton className="aspect-[2/3] w-full rounded-none" />
                        <div className="p-4 flex-1 flex flex-col gap-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-9 w-full mt-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
