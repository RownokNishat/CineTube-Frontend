"use client";

import { sendContactMessage } from "@/services/content.services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const initialState = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

export default function ContactPage() {
    const [formState, setFormState] = useState(initialState);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (key: keyof typeof initialState, value: string) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formState.name.trim() || !formState.email.trim() || !formState.subject.trim() || !formState.message.trim()) {
            toast.error("All fields are required");
            return;
        }

        setSubmitting(true);
        try {
            const response = await sendContactMessage(formState);
            if (!response.success) {
                toast.error(response.message || "Failed to send message");
                return;
            }

            toast.success("Your message was sent successfully");
            setFormState(initialState);
        } catch {
            toast.error("Failed to send message");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formState.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Your full name"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formState.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={formState.subject}
                                onChange={(e) => handleChange("subject", e.target.value)}
                                placeholder="What can we help with?"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={formState.message}
                                onChange={(e) => handleChange("message", e.target.value)}
                                rows={6}
                                placeholder="Write your message"
                            />
                        </div>

                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
