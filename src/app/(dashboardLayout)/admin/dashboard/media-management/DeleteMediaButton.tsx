"use client";
import { Button } from "@/components/ui/button";
import { deleteMedia } from "@/services/media.services";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteMediaButtonProps {
    mediaId: string;
    title: string;
}

const DeleteMediaButton = ({ mediaId, title }: DeleteMediaButtonProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setLoading(true);
        try {
            await deleteMedia(mediaId);
            toast.success("Media deleted");
            router.refresh();
        } catch {
            toast.error("Failed to delete media");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete} disabled={loading}>
            <Trash2 className="size-4" />
        </Button>
    );
};

export default DeleteMediaButton;
