import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function BlogPage() {
    const defaultPosts = [
        {
            title: "The Ultimate Guide to Sci-Fi Movies in 2026",
            excerpt: "Explore the futuristic worlds, deep space themes, and mind-bending narratives coming to screens this year.",
            author: "CineTube Editorial",
            date: "Apr 10, 2026",
            image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800",
            category: "Preview"
        },
        {
            title: "Why Modern TV Series are Better Than Ever",
            excerpt: "With massive budgets and A-list actors, serialized content has reached an era of unprecedented quality.",
            author: "Jane Doe",
            date: "Mar 28, 2026",
            image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800",
            category: "Analysis"
        },
        {
            title: "Top 5 Hidden Gems To Watch This Weekend",
            excerpt: "Looking for something out of the ordinary? These 5 indie masterpieces deserve to be on your watchlist.",
            author: "Michael Smith",
            date: "Mar 15, 2026",
            image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
            category: "Recommendations"
        }
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
            <div className="space-y-4 text-center pb-8 border-b">
                <h1 className="text-4xl font-bold tracking-tight">The CineTube Blog</h1>
                <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
                    Deep dives, industry news, editorials, and movie curations right from the CineTube desk.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {defaultPosts.map((post, i) => (
                    <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <Link href={`/blog#`} className="block">
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                            <CardContent className="p-5">
                                <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                                <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium text-foreground">{post.author}</span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="size-3" /> {post.date}
                                    </span>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
}
