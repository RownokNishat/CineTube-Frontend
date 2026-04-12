"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/services/content.services";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            const res = await subscribeNewsletter(email.trim());
            if (!res.success) {
                toast.error(res.message || "Failed to subscribe");
                return;
            }
            toast.success("You're subscribed! Welcome to CineTube.");
            setEmail("");
        } catch {
            toast.error("Failed to subscribe. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 px-4">
            <div className="max-w-5xl mx-auto bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss a Release</h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                        Join our newsletter to get weekly updates on the hottest new movies, exclusive series, and premium offers directly in your inbox.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="flex-1 h-12 px-4 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                        />
                        <Button type="submit" size="lg" variant="secondary" className="h-12 px-8 font-semibold" disabled={loading}>
                            {loading ? "Subscribing..." : "Subscribe"}
                        </Button>
                    </form>
                </div>
                {/* Decorative background circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>
        </section>
    );
}

