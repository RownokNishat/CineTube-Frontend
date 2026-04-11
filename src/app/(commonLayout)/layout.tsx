import Navbar from "@/components/modules/shared/Navbar";
import Footer from "@/components/modules/shared/Footer";

export default function CommonLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}

