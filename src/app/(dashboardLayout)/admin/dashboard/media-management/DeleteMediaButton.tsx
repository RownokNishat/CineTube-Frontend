"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteMediaAction } from "./_action";

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
            const result = await deleteMediaAction(mediaId);
            if (!result.success) {
                toast.error(result.message || "Failed to delete media");
                return;
            }
            toast.success("Media deleted");
            router.refresh();
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
