"use client";
import { logoutUser } from "@/services/auth.services";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LogoutButton = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            router.push("/login");
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleLogout} disabled={loading} className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-sm transition-colors">
            <LogOut className="size-4" />
            {loading ? "Signing out..." : "Sign Out"}
        </button>
    );
};

export default LogoutButton;
