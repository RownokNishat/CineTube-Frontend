"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getGenres } from "@/services/genre.services";
import { updateMedia } from "@/services/media.services";
import { Genre, Media } from "@/types/media.types";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EditMediaDialogProps {
    media: Media;
}

const EditMediaDialog = ({ media }: EditMediaDialogProps) => {
    const [open, setOpen] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(false);
    // Shadcn <Select> doesn't bind to FormData — track these with state
    const [mediaType, setMediaType] = useState<string>(media.mediaType);
    const [pricingType, setPricingType] = useState<string>(media.pricingType);
    const [status, setStatus] = useState<string>(media.status);
    const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>(
        media.genres?.map((g) => g.id) ?? []
    );
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            getGenres().then((res) => setGenres(res.data ?? [])).catch(() => {});
            // Reset controlled state to current media values each time dialog opens
            setMediaType(media.mediaType);
            setPricingType(media.pricingType);
            setStatus(media.status);
            setSelectedGenreIds(media.genres?.map((g) => g.id) ?? []);
        }
    }, [open, media]);

    const handleClose = () => {
        setOpen(false);
    };

    const toggleGenre = (id: string) => {
        setSelectedGenreIds((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Shadcn Select values aren't in FormData — inject them manually
        formData.set("mediaType", mediaType);
        formData.set("pricingType", pricingType);
        formData.set("status", status);

        // Split cast string into individual array entries for the backend
        const castRaw = (formData.get("cast") as string) ?? "";
        formData.delete("cast");
        castRaw.split(",").map((s) => s.trim()).filter(Boolean).forEach((c) => formData.append("cast", c));

        // Genre ids from controlled checkboxes
        formData.delete("genreIds");
        selectedGenreIds.forEach((id) => formData.append("genreIds", id));

        // Remove poster if no file was selected (don't overwrite existing poster)
        const posterFile = formData.get("poster") as File;
        if (!posterFile || posterFile.size === 0) {
            formData.delete("poster");
        }

        setLoading(true);
        try {
            await updateMedia(media.id, formData);
            toast.success("Media updated successfully");
            handleClose();
            router.refresh();
        } catch (err: any) {
            toast.error(err?.message || "Failed to update media");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Media</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1.5">
                            <Label>Title *</Label>
                            <Input name="title" required defaultValue={media.title} placeholder="e.g. Inception" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label>Synopsis *</Label>
                            <Textarea name="synopsis" required rows={3} defaultValue={media.synopsis} placeholder="Brief description..." />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Media Type *</Label>
                            <Select value={mediaType} onValueChange={setMediaType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MOVIE">Movie</SelectItem>
                                    <SelectItem value="SERIES">Series</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Pricing *</Label>
                            <Select value={pricingType} onValueChange={setPricingType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FREE">Free</SelectItem>
                                    <SelectItem value="PREMIUM">Premium</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Release Year *</Label>
                            <Input name="releaseYear" type="number" required defaultValue={media.releaseYear} min={1900} max={2100} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Director *</Label>
                            <Input name="director" required defaultValue={media.director} placeholder="Director name" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Streaming Platform *</Label>
                            <Input name="streamingPlatform" required defaultValue={media.streamingPlatform} placeholder="e.g. Netflix" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label>Cast <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
                            <Input name="cast" defaultValue={media.cast?.join(", ") ?? ""} placeholder="e.g. Leonardo DiCaprio, Joseph Gordon-Levitt" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label>Streaming Link (URL)</Label>
                            <Input name="streamingLink" type="url" defaultValue={media.streamingLink} placeholder="https://..." />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label>Trailer URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <Input name="trailer" type="url" defaultValue={media.trailerUrl ?? ""} placeholder="https://youtube.com/..." />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label>Poster Image <span className="text-muted-foreground text-xs">(leave empty to keep current)</span></Label>
                            <Input name="poster" type="file" accept="image/*" />
                        </div>
                        {genres.length > 0 && (
                            <div className="col-span-2 space-y-2">
                                <Label>Genres</Label>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 border rounded-md p-3">
                                    {genres.map((g) => (
                                        <div key={g.id} className="flex items-center gap-1.5">
                                            <Checkbox
                                                id={`edit-genre-${g.id}`}
                                                checked={selectedGenreIds.includes(g.id)}
                                                onCheckedChange={() => toggleGenre(g.id)}
                                            />
                                            <Label htmlFor={`edit-genre-${g.id}`} className="cursor-pointer font-normal">{g.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditMediaDialog;
