"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export async function deleteCommentAsAdmin(commentId: string): Promise<ApiResponse<null> > {
    return httpClient.delete<null>(`/reviews/comments/${commentId}/admin`);
}
