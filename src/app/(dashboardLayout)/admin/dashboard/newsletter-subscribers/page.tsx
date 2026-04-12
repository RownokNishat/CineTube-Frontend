import { getNewsletterSubscribers } from "@/services/content.services";
import { NewsletterSubscriber } from "@/types/content.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import QueryPagination from "@/components/shared/QueryPagination";
import { Mail, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

interface NewsletterSubscribersPageProps {
    searchParams: Promise<{
        page?: string;
        searchTerm?: string;
    }>;
}

export default async function NewsletterSubscribersPage({ searchParams }: NewsletterSubscribersPageProps) {
    const params = await searchParams;
    const page = Number(params.page ?? 1);
    const searchTerm = params.searchTerm?.trim();

    let subscribers: NewsletterSubscriber[] = [];
    let total = 0;
    let totalPages = 1;

    try {
        const res = await getNewsletterSubscribers({ page, limit: 30, ...(searchTerm ? { searchTerm } : {}) });
        subscribers = res.data ?? [];
        total = res.meta?.total ?? 0;
        totalPages = res.meta?.totalPages ?? 1;
    } catch (error) {
        console.error("Failed to fetch newsletter subscribers:", error);
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Mail className="h-6 w-6" />
                        Newsletter Subscribers
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        <Users className="h-3.5 w-3.5 inline mr-1" />
                        {total} subscriber{total !== 1 ? "s" : ""}
                    </p>
                </div>

                <form method="get" className="flex gap-2">
                    <input
                        name="searchTerm"
                        defaultValue={searchTerm}
                        placeholder="Search by email…"
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-60"
                    />
                    <button
                        type="submit"
                        className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Search
                    </button>
                    {searchTerm && (
                        <a
                            href="?"
                            className="h-9 px-3 rounded-md border text-sm font-medium inline-flex items-center hover:bg-muted transition-colors"
                        >
                            Clear
                        </a>
                    )}
                </form>
            </div>

            <Card>
                <CardContent className="p-0">
                    {subscribers.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No subscribers found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                                        <th className="px-4 py-3 text-left">#</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Subscribed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscribers.map((sub, idx) => (
                                        <tr key={sub.id} className="border-b hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {(page - 1) * 30 + idx + 1}
                                            </td>
                                            <td className="px-4 py-3 font-medium">{sub.email}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={sub.isActive ? "default" : "outline"} className="text-xs">
                                                    {sub.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                                                {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {totalPages > 1 && (
                <QueryPagination currentPage={page} totalPages={totalPages} totalItems={total} />
            )}
        </div>
    );
}
