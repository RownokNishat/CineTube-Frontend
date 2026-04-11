"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerAction } from "@/app/(commonLayout)/(authRouteGroup)/register/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const RegisterForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IRegisterPayload) => registerAction(payload),
    });

    const form = useForm({
        defaultValues: { name: "", email: "", password: "" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value) as any;
                if (result && !result.success) {
                    setServerError(result.message || "Registration failed");
                }
            } catch (error: any) {
                if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.message === "NEXT_REDIRECT") {
                    throw error;
                }
                setServerError(error?.message || "Registration failed");
            }
        },
    });

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                <CardDescription>Join CineTube and start rating movies & series</CardDescription>
            </CardHeader>

            <CardContent>
                <form method="POST" action="#" noValidate onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-4">
                    <form.Field name="name" validators={{ onChange: registerZodSchema.shape.name }}>
                        {(field) => <AppField field={field} label="Full Name" type="text" placeholder="Enter your full name" />}
                    </form.Field>

                    <form.Field name="email" validators={{ onChange: registerZodSchema.shape.email }}>
                        {(field) => <AppField field={field} label="Email" type="email" placeholder="Enter your email" />}
                    </form.Field>

                    <form.Field name="password" validators={{ onChange: registerZodSchema.shape.password }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
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
                            <AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Creating account..." disabled={!canSubmit}>
                                Create Account
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">Sign in</Link>
                </p>
            </CardFooter>
        </Card>
    );
};

export default RegisterForm;
