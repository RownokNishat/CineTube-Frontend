import Navbar from "@/components/modules/shared/Navbar";

export default function CommonLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <footer className="border-t py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} CineTube. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
