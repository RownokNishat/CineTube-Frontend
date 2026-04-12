import { httpClient } from "@/lib/axios/httpClient";
import { AboutContent, ContactMessage, ContactMessagePayload, FaqItem, NewsletterSubscriber } from "@/types/content.types";
import { ApiResponse } from "@/types/api.types";

export async function getAboutContent(): Promise<ApiResponse<AboutContent>> {
    return httpClient.get<AboutContent>("/content/about");
}

export async function getFaqContent(): Promise<ApiResponse<FaqItem[]>> {
    return httpClient.get<FaqItem[]>("/content/faq");
}

export async function sendContactMessage(payload: ContactMessagePayload) {
    return httpClient.post<ContactMessage>("/content/contact", payload);
}

export async function getAdminContactMessages(params?: { page?: number; limit?: number; isRead?: boolean }): Promise<ApiResponse<ContactMessage[]>> {
    return httpClient.get<ContactMessage[]>("/content/contact-messages", { params: params as Record<string, unknown> });
}

export async function markContactMessageAsRead(id: string): Promise<ApiResponse<ContactMessage>> {
    return httpClient.patch<ContactMessage>(`/content/contact-messages/${id}/read`, {});
}

export async function subscribeNewsletter(email: string): Promise<ApiResponse<NewsletterSubscriber>> {
    return httpClient.post<NewsletterSubscriber>("/content/newsletter/subscribe", { email });
}

export async function getNewsletterSubscribers(params?: { page?: number; limit?: number; searchTerm?: string }): Promise<ApiResponse<NewsletterSubscriber[]>> {
    return httpClient.get<NewsletterSubscriber[]>("/content/newsletter/subscribers", { params: params as Record<string, unknown> });
}
