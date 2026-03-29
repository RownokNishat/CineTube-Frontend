export interface ILoginResponse {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "BLOCKED" | "DELETED";
}

export interface IRegisterResponse {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
}
