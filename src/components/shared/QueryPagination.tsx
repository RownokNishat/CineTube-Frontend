"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationToken = number | "start-ellipsis" | "end-ellipsis";

const getPaginationItems = (currentPage: number, totalPages: number): PaginationToken[] => {
    if (totalPages <= 0) return [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (currentPage <= 5) return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
    if (currentPage >= totalPages - 4) {
        return [1, "start-ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
        1,
        "start-ellipsis",
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        "end-ellipsis",
        totalPages,
    ];
};

interface QueryPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    className?: string;
    paramName?: string;
}

const QueryPagination = ({ currentPage, totalPages, totalItems, className, paramName = "page" }: QueryPaginationProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) {
        return null;
    }

    const buildHref = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramName, String(page));
        return `${pathname}?${params.toString()}`;
    };

    const paginationItems = getPaginationItems(currentPage, totalPages);
    const jumpBackwardTarget = Math.max(1, currentPage - 5);
    const jumpForwardTarget = Math.min(totalPages, currentPage + 5);

    return (
        <div className={cn("flex flex-col gap-3 rounded-xl border bg-muted/20 px-4 py-3 md:flex-row md:items-center md:justify-between", className)}>
            <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild={currentPage > 1} className="hidden sm:inline-flex">
                    {currentPage > 1 ? <Link href={buildHref(1)}><ChevronsLeft className="size-4" /></Link> : <span><ChevronsLeft className="size-4" /></span>}
                </Button>

                <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild={currentPage > 1}>
                    {currentPage > 1 ? <Link href={buildHref(currentPage - 1)}><ChevronLeft className="size-4" /> Prev</Link> : <span><ChevronLeft className="size-4" /> Prev</span>}
                </Button>

                {paginationItems.map((item) => {
                    if (item === "start-ellipsis") {
                        return (
                            <Button key="start-ellipsis" variant="ghost" size="sm" className="min-w-9 px-2" asChild>
                                <Link href={buildHref(jumpBackwardTarget)}>...</Link>
                            </Button>
                        );
                    }

                    if (item === "end-ellipsis") {
                        return (
                            <Button key="end-ellipsis" variant="ghost" size="sm" className="min-w-9 px-2" asChild>
                                <Link href={buildHref(jumpForwardTarget)}>...</Link>
                            </Button>
                        );
                    }

                    const isActive = item === currentPage;
                    return (
                        <Button
                            key={item}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            className={cn("min-w-9", isActive && "pointer-events-none")}
                            asChild={!isActive}
                        >
                            {isActive ? <span>{item}</span> : <Link href={buildHref(item)}>{item}</Link>}
                        </Button>
                    );
                })}

                <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild={currentPage < totalPages}>
                    {currentPage < totalPages ? <Link href={buildHref(currentPage + 1)}>Next <ChevronRight className="size-4" /></Link> : <span>Next <ChevronRight className="size-4" /></span>}
                </Button>

                <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild={currentPage < totalPages} className="hidden sm:inline-flex">
                    {currentPage < totalPages ? <Link href={buildHref(totalPages)}><ChevronsRight className="size-4" /></Link> : <span><ChevronsRight className="size-4" /></span>}
                </Button>
            </div>

            <div className="rounded bg-background px-2 py-1 text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}{typeof totalItems === "number" ? `, Total ${totalItems} items` : ""}
            </div>
        </div>
    );
};

export default QueryPagination;