"use client";

import { sendContactMessage } from "@/services/content.services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Mail, Phone } from "lucide-react";

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
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
                <p className="text-muted-foreground">Have a question or feedback? We&apos;d love to hear from you.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_340px]">
                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Send us a message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
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

                            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                                {submitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Contact info sidebar */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <h2 className="font-semibold text-lg">Get in touch</h2>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <MapPin className="size-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Address</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        1207 - Mohammodpur<br />
                                        Dhaka, Bangladesh
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Mail className="size-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <a
                                        href="mailto:rownoknishat17@gmail.com"
                                        className="text-sm text-primary hover:underline mt-0.5 block"
                                    >
                                        rownoknishat17@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Phone className="size-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Phone</p>
                                    <a
                                        href="tel:01722310450"
                                        className="text-sm text-primary hover:underline mt-0.5 block"
                                    >
                                        01722310450
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h2 className="font-semibold text-base mb-2">Response time</h2>
                            <p className="text-sm text-muted-foreground">
                                We typically respond within 24-48 hours. For urgent matters, please reach us by phone.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}