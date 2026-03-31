import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getGenres } from "@/services/genre.services";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AddGenreForm from "./AddGenreForm";

export const dynamic = "force-dynamic";

interface GenresManagementPageProps {
    searchParams: Promise<{ searchTerm?: string }>;
}

export default async function GenresManagementPage({ searchParams }: GenresManagementPageProps) {
    const params = await searchParams;
    const searchTerm = params.searchTerm?.trim().toLowerCase() ?? "";

    let genres: Awaited<ReturnType<typeof getGenres>>["data"] = [];
    try {
        const res = await getGenres();
        genres = res.data ?? [];
    } catch { /* empty */ }

    const filteredGenres = genres.filter((genre) => genre.name.toLowerCase().includes(searchTerm));

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold">Genres Management</h1>
                <p className="text-muted-foreground">{filteredGenres.length} genres</p>
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
                    <form className="mb-4 flex flex-col gap-3 sm:flex-row">
                        <Input
                            type="search"
                            name="searchTerm"
                            defaultValue={params.searchTerm ?? ""}
                            placeholder="Search genres"
                            className="sm:max-w-sm"
                        />
                        <div className="flex gap-2">
                            <Button type="submit">Search</Button>
                            {params.searchTerm && (
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/admin/dashboard/genres-management">Reset</Link>
                                </Button>
                            )}
                        </div>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        {filteredGenres.map((g) => (
                            <Badge key={g.id} variant="outline" className="text-sm px-3 py-1">{g.name}</Badge>
                        ))}
                        {filteredGenres.length === 0 && <p className="text-sm text-muted-foreground">No genres matched your search</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
