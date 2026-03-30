"use client"

import { updateMyProfileAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserProfile } from "@/services/user.services"
import { IUpdateProfilePayload, updateProfileZodSchema } from "@/zod/auth.validation"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { useMemo, useState } from "react"

interface MyProfileFormProps {
    profile: UserProfile
}

export default function MyProfileForm({ profile }: MyProfileFormProps) {
    const [serverError, setServerError] = useState<string | null>(null)
    const [serverSuccess, setServerSuccess] = useState<string | null>(null)

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IUpdateProfilePayload) => updateMyProfileAction(payload),
    })

    const form = useForm({
        defaultValues: {
            name: profile.name ?? "",
            image: profile.image ?? "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null)
            setServerSuccess(null)

            const result = await mutateAsync(value)
            if (!result.success) {
                setServerError(result.message || "Failed to update profile")
                return
            }

            setServerSuccess(result.message || "Profile updated successfully")
        },
    })

    const avatarLabel = useMemo(() => {
        const name = form.state.values.name?.trim() || profile.name || "U"
        return name.charAt(0).toUpperCase()
    }, [form.state.values.name, profile.name])

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>Update your account details used across dashboard and reviews.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border">
                                <AvatarImage src={form.state.values.image || undefined} alt={form.state.values.name || profile.name} />
                                <AvatarFallback>{avatarLabel}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-lg font-semibold">{form.state.values.name || profile.name}</h2>
                                <p className="text-sm text-muted-foreground">{profile.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Badge variant="outline">{profile.role}</Badge>
                            <Badge variant={profile.status === "ACTIVE" ? "default" : "destructive"}>{profile.status}</Badge>
                        </div>
                    </div>

                    <Separator />

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
                        <form.Field name="name" validators={{ onChange: updateProfileZodSchema.shape.name }}>
                            {(field) => <AppField field={field} label="Full Name" placeholder="Enter your full name" />}
                        </form.Field>

                        <form.Field
                            name="image"
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value) return undefined
                                    try {
                                        new URL(value)
                                        return undefined
                                    } catch {
                                        return "Image URL must be a valid URL"
                                    }
                                },
                            }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Profile Image URL"
                                    placeholder="https://example.com/avatar.png"
                                />
                            )}
                        </form.Field>

                        <div className="rounded-md border bg-muted/30 p-3 text-sm">
                            <p><span className="font-medium">Email:</span> {profile.email}</p>
                            <p><span className="font-medium">Member since:</span> {new Date(profile.createdAt).toLocaleDateString()}</p>
                            <p><span className="font-medium">Last updated:</span> {new Date(profile.updatedAt).toLocaleString()}</p>
                        </div>

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
                                    pendingLabel="Saving profile..."
                                    disabled={!canSubmit}
                                    className="sm:w-fit"
                                >
                                    Save Changes
                                </AppSubmitButton>
                            )}
                        </form.Subscribe>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
