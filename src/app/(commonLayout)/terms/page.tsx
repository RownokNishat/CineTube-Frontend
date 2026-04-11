export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
                <p className="text-muted-foreground">Last updated: April 10, 2026</p>
            </div>
            
            <div className="prose dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground mb-4">
                        By accessing or using CineTube, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our standard or premium streaming services.
                    </p>
                </section>
                
                <section>
                    <h2 className="text-2xl font-semibold mb-3">2. Subscriptions and Payments</h2>
                    <p className="text-muted-foreground mb-4">
                        Premium access is billed on a recurring basis (monthly or annually) depending on your selected plan. You can cancel your subscription at any time through your dashboard. Payments are non-refundable for the current active billing cycle.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">3. User Content and Conduct</h2>
                    <p className="text-muted-foreground mb-4">
                        Users may post reviews, ratings, and comments. You retain ownership of your content, but grant CineTube a license to display it. You agree not to post any content that is abusive, offensive, defamatory, or violates any laws or third-party rights. We reserve the right to remove non-compliant content and terminate accounts.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property</h2>
                    <p className="text-muted-foreground mb-4">
                        All streaming content, trademarks, logos, and service marks displayed on CineTube are our property or the property of our licensors. You may not copy, reproduce, distribute, or create derivative works without explicit written permission.
                    </p>
                </section>
            </div>
        </div>
    );
}
