import { getUserInfo } from "@/services/auth.services";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Film, Settings, User, Bookmark } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const Navbar = async () => {
    const user = await getUserInfo().catch(() => null);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between\">
                <Link href="/" className="flex items-center gap-1 sm:gap-2 font-bold text-base sm:text-xl shrink-0\">
                    <Film className="size-5 sm:size-6 text-primary" />
                    <span className="hidden sm:inline">CineTube</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm flex-1 ml-8 lg:ml-12">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer font-medium flex items-center gap-1">
                            Browse <span className="text-[10px]">▼</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link href="/media" className="cursor-pointer">All Movies &amp; Series</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/media?mediaType=MOVIE" className="cursor-pointer">Movies Only</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/media?mediaType=SERIES" className="cursor-pointer">TV Series</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/media?pricingType=PREMIUM" className="cursor-pointer text-primary">Premium Content</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Pricing</Link>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">About</Link>
                    <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors font-medium">FAQ</Link>
                    <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Contact</Link>
                </nav>

                <div className="flex items-center gap-2 sm:gap-3\">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 sm:gap-2 rounded-full\">
                                    <Avatar className="size-7 sm:size-8\">
                                        <AvatarImage src={user.image ?? ""} />
                                        <AvatarFallback className="text-xs">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:block text-xs sm:text-sm font-medium\">{user.name}</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/my-profile" className="gap-2 cursor-pointer">
                                        <User className="size-4" /> Profile
                                    </Link>
                                </DropdownMenuItem>
                                {(user.role === "USER") && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/watchlist" className="gap-2 cursor-pointer">
                                            <Bookmark className="size-4" /> Watchlist
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href={user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "/admin/dashboard" : "/dashboard"} className="gap-2 cursor-pointer">
                                        <Settings className="size-4" /> Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <LogoutButton />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-1 sm:gap-2\">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
