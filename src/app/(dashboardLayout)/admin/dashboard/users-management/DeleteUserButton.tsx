"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteUserAction } from "./_action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const DeleteUserButton = ({ userId, name }: { userId: string; name: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Delete user "${name}"?`)) return;
        setLoading(true);
        try {
            const result = await deleteUserAction(userId);
            if (!result.success) {
                toast.error(result.message || "Failed to delete user");
                return;
            }
            toast.success("User deleted");
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

export default DeleteUserButton;
