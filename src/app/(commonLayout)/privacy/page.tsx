export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: April 10, 2026</p>
            </div>
            
            <div className="prose dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                    <p className="text-muted-foreground mb-4">
                        We collect information you provide directly to us when you create an account, subscribe to our premium plans, write reviews, or communicate with us. This may include your name, email address, payment information, and usage data regarding the content you stream or rate on CineTube.
                    </p>
                </section>
                
                <section>
                    <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                    <p className="text-muted-foreground mb-4">
                        We use the information we collect to operate, maintain, and improve our services. This includes personalizing your experience, providing tailored content recommendations, processing transactions, and communicating with you about updates or security alerts.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">3. Data Security and Sharing</h2>
                    <p className="text-muted-foreground mb-4">
                        Your privacy is critical to us. We do not sell your personal data to third parties. We use industry-standard security measures to protect your account data. Certain data may be shared with trusted third-party services (such as payment processors) solely to facilitate the services you request.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">4. Contact Us</h2>
                    <p className="text-muted-foreground mb-4">
                        If you have any questions or concerns about this Privacy Policy, please contact our privacy team at <a href="mailto:privacy@cinetube.com" className="text-primary hover:underline">privacy@cinetube.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
