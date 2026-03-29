import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGenres } from "@/services/genre.services";
import AddGenreForm from "./AddGenreForm";

export const dynamic = "force-dynamic";

export default async function GenresManagementPage() {
    let genres: Awaited<ReturnType<typeof getGenres>>["data"] = [];
    try {
        const res = await getGenres();
        genres = res.data ?? [];
    } catch { /* empty */ }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold">Genres Management</h1>
                <p className="text-muted-foreground">{genres.length} genres</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Add New Genre</CardTitle>
                </CardHeader>
                <CardContent>
                    <AddGenreForm />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Existing Genres</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {genres.map((g) => (
                            <Badge key={g.id} variant="outline" className="text-sm px-3 py-1">{g.name}</Badge>
                        ))}
                        {genres.length === 0 && <p className="text-sm text-muted-foreground">No genres yet</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
