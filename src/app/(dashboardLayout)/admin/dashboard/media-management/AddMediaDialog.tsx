"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getGenres } from "@/services/genre.services";
import { Genre } from "@/types/media.types";
import { Film, ImageIcon, Link2, Plus, Tag, Tv2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createMediaAction } from "./_action";

const AddMediaDialog = () => {
    const [open, setOpen] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(false);
    const [mediaType, setMediaType] = useState("MOVIE");
    const [pricingType, setPricingType] = useState("FREE");
    const [status, setStatus] = useState("DRAFT");
    const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            getGenres().then((res) => setGenres(res.data ?? [])).catch(() => {});
        }
    }, [open]);

    const handleClose = () => {
        setOpen(false);
        setMediaType("MOVIE");
        setPricingType("FREE");
        setStatus("DRAFT");
        setSelectedGenreIds([]);
        setPosterPreview(null);
        formRef.current?.reset();
    };

    const toggleGenre = (id: string) => {
        setSelectedGenreIds((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPosterPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Shadcn Select values are not in FormData — inject manually
        formData.set("mediaType", mediaType);
        formData.set("pricingType", pricingType);
        formData.set("status", status);

        // Backend expects cast as an array; split comma-separated string
        const castRaw = (formData.get("cast") as string) ?? "";
        formData.delete("cast");
        castRaw.split(",").map((s) => s.trim()).filter(Boolean).forEach((c) => formData.append("cast", c));

        formData.delete("genreIds");
        selectedGenreIds.forEach((id) => formData.append("genreIds", id));

        setLoading(true);
        try {
            const result = await createMediaAction(formData);
            if (!result.success) {
                toast.error(result.message || "Failed to create media");
                return;
            }
            toast.success("Media created successfully");
            handleClose();
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="size-4" /> Add Media
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Film className="size-5 text-primary" />
                        Add New Movie / Series
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[75vh]">
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="px-6 py-5 space-y-6">

                            {/* ── Basic Info ─────────────────────────────── */}
                            <section className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Basic Info</p>
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="add-title">Title <span className="text-destructive">*</span></Label>
                                        <Input id="add-title" name="title" required placeholder="e.g. Inception" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="add-synopsis">Synopsis <span className="text-destructive">*</span></Label>
                                        <Textarea id="add-synopsis" name="synopsis" required rows={3} placeholder="A brief description of the plot…" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="add-cast">
                                            Cast <span className="text-muted-foreground text-xs font-normal">(comma-separated)</span>
                                        </Label>
                                        <Input id="add-cast" name="cast" placeholder="Leonardo DiCaprio, Joseph Gordon-Levitt…" />
                                    </div>
                                </div>
                            </section>

                            <Separator />

                            {/* ── Classification ─────────────────────────── */}
                            <section className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Classification</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label>Type <span className="text-destructive">*</span></Label>
                                        <Select value={mediaType} onValueChange={setMediaType}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MOVIE">
                                                    <span className="flex items-center gap-2"><Film className="size-3.5" /> Movie</span>
                                                </SelectItem>
                                                <SelectItem value="SERIES">
                                                    <span className="flex items-center gap-2"><Tv2 className="size-3.5" /> Series</span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Pricing <span className="text-destructive">*</span></Label>
                                        <Select value={pricingType} onValueChange={setPricingType}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="FREE">Free</SelectItem>
                                                <SelectItem value="PREMIUM">Premium</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="add-year">Release Year <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="add-year"
                                            name="releaseYear"
                                            type="number"
                                            required
                                            placeholder={String(new Date().getFullYear())}
                                            min={1888}
                                            max={new Date().getFullYear() + 5}
                                        />
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
                                    <div className="space-y-1.5 col-span-2">
                                        <Label htmlFor="add-director">Director <span className="text-destructive">*</span></Label>
                                        <Input id="add-director" name="director" required placeholder="Director name" />
                                    </div>
                                </div>
                            </section>

                            <Separator />

                            {/* ── Streaming ──────────────────────────────── */}
                            <section className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <Link2 className="size-3.5" /> Streaming
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="add-platform">Platform <span className="text-destructive">*</span></Label>
                                        <Input id="add-platform" name="streamingPlatform" required placeholder="Netflix, Disney+…" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="add-link">Streaming Link</Label>
                                        <Input id="add-link" name="streamingLink" type="url" placeholder="https://…" />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <Label htmlFor="add-trailer">
                                            Trailer URL <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                                        </Label>
                                        <Input id="add-trailer" name="trailer" type="url" placeholder="https://youtube.com/watch?v=…" />
                                    </div>
                                </div>
                            </section>

                            <Separator />

                            {/* ── Poster ─────────────────────────────────── */}
                            <section className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <ImageIcon className="size-3.5" /> Poster
                                </p>
                                <div className="flex gap-4 items-start">
                                    {/* Preview thumbnail */}
                                    <div className="w-24 h-32 rounded-lg border-2 border-dashed flex-shrink-0 overflow-hidden flex items-center justify-center bg-muted">
                                        {posterPreview ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={posterPreview} alt="Poster preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="size-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    {/* Upload area */}
                                    <div className="flex-1">
                                        <Input
                                            id="add-poster"
                                            name="poster"
                                            type="file"
                                            accept="image/*"
                                            required
                                            className="hidden"
                                            onChange={handlePosterChange}
                                        />
                                        <label
                                            htmlFor="add-poster"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted transition-colors gap-1"
                                        >
                                            <Upload className="size-5 text-muted-foreground" />
                                            <span className="text-sm font-medium">Click to upload poster</span>
                                            <span className="text-xs text-muted-foreground">PNG, JPG, WEBP recommended</span>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* ── Genres ─────────────────────────────────── */}
                            {genres.length > 0 && (
                                <>
                                    <Separator />
                                    <section className="space-y-3">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                            <Tag className="size-3.5" /> Genres
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {genres.map((g) => {
                                                const selected = selectedGenreIds.includes(g.id);
                                                return (
                                                    <button
                                                        key={g.id}
                                                        type="button"
                                                        onClick={() => toggleGenre(g.id)}
                                                    >
                                                        <Badge
                                                            variant={selected ? "default" : "outline"}
                                                            className="text-sm px-3 py-1 cursor-pointer select-none transition-all"
                                                        >
                                                            {g.name}
                                                        </Badge>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </section>
                                </>
                            )}
                        </div>

                        {/* ── Footer ─────────────────────────────────────── */}
                        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-muted/30">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="min-w-28">
                                {loading ? "Creating…" : "Create Media"}
                            </Button>
                        </div>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default AddMediaDialog;

