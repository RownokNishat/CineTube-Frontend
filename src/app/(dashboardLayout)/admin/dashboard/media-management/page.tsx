import AutoFilterForm from "@/components/shared/AutoFilterForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMediaList } from "@/services/media.services";
import { Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteMediaButton from "./DeleteMediaButton";
import AddMediaDialog from "./AddMediaDialog";
import EditMediaDialog from "./EditMediaDialog";

export const dynamic = "force-dynamic";

interface MediaManagementPageProps {
    searchParams: Promise<{
        page?: string;
        searchTerm?: string;
        pricingType?: string;
        status?: string;
    }>;
}

export default async function MediaManagementPage({ searchParams }: MediaManagementPageProps) {
    const params = await searchParams;
    const page = Number(params.page ?? 1);
    const searchTerm = params.searchTerm?.trim();
    const pricingType = params.pricingType === "FREE" || params.pricingType === "PREMIUM"
        ? params.pricingType
        : undefined;
    const status = params.status === "DRAFT" || params.status === "PUBLISHED"
        ? params.status
        : undefined;

    let mediaList: Awaited<ReturnType<typeof getMediaList>>["data"] = [];
    let total = 0;
    try {
        const res = await getMediaList({
            page,
            limit: 15,
            sortBy: "createdAt",
            sortOrder: "desc",
            searchTerm,
            pricingType,
            status,
        });
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
                <CardContent className="space-y-4 p-4">
                    <AutoFilterForm className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Input
                                type="search"
                                name="searchTerm"
                                defaultValue={searchTerm ?? ""}
                                placeholder="Search media by title, director, or synopsis"
                                className="sm:w-80"
                            />
                            <select
                                name="pricingType"
                                defaultValue={pricingType ?? ""}
                                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            >
                                <option value="">All pricing</option>
                                <option value="FREE">Free</option>
                                <option value="PREMIUM">Premium</option>
                            </select>
                            <select
                                name="status"
                                defaultValue={status ?? ""}
                                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            >
                                <option value="">All status</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/dashboard/media-management">Reset</Link>
                            </Button>
                        </div>
                    </AutoFilterForm>

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
                                        <div className="relative w-10 h-14 rounded overflow-hidden bg-muted flex-shrink-0">
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
