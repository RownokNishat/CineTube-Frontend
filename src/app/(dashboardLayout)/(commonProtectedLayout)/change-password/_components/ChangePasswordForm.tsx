"use client"

import { changeMyPasswordAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/change-password/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IChangePasswordPayload, changePasswordZodSchema } from "@/zod/auth.validation"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function ChangePasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null)
    const [serverSuccess, setServerSuccess] = useState<string | null>(null)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IChangePasswordPayload) => changeMyPasswordAction(payload),
    })

    const form = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null)
            setServerSuccess(null)

            const result = await mutateAsync(value)
            if (!result.success) {
                setServerError(result.message || "Failed to change password")
                return
            }

            setServerSuccess(result.message || "Password updated successfully")
            form.reset()
        },
    })

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    Choose a strong password with at least 8 characters, uppercase, number, and special character.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    method="POST"
                    action="#"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    <form.Field name="currentPassword" validators={{ onChange: changePasswordZodSchema.shape.currentPassword }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Current Password"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                append={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowCurrentPassword((v) => !v)}
                                    >
                                        {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    <form.Field name="newPassword" validators={{ onChange: changePasswordZodSchema.shape.newPassword }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="New Password"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                append={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowNewPassword((v) => !v)}
                                    >
                                        {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    <form.Field name="confirmPassword" validators={{ onChange: changePasswordZodSchema.shape.confirmPassword }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Confirm New Password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter new password"
                                append={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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

                    {serverSuccess && (
                        <Alert>
                            <AlertDescription>{serverSuccess}</AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton
                                isPending={isSubmitting || isPending}
                                pendingLabel="Updating password..."
                                disabled={!canSubmit}
                                className="sm:w-fit"
                            >
                                Update Password
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>
        </Card>
    )
}
