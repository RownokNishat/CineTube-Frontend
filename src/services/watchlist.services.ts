import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { WatchlistItem } from "@/types/subscription.types";

export async function getWatchlist(): Promise<ApiResponse<WatchlistItem[]>> {
    return httpClient.get<WatchlistItem[]>("/watchlist");
}

export async function addToWatchlist(mediaId: string): Promise<ApiResponse<WatchlistItem>> {
    return httpClient.post<WatchlistItem>("/watchlist", { mediaId });
}

export async function removeFromWatchlist(mediaId: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/watchlist/${mediaId}`);
}
