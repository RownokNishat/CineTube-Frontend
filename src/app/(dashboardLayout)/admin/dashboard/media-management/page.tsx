import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMediaList } from "@/services/media.services";
import { Film, Plus } from "lucide-react";
import Image from "next/image";
import DeleteMediaButton from "./DeleteMediaButton";
import AddMediaDialog from "./AddMediaDialog";
import EditMediaDialog from "./EditMediaDialog";

export const dynamic = "force-dynamic";

interface MediaManagementPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function MediaManagementPage({ searchParams }: MediaManagementPageProps) {
    const params = await searchParams;
    const page = Number(params.page ?? 1);

    let mediaList: Awaited<ReturnType<typeof getMediaList>>["data"] = [];
    let total = 0;
    try {
        const res = await getMediaList({ page, limit: 15, sortBy: "createdAt", sortOrder: "desc" });
        mediaList = res.data ?? [];
        total = res.meta?.total ?? 0;
    } catch { /* empty */ }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Film className="size-6" /> Media Management</h1>
                    <p className="text-muted-foreground">{total} total items</p>
                </div>
                <AddMediaDialog />
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Pricing</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mediaList.map((media) => (
                                <TableRow key={media.id}>
                                    <TableCell>
                                        <div className="relative size-10 rounded overflow-hidden bg-muted">
                                            {media.posterUrl ? (
                                                <Image src={media.posterUrl} alt={media.title} fill className="object-cover" sizes="40px" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Film className="size-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-48 truncate">{media.title}</TableCell>
                                    <TableCell><Badge variant="outline">{media.mediaType}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={media.pricingType === "FREE" ? "secondary" : "default"}>{media.pricingType}</Badge>
                                    </TableCell>
                                    <TableCell>{media.releaseYear}</TableCell>
                                    <TableCell>
                                        <Badge variant={media.status === "PUBLISHED" ? "default" : "secondary"}>{media.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <EditMediaDialog media={media} />
                                            <DeleteMediaButton mediaId={media.id} title={media.title} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {mediaList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                        No media found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
