import { Star } from "lucide-react";

export default function TestimonialSection() {
    const testimonials = [
        {
            name: "John Doe",
            role: "Movie Enthusiast",
            content: "CineTube completely changed how I discover new movies. The recommendations are spot on and the premium tier is worth every penny!",
            rating: 5,
        },
        {
            name: "Sarah Smith",
            role: "Binge Watcher",
            content: "The ad-free experience is a game-changer. I love how fast the site is, and the watchlist feature makes tracking my shows effortless.",
            rating: 5,
        },
        {
            name: "Michael Chen",
            role: "Film Critic",
            content: "As a reviewer, having a reliable library with accurate meta-data is crucial. CineTube's editor picks are phenomenal.",
            rating: 4,
        }
    ];

    return (
        <section className="py-16 px-4 bg-muted/20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">Loved by Movie Buffs</h2>
                    <p className="text-muted-foreground">See what our community has to say about CineTube.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-background border rounded-2xl p-6 shadow-sm">
                            <div className="flex mb-4">
                                {Array(t.rating).fill(0).map((_, i) => (
                                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="italic text-muted-foreground mb-4">"{t.content}"</p>
                            <div>
                                <p className="font-semibold">{t.name}</p>
                                <p className="text-sm text-muted-foreground/80">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
