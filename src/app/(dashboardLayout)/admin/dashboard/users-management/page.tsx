import AutoFilterForm from "@/components/shared/AutoFilterForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import QueryPagination from "@/components/shared/QueryPagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllUsers } from "@/services/user.services";
import { formatDistanceToNow } from "date-fns";
import { Users } from "lucide-react";
import Link from "next/link";
import DeleteUserButton from "./DeleteUserButton";

export const dynamic = "force-dynamic";

interface UsersManagementPageProps {
    searchParams: Promise<{ page?: string; searchTerm?: string; role?: string; status?: string }>;
}

export default async function UsersManagementPage({ searchParams }: UsersManagementPageProps) {
    const params = await searchParams;
    const page = Number(params.page ?? 1);
    const role = params.role === "USER" || params.role === "ADMIN" || params.role === "SUPER_ADMIN"
        ? params.role
        : undefined;
    const status = params.status === "ACTIVE" || params.status === "BLOCKED" || params.status === "DELETED"
        ? params.status
        : undefined;

    let users: Awaited<ReturnType<typeof getAllUsers>>["data"] = [];
    let total = 0;
    let totalPages = 1;
    try {
        const res = await getAllUsers({
            page,
            limit: 20,
            searchTerm: params.searchTerm,
            role,
            status,
        });
        users = res.data ?? [];
        total = res.meta?.total ?? 0;
        totalPages = res.meta?.totalPages ?? 1;
    } catch { /* empty */ }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="size-6" /> Users Management</h1>
                <p className="text-muted-foreground">{total} total users</p>
            </div>

            <Card>
                <CardContent className="space-y-4 p-4">
                    <AutoFilterForm className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Input
                                type="search"
                                name="searchTerm"
                                defaultValue={params.searchTerm ?? ""}
                                placeholder="Search users by name or email"
                                className="sm:w-80"
                            />
                            <select
                                name="role"
                                defaultValue={role ?? ""}
                                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            >
                                <option value="">All roles</option>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                            <select
                                name="status"
                                defaultValue={status ?? ""}
                                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            >
                                <option value="">All status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="BLOCKED">Blocked</option>
                                <option value="DELETED">Deleted</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/dashboard/users-management">Reset</Link>
                            </Button>
                        </div>
                    </AutoFilterForm>

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

            <QueryPagination currentPage={page} totalPages={totalPages} totalItems={total} className="px-0" />
        </div>
    );
}
