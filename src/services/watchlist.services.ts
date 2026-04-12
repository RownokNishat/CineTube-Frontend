import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { WatchlistItem } from "@/types/subscription.types";

export async function getWatchlist(params?: { page?: number; limit?: number }): Promise<ApiResponse<WatchlistItem[]>> {
    return httpClient.get<WatchlistItem[]>("/watchlist", { params: params as Record<string, unknown> | undefined });
}

export async function addToWatchlist(mediaId: string): Promise<ApiResponse<WatchlistItem>> {
    try {
        return await httpClient.post<WatchlistItem>(`/watchlist/${mediaId}`, {});
    } catch {
        // Compatibility fallback for backends that expect mediaId in body.
        return httpClient.post<WatchlistItem>("/watchlist", { mediaId });
    }
}

export async function removeFromWatchlist(mediaId: string): Promise<ApiResponse<null>> {
    try {
        return await httpClient.delete<null>(`/watchlist/${mediaId}`);
    } catch {
        // Compatibility fallback for handlers expecting mediaId as query.
        return httpClient.delete<null>("/watchlist", { params: { mediaId } });
    }
}

export async function checkWatchlistStatus(mediaId: string): Promise<ApiResponse<{ inWatchlist: boolean }>> {
    try {
        return await httpClient.get<{ inWatchlist: boolean }>(`/watchlist/${mediaId}/status`);
    } catch {
        return httpClient.get<{ inWatchlist: boolean }>("/watchlist/status", { params: { mediaId } });
    }
}

export async function clearWatchlist(): Promise<ApiResponse<null>> {
    return httpClient.delete<null>("/watchlist/clear");
}
