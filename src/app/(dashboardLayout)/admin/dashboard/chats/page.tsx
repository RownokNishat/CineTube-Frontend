import DashboardChatPage from "@/components/modules/Chat/DashboardChatPage";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const AdminChatsPage = async () => {
    const user = await getUserInfo().catch(() => null);

    if (!user) {
        redirect("/login?redirect=/admin/dashboard/chats");
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        redirect("/dashboard");
    }

    return (
        <Suspense fallback={<div className="flex h-40 items-center justify-center text-muted-foreground">Loading chats...</div>}>
            <DashboardChatPage mode="admin" currentUserId={user.id} />
        </Suspense>
    );
};

export default AdminChatsPage;