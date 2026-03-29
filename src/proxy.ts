import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { getNewTokensWithRefreshToken, getUserInfo } from "./services/auth.services";

// Edge-compatible JWT decode (no crypto, just base64 payload + expiry check)
function edgeDecodeJwt(token: string): { role?: string; exp?: number } | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = atob(padded);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function isJwtValid(token: string): boolean {
    const payload = edgeDecodeJwt(token);
    if (!payload) return false;
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    return true;
}

function isTokenExpiringSoon(token: string, thresholdInSeconds = 300): boolean {
    const payload = edgeDecodeJwt(token);
    if (!payload?.exp) return false;
    const remainingSeconds = payload.exp - Math.floor(Date.now() / 1000);
    return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
}

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
    try {
        const refresh = await getNewTokensWithRefreshToken(refreshToken);
        if (!refresh) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error refreshing token in middleware:", error);
        return false;
    }
}


export async function proxy(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;
        const pathWithQuery = `${pathname}${request.nextUrl.search}`;
        const accessToken = request.cookies.get("accessToken")?.value;
        const refreshToken = request.cookies.get("refreshToken")?.value;

        const decodedAccessToken = accessToken ? edgeDecodeJwt(accessToken) : null;
        const isValidAccessToken = accessToken ? isJwtValid(accessToken) : false;

        let userRole: UserRole | null = null;

        if (decodedAccessToken?.role) {
            userRole = decodedAccessToken.role as UserRole;
        }

        // Unify SUPER_ADMIN -> ADMIN for route checks
        const normalizedRole: UserRole | null = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;

        const routerOwner = getRouteOwner(pathname);
        const isAuth = isAuthRoute(pathname);

        // Proactively refresh token if expiring soon
        if (isValidAccessToken && refreshToken && isTokenExpiringSoon(accessToken!)) {
            const requestHeaders = new Headers(request.headers);
            const response = NextResponse.next({ request: { headers: requestHeaders } });

            try {
                const refreshed = await refreshTokenMiddleware(refreshToken);
                if (refreshed) {
                    requestHeaders.set("x-token-refreshed", "1");
                }
                return NextResponse.next({ request: { headers: requestHeaders }, headers: response.headers });
            } catch (error) {
                console.error("Error refreshing token:", error);
            }

            return response;
        }

        // Rule 1: Logged-in users should not access auth pages
        if (isAuth && isValidAccessToken && pathname !== "/verify-email") {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(normalizedRole as UserRole), request.url));
        }

        // Rule 2: Public routes - allow
        if (routerOwner === null) {
            return NextResponse.next();
        }

        // Rule 3: Not logged in but accessing protected route -> redirect to login
        if (!accessToken || !isValidAccessToken) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathWithQuery);
            return NextResponse.redirect(loginUrl);
        }

        // Rule 4: Enforce email verification
        if (accessToken) {
            const userInfo = await getUserInfo();

            if (userInfo) {
                if (userInfo.emailVerified === false) {
                    if (pathname !== "/verify-email") {
                        const verifyEmailUrl = new URL("/verify-email", request.url);
                        verifyEmailUrl.searchParams.set("email", userInfo.email);
                        return NextResponse.redirect(verifyEmailUrl);
                    }
                    return NextResponse.next();
                }

                if (userInfo.emailVerified && pathname === "/verify-email") {
                    return NextResponse.redirect(new URL(getDefaultDashboardRoute(normalizedRole as UserRole), request.url));
                }
            }
        }

        // Rule 5: Common protected routes - allow
        if (routerOwner === "COMMON") {
            return NextResponse.next();
        }

        // Rule 6: Role-based route enforcement
        if (routerOwner === "ADMIN" || routerOwner === "USER") {
            if (routerOwner !== normalizedRole) {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(normalizedRole as UserRole), request.url));
            }
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Error in proxy middleware:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ]
}
