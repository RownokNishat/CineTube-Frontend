import DashboardNavbar from "@/components/modules/Dashboord/DashboardNavbar"
import DashboardSidebar from "@/components/modules/Dashboord/DashboardSidebar"
import ChatWidget from "@/components/modules/shared/ChatWidget"
import AiChatWidget from "@/components/modules/shared/AiChatWidget"
import React from "react"

export const dynamic = 'force-dynamic'

const RootDashboardLayout = async ({children} : {children: React.ReactNode}) => {
  return (
    <div className="flex h-screen overflow-hidden relative">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardNavbar />
            <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6 pb-20">
                <div>
                    {children}
                </div>
            </main>
        </div>
        <ChatWidget />
        <AiChatWidget />
    </div>
  )
}

export default RootDashboardLayout