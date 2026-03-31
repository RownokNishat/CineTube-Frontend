import { httpClient } from "@/lib/axios/httpClient";
import { AboutContent, ContactMessagePayload, FaqItem } from "@/types/content.types";
import { ApiResponse } from "@/types/api.types";

export async function getAboutContent(): Promise<ApiResponse<AboutContent>> {
    return httpClient.get<AboutContent>("/content/about");
}

export async function getFaqContent(): Promise<ApiResponse<FaqItem[]>> {
    return httpClient.get<FaqItem[]>("/content/faq");
}

export async function sendContactMessage(payload: ContactMessagePayload) {
    return httpClient.post<{
        id: string;
        name: string;
        email: string;
        subject: string;
        message: string;
        isRead: boolean;
        createdAt: string;
        updatedAt: string;
    }>("/content/contact", payload);
}
