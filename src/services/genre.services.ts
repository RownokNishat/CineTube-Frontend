import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { Genre } from "@/types/media.types";

export async function getGenres(): Promise<ApiResponse<Genre[]>> {
    return httpClient.get<Genre[]>("/genres");
}

export async function createGenre(name: string): Promise<ApiResponse<Genre>> {
    return httpClient.post<Genre>("/genres", { name });
}
