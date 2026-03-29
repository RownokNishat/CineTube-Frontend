import { getUserInfo, logoutUser } from "@/services/auth.services";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Film, LogOut, Settings, User, Bookmark } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const Navbar = async () => {
    const user = await getUserInfo().catch(() => null);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Film className="size-6 text-primary" />
                    <span>CineTube</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm">
                    <Link href="/media" className="text-muted-foreground hover:text-foreground transition-colors">Movies &amp; Series</Link>
                    <Link href="/media?mediaType=MOVIE" className="text-muted-foreground hover:text-foreground transition-colors">Movies</Link>
                    <Link href="/media?mediaType=SERIES" className="text-muted-foreground hover:text-foreground transition-colors">Series</Link>
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 rounded-full">
                                    <Avatar className="size-8">
                                        <AvatarImage src={user.image ?? ""} />
                                        <AvatarFallback className="text-xs">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:block text-sm font-medium">{user.name}</span>
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
                        <div className="flex items-center gap-2">
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
