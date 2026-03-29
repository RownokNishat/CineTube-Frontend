"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyEmailAction } from "@/app/(commonLayout)/(authRouteGroup)/verify-email/_action";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface VerifyEmailFormProps {
    email: string;
}

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
    const [otp, setOtp] = useState("");
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => verifyEmailAction({ email, otp }),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        try {
            const result = await mutateAsync() as any;
            if (result && !result.success) {
                setServerError(result.message || "Verification failed");
            }
        } catch (error: any) {
            if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.message === "NEXT_REDIRECT") {
                throw error;
            }
            setServerError(error?.message || "Verification failed");
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                <CardDescription>
                    We&apos;ve sent a 6-digit OTP to <strong>{email}</strong>. Enter it below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <AppSubmitButton isPending={isPending} pendingLabel="Verifying..." disabled={otp.length < 6}>
                        Verify Email
                    </AppSubmitButton>
                </form>
            </CardContent>
        </Card>
    );
};

export default VerifyEmailForm;
