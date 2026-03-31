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
