"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotPasswordAction } from "@/app/(commonLayout)/(authRouteGroup)/forgot-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IForgotPasswordPayload, forgotPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ForgotPasswordForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IForgotPasswordPayload) => forgotPasswordAction(payload),
    });

    const form = useForm({
        defaultValues: { email: "" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccessMessage(null);
            try {
                const result = await mutateAsync(value) as any;
                if (result?.success) {
                    setSuccessMessage(result.message);
                    setTimeout(() => router.push(`/reset-password?email=${encodeURIComponent(value.email)}`), 2000);
                } else {
                    setServerError(result?.message || "Failed to send OTP");
                }
            } catch (error: any) {
                setServerError(error?.message || "Failed to send OTP");
            }
        },
    });

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                <CardDescription>Enter your email to receive a password reset OTP</CardDescription>
            </CardHeader>
            <CardContent>
                <form method="POST" action="#" noValidate onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-4">
                    <form.Field name="email" validators={{ onChange: forgotPasswordZodSchema.shape.email }}>
                        {(field) => <AppField field={field} label="Email" type="email" placeholder="Enter your email" />}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Sending OTP..." disabled={!canSubmit}>
                                Send Reset OTP
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>
            <CardFooter className="justify-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">Sign in</Link>
                </p>
            </CardFooter>
        </Card>
    );
};

export default ForgotPasswordForm;
