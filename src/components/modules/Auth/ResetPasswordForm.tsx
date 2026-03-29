"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { resetPasswordAction } from "@/app/(commonLayout)/(authRouteGroup)/reset-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ResetPasswordFormProps {
    email: string;
}

const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IResetPasswordPayload) => resetPasswordAction(payload),
    });

    const form = useForm({
        defaultValues: { email, otp: "", newPassword: "" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync({ ...value, otp }) as any;
                if (result && !result.success) {
                    setServerError(result.message || "Password reset failed");
                }
            } catch (error: any) {
                if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.message === "NEXT_REDIRECT") {
                    throw error;
                }
                setServerError(error?.message || "Password reset failed");
            }
        },
    });

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>Enter the OTP sent to <strong>{email}</strong> and your new password</CardDescription>
            </CardHeader>
            <CardContent>
                <form method="POST" action="#" noValidate onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Enter OTP</Label>
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
                    </div>

                    <form.Field name="newPassword" validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                append={
                                    <Button type="button" onClick={() => setShowPassword((v) => !v)} variant="ghost" size="icon">
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Resetting..." disabled={!canSubmit || otp.length < 6}>
                                Reset Password
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>
        </Card>
    );
};

export default ResetPasswordForm;
