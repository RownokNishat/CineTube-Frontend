import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFaqContent } from "@/services/content.services";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
    const response = await getFaqContent().catch(() => null);
    const faqs = response?.success
        ? response.data
        : [
              {
                  question: "How do ratings work?",
                  answer: "You can rate any title from 1 to 10 and optionally add a written review.",
              },
              {
                  question: "Why is my review not visible yet?",
                  answer: "Reviews may require moderation before being published.",
              },
              {
                  question: "Can I edit or delete my review?",
                  answer: "Yes. You can edit or delete your own review while it is unpublished.",
              },
          ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
                <p className="text-muted-foreground">Common questions about CineTube and premium access.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((item) => (
                    <Card key={item.question}>
                        <CardHeader>
                            <CardTitle className="text-base">{item.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{item.answer}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
