import PricingSection from "@/components/modules/Home/PricingSection";

export const dynamic = "force-dynamic";

export default function PricingPage() {
    return (
        <div className="min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Choose Your Plan</h1>
                <p className="text-lg text-muted-foreground">Unlock unlimited access to premium movies, TV series, ad-free streaming, and offline downloads.</p>
            </div>
            <PricingSection />
        </div>
    );
}
