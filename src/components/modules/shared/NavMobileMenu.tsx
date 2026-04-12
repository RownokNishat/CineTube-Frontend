"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Film, Bookmark, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from "./LogoutButton";

interface NavUser {
    id: string;
    name: string;
    image?: string | null;
    role: string;
}

interface NavMobileMenuProps {
    user: NavUser | null;
}

const NAV_LINKS = [
    { href: "/media", label: "All Movies & Series" },
    { href: "/media?mediaType=MOVIE", label: "Movies Only" },
    { href: "/media?mediaType=SERIES", label: "TV Series" },
    { href: "/media?pricingType=PREMIUM", label: "Premium Content" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
];

export default function NavMobileMenu({ user }: NavMobileMenuProps) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 flex flex-col p-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <Link href="/" onClick={close} className="flex items-center gap-2 font-bold text-lg">
                        <Film className="size-5 text-primary" />
                        CineTube
                    </Link>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon" aria-label="Close menu">
                            <X className="size-4" />
                        </Button>
                    </SheetClose>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Browse</p>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={close}
                            className="flex items-center rounded-md px-2 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Auth section */}
                    <div className="border-t pt-4 mt-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-2 py-2 mb-2">
                                    <Avatar className="size-9">
                                        <AvatarImage src={user.image ?? ""} />
                                        <AvatarFallback className="text-xs">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
                                    </div>
                                </div>

                                <Link href="/my-profile" onClick={close} className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                                    <User className="size-4" /> Profile
                                </Link>

                                {user.role === "USER" && (
                                    <Link href="/dashboard/watchlist" onClick={close} className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                                        <Bookmark className="size-4" /> Watchlist
                                    </Link>
                                )}

                                <Link
                                    href={user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "/admin/dashboard" : "/dashboard"}
                                    onClick={close}
                                    className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    <Settings className="size-4" /> Dashboard
                                </Link>

                                <div className="mt-1">
                                    <LogoutButton />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 px-2">
                                <Button asChild onClick={close}>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button variant="outline" asChild onClick={close}>
                                    <Link href="/register">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
