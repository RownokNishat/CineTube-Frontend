"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGenre } from "@/services/genre.services";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AddGenreForm = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        try {
            await createGenre(name.trim());
            toast.success(`Genre "${name}" created`);
            setName("");
            router.refresh();
        } catch {
            toast.error("Failed to create genre");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Genre name (e.g. Action, Drama)"
                className="flex-1"
            />
            <Button type="submit" disabled={loading || !name.trim()}>
                {loading ? "Adding..." : "Add Genre"}
            </Button>
        </form>
    );
};

export default AddGenreForm;
