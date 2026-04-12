import { NextRequest, NextResponse } from "next/server";

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!RAW_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

const getBackendBaseUrl = () => {
    const normalized = normalizeBaseUrl(RAW_BASE_URL);
    return normalized.endsWith("/api/v1") ? normalized : `${normalized}/api/v1`;
};

const buildTargetUrl = (pathSegments: string[], search: string) => {
    const backendBase = getBackendBaseUrl();
    const path = pathSegments.join("/");
    return `${backendBase}/${path}${search}`;
};

const shouldForwardBody = (method: string) => !["GET", "HEAD"].includes(method.toUpperCase());

const forwardRequest = async (
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> },
) => {
    const { path } = await context.params;
    const targetUrl = buildTargetUrl(path, request.nextUrl.search);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete("host");
    requestHeaders.delete("connection");
    requestHeaders.delete("content-length");
    // Remove accept-encoding so the backend returns uncompressed body.
    // Node's fetch auto-decompresses, which would cause double-decompression in the browser.
    requestHeaders.delete("accept-encoding");

    const init: RequestInit = {
        method: request.method,
        headers: requestHeaders,
        redirect: "manual",
        cache: "no-store",
    };

    if (shouldForwardBody(request.method)) {
        init.body = await request.arrayBuffer();
    }

    const backendResponse = await fetch(targetUrl, init);
    const responseHeaders = new Headers(backendResponse.headers);
    // Strip encoding headers: Node fetch already decompresses the body,
    // so forwarding Content-Encoding would cause the browser to decompress again.
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(backendResponse.body, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: responseHeaders,
    });
};

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return forwardRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return forwardRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return forwardRequest(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return forwardRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return forwardRequest(request, context);
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return forwardRequest(request, context);
}
