import DashboardChatPage from "@/components/modules/Chat/DashboardChatPage";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const UserClosedChatsPage = async () => {
    const user = await getUserInfo().catch(() => null);

    if (!user) {
        redirect("/login?redirect=/dashboard/closed-chats");
    }

    if (user.role !== "USER") {
        redirect("/admin/dashboard/chats");
    }

    return <DashboardChatPage mode="user-closed" currentUserId={user.id} />;
};

export default UserClosedChatsPage;