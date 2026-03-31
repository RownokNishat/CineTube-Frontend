import { getUserInfo } from "@/services/auth.services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UserProfilePage() {
    const userInfo = await getUserInfo().catch(() => null);

    if (!userInfo) {
        redirect("/auth/login");
    }

    const createdDate = userInfo.createdAt
        ? format(new Date(userInfo.createdAt), "MMM dd, yyyy")
        : "Unknown";

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                        {userInfo.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{userInfo.name}</h1>
                    <p className="text-muted-foreground">{userInfo.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="size-5" /> Profile Information
                        </CardTitle>
                        <CardDescription>Your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label htmlFor="name" className="text-xs text-muted-foreground">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                value={userInfo.name || ""}
                                disabled
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-xs text-muted-foreground">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                value={userInfo.email || ""}
                                disabled
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-xs text-muted-foreground">
                                Account Status
                            </Label>
                            <div className="mt-2">
                                <Badge
                                    variant={userInfo.status === "ACTIVE" ? "default" : "destructive"}
                                >
                                    {userInfo.status}
                                </Badge>
                            </div>
                        </div>

                        <Button asChild variant="outline" className="w-full">
                            <Link href="/change-password">Change Password</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Account Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="size-5" /> Account Details
                        </CardTitle>
                        <CardDescription>Additional information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label className="text-xs text-muted-foreground">User Role</Label>
                            <div className="mt-2">
                                <Badge variant="outline">
                                    {userInfo.role?.replace("_", " ")}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs text-muted-foreground">
                                Member Since
                            </Label>
                            <p className="mt-2 flex items-center gap-2 text-sm">
                                <Calendar className="size-4 text-muted-foreground" />
                                {createdDate}
                            </p>
                        </div>

                        <div>
                            <Label className="text-xs text-muted-foreground">Email Status</Label>
                            <p className="mt-2">
                                <Badge
                                    variant={
                                        userInfo.emailVerified ? "default" : "secondary"
                                    }
                                >
                                    {userInfo.emailVerified
                                        ? "Verified"
                                        : "Not Verified"}
                                </Badge>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/dashboard/watchlist">📌 My Watchlist</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/dashboard/purchase-history">🎬 Purchase History</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/dashboard/subscription">💳 Subscription</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
