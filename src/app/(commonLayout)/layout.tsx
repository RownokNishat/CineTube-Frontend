import Navbar from "@/components/modules/shared/Navbar";
import Footer from "@/components/modules/shared/Footer";
import ChatWidget from "@/components/modules/shared/ChatWidget";

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
            <Footer />
        </>
    );
}

