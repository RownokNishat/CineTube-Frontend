import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAboutContent } from "@/services/content.services";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
    const response = await getAboutContent().catch(() => null);
    const content = response?.success
        ? response.data
        : {
              title: "About CineTube",
              mission:
                  "CineTube helps people discover, rate, and discuss movies and series while giving admins tools to moderate high-quality content.",
              highlights: [
                  "Explore movies and series with rich filters",
                  "Rate titles on a 1-10 scale and share thoughtful reviews",
                  "Save favorites to your watchlist",
                  "Subscribe or purchase premium content securely",
              ],
          };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">{content.title}</h1>
                <p className="text-muted-foreground leading-relaxed">{content.mission}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Why People Use CineTube</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        {content.highlights.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
