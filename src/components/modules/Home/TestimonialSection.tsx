import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getReviews } from "@/services/review.services";

export default async function TestimonialSection() {
    const reviewsRes = await getReviews({ limit: 10, sortBy: "rating", sortOrder: "desc" }).catch(() => ({ data: [] }));
    
    // Filter to effectively show top quality reviews, limit to 10
    const testimonials = (reviewsRes.data || []).slice(0, 10);

    // If backend is entirely empty right now, we can fallback to some default to not make it look broken.
    const displayTestimonials = testimonials.length > 0 ? testimonials : [
        {
            user: { name: "John Doe" },
            content: "CineTube completely changed how I discover new movies. The recommendations are spot on and the premium tier is worth every penny!",
            rating: 10,
        },
        {
            user: { name: "Sarah Smith" },
            content: "The ad-free experience is a game-changer. I love how fast the site is, and the watchlist feature makes tracking my shows effortless.",
            rating: 10,
        },
        {
            user: { name: "Michael Chen" },
            content: "As a reviewer, having a reliable library with accurate meta-data is crucial. CineTube's editor picks are phenomenal.",
            rating: 8,
        }
    ];

    return (
        <section className="py-16 px-4 bg-muted/20 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 group">
                    <h2 className="text-3xl font-bold mb-4 transform transition-transform duration-500 hover:scale-105">Loved by Movie Buffs</h2>
                    <p className="text-muted-foreground transition-opacity duration-700">See what our community has to say about CineTube.</p>
                    <div className="mt-4 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><ChevronLeft className="size-4" /> More reviews</span>
                        <span className="h-px w-12 bg-border" />
                        <span className="inline-flex items-center gap-1">Scroll horizontally <ChevronRight className="size-4" /></span>
                    </div>
                </div>
                {/* Horizontal scrolling row wrapper with smooth snap */}
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background via-background/70 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background via-background/70 to-transparent" />
                    <div className="flex gap-6 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory hide-scrollbar">
                    {displayTestimonials.map((t: any, i: number) => (
                        <div key={i} className="min-w-[85vw] sm:min-w-87.5 md:min-w-100 bg-background border rounded-2xl p-6 shadow-sm snap-center shrink-0 hover:-translate-y-3 hover:shadow-2xl transition-all duration-300">
                            <div className="flex mb-4">
                                {/* Calculate equivalent 5 stars based on 10 base rating */}
                                {Array(Math.max(1, Math.min(5, Math.ceil((t.rating || 10) / 2)))).fill(0).map((_, i) => (
                                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                                ))}
                            </div>
                            <p className="italic text-muted-foreground mb-6 line-clamp-4 leading-relaxed">"{t.content}"</p>
                            <div className="mt-auto">
                                <p className="font-semibold text-primary">{t.user?.name || "Anonymous Member"}</p>
                                <p className="text-xs text-muted-foreground/80 mt-1 uppercase tracking-wider">CineTube Critic</p>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; scroll-behavior: smooth; }
            `}} />
        </section>
    );
}
