export default function FAQSection() {
    const faqs = [
        {
            q: "How do I start watching?",
            a: "Simply sign up for a free account to start browsing. You can watch ad-supported content immediately, or upgrade to a premium plan for an ad-free experience."
        },
        {
            q: "Can I download movies to watch offline?",
            a: "Yes! Premium members can download content directly to their mobile devices via our app to watch on the go without an internet connection."
        },
        {
            q: "How do I upgrade to a premium plan?",
            a: "You can upgrade your plan at any time from your Account Dashboard. Just select 'Billing & Plans' and choose the tier that fits you."
        },
        {
            q: "Are the editor picks updated regularly?",
            a: "Our editorial team updates the 'Editor's Picks' every week with hand-selected masterpieces, trending hits, and hidden gems."
        }
    ];

    return (
        <section className="py-16 px-4 ct-fade-slide">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground">Everything you need to know about CineTube.</p>
                </div>
                <div className="divide-y border-y rounded-xl bg-background/70 backdrop-blur-sm">
                    {faqs.map((faq, i) => (
                        <div key={i} className="py-6 px-4 transition-colors duration-300 hover:bg-muted/30">
                            <h3 className="text-lg font-medium mb-2">{faq.q}</h3>
                            <p className="text-muted-foreground">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
