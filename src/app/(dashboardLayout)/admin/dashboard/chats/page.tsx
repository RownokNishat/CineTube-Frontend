import DashboardChatPage from "@/components/modules/Chat/DashboardChatPage";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const AdminChatsPage = async () => {
    const user = await getUserInfo().catch(() => null);

    if (!user) {
        redirect("/login?redirect=/admin/dashboard/chats");
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        redirect("/dashboard");
    }

    return <DashboardChatPage mode="admin" currentUserId={user.id} />;
};

export default AdminChatsPage;