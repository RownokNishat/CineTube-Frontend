import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";

const SECTIONS = [
    {
        title: "1. Overview",
        content: `CineTube is a digital streaming and content discovery platform. Because all purchases and rentals on CineTube are for digital content delivered instantly, our return and refund policy is designed to be fair while reflecting the nature of digital goods.

By completing a purchase or rental on CineTube, you agree to the terms described in this Return Policy.`,
    },
    {
        title: "2. Digital Content — General Rule",
        content: `Once digital content (a movie, series, or premium subscription plan) has been accessed or streamed, it is considered consumed and is generally not eligible for a refund. This applies to:

• One-time movie or series purchases
• Rental purchases (once the rental period has started)
• Monthly or yearly subscription plans where content has been accessed`,
    },
    {
        title: "3. Eligible Refund Scenarios",
        content: `We will issue a full refund in the following situations:

• Technical failure: You were charged but were unable to access the content due to a verified technical error on our end, and the issue could not be resolved within 48 hours.
• Duplicate charge: Your payment method was charged more than once for the same item or subscription.
• Unauthorized transaction: A charge was made without your authorisation, and you report it to us within 7 days of the transaction date.
• Subscription not yet used: You purchased a subscription plan and have not accessed any premium content within 24 hours of purchase — you may request a cancellation and full refund within that window.`,
    },
    {
        title: "4. Non-Refundable Items",
        content: `The following are not eligible for refunds:

• Any content that has already been streamed or downloaded
• Rentals after the rental window has begun (even if partially watched)
• Subscription plans after the 24-hour unused window has passed
• Purchases made during promotional or discounted campaigns (unless covered by Section 3 above)`,
    },
    {
        title: "5. How to Request a Refund",
        content: `To request a refund, contact our support team within 7 days of the original transaction:

• Email: rownoknishat17@gmail.com
• Phone: 01722310450
• Or use the Contact Us form at cinetube.com/contact

Please include: your registered email address, the transaction ID or payment receipt, and a brief description of the issue. We aim to respond within 2 business days.`,
    },
    {
        title: "6. Refund Processing",
        content: `Approved refunds are processed back to the original payment method within 5–10 business days, depending on your bank or payment provider. CineTube is not responsible for delays caused by your financial institution.`,
    },
    {
        title: "7. Subscription Cancellations",
        content: `You may cancel your subscription at any time from your dashboard under Account → Subscription. Cancellation takes effect at the end of the current billing cycle — you retain access to premium content until that date. No partial-period refunds are issued for subscription cancellations unless covered by Section 3.`,
    },
    {
        title: "8. Chargebacks",
        content: `If you initiate a chargeback with your bank or card provider without first contacting CineTube support, we reserve the right to suspend your account pending investigation. We encourage you to reach us directly — most issues can be resolved quickly without a chargeback.`,
    },
    {
        title: "9. Changes to This Policy",
        content: `CineTube reserves the right to update this Return Policy at any time. Material changes will be announced via email or an in-app notice at least 7 days before taking effect. Continued use of the platform after a policy update constitutes acceptance of the revised terms.`,
    },
    {
        title: "10. Contact",
        content: `For any questions about this policy, please reach out:

• Address: 1207 - Mohammodpur, Dhaka, Bangladesh
• Email: rownoknishat17@gmail.com
• Phone: 01722310450`,
    },
];

export default function ReturnPolicyPage() {
    const lastUpdated = "April 12, 2026";

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <RotateCcw className="size-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">Last updated: {lastUpdated}</Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">Return & Refund Policy</h1>
                <p className="text-muted-foreground">
                    Please read our return and refund policy carefully before making any purchase on CineTube. If you have questions, our support team is always happy to help.
                </p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
                {SECTIONS.map((section) => (
                    <section key={section.title}>
                        <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
                        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {section.content}
                        </div>
                    </section>
                ))}
            </div>

            {/* Footer note */}
            <div className="mt-12 rounded-xl border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
                This policy applies to all transactions completed on CineTube. For the most current version, always refer to this page at{" "}
                <span className="font-medium text-foreground">cinetube.com/return-policy</span>.
            </div>
        </div>
    );
}
