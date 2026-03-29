"use client";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/services/user.services";
import { Trash2 } from "lucide-react";
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
            await deleteUser(userId);
            toast.success("User deleted");
            router.refresh();
        } catch {
            toast.error("Failed to delete user");
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
