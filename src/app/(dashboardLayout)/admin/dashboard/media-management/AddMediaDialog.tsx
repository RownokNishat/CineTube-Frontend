"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createMedia } from "@/services/media.services";
import { getGenres } from "@/services/genre.services";
import { Genre } from "@/types/media.types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AddMediaDialog = () => {
    const [open, setOpen] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            getGenres().then((res) => setGenres(res.data ?? [])).catch(() => {});
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setLoading(true);
        try {
            await createMedia(formData);
            toast.success("Media created successfully");
            setOpen(false);
            router.refresh();
        } catch (err: any) {
            toast.error(err?.message || "Failed to create media");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="size-4" /> Add Media</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Movie / Series</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1.5">
                            <Label>Title *</Label>
                            <Input name="title" required placeholder="e.g. Inception" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label>Synopsis *</Label>
                            <Textarea name="synopsis" required rows={3} placeholder="Brief description..." />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Media Type *</Label>
                            <Select name="mediaType" required defaultValue="MOVIE">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MOVIE">Movie</SelectItem>
                                    <SelectItem value="SERIES">Series</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Pricing *</Label>
                            <Select name="pricingType" required defaultValue="FREE">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FREE">Free</SelectItem>
                                    <SelectItem value="PREMIUM">Premium</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Release Year *</Label>
                            <Input name="releaseYear" type="number" required placeholder="2024" min={1900} max={2100} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Director</Label>
                            <Input name="director" placeholder="Director name" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label>Cast <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
                            <Input name="cast" placeholder="e.g. Leonardo DiCaprio, Joseph Gordon-Levitt" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Streaming Platform</Label>
                            <Input name="streamingPlatform" placeholder="e.g. Netflix" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Streaming Link (URL)</Label>
                            <Input name="streamingLink" type="url" placeholder="https://..." />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Trailer URL</Label>
                            <Input name="trailer" type="url" placeholder="https://youtube.com/..." />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Poster Image</Label>
                            <Input name="poster" type="file" accept="image/*" />
                        </div>
                        {genres.length > 0 && (
                            <div className="col-span-2 space-y-1.5">
                                <Label>Genres <span className="text-muted-foreground text-xs">(hold Ctrl to select multiple)</span></Label>
                                <select name="genreIds" multiple className="w-full border rounded px-3 py-2 text-sm bg-background h-28">
                                    {genres.map((g) => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Media"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddMediaDialog;
