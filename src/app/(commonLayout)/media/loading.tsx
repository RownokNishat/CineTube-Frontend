import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>

            <div className="mb-6">
                <Skeleton className="h-14 w-full rounded-md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col h-full rounded-lg border overflow-hidden">
                        <Skeleton className="aspect-[2/3] w-full rounded-none" />
                        <div className="p-4 flex-1 flex flex-col">
                            <Skeleton className="h-5 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-10 w-full mt-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
