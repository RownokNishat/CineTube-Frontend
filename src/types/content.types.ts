export interface AboutContent {
    title: string;
    mission: string;
    highlights: string[];
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface ContactMessagePayload {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NewsletterSubscriber {
    id: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
