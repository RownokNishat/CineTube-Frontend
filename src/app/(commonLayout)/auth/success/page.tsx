"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthSuccessPage = () => {
    const router = useRouter();

    useEffect(() => {
        // After Google OAuth, redirect to dashboard
        router.replace("/dashboard");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">Signing you in...</p>
        </div>
    );
};

export default AuthSuccessPage;
