import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllUsers } from "@/services/user.services";
import { formatDistanceToNow } from "date-fns";
import { Users } from "lucide-react";
import DeleteUserButton from "./DeleteUserButton";

export const dynamic = "force-dynamic";

interface UsersManagementPageProps {
    searchParams: Promise<{ page?: string; searchTerm?: string }>;
}

export default async function UsersManagementPage({ searchParams }: UsersManagementPageProps) {
    const params = await searchParams;
    const page = Number(params.page ?? 1);

    let users: Awaited<ReturnType<typeof getAllUsers>>["data"] = [];
    let total = 0;
    try {
        const res = await getAllUsers({ page, limit: 20, searchTerm: params.searchTerm });
        users = res.data ?? [];
        total = res.meta?.total ?? 0;
    } catch { /* empty */ }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="size-6" /> Users Management</h1>
                <p className="text-muted-foreground">{total} total users</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Verified</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.emailVerified ? "default" : "secondary"}>
                                            {user.emailVerified ? "Verified" : "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {user.role === "USER" && <DeleteUserButton userId={user.id} name={user.name} />}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
