import Navbar from "@/components/modules/shared/Navbar";
import Footer from "@/components/modules/shared/Footer";
import ChatWidget from "@/components/modules/shared/ChatWidget";
import AiChatWidget from "@/components/modules/shared/AiChatWidget";

export default function CommonLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <ChatWidget />
            <AiChatWidget />
            <Footer />
        </>
    );
}

