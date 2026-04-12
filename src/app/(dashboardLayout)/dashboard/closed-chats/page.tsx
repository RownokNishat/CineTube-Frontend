import DashboardChatPage from "@/components/modules/Chat/DashboardChatPage";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const UserClosedChatsPage = async () => {
    const user = await getUserInfo().catch(() => null);

    if (!user) {
        redirect("/login?redirect=/dashboard/closed-chats");
    }

    if (user.role !== "USER") {
        redirect("/admin/dashboard/chats");
    }

    return (
        <Suspense fallback={<div className="flex h-40 items-center justify-center text-muted-foreground">Loading chats...</div>}>
            <DashboardChatPage mode="user-closed" currentUserId={user.id} />
        </Suspense>
    );
};

export default UserClosedChatsPage;