import { z } from "zod";

const strongPasswordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/\p{Lu}/u, "Password must contain at least one uppercase letter")
    .regex(/\p{Nd}/u, "Password must contain at least one number")
    .regex(/[\p{P}\p{S}]/u, "Password must contain at least one special character");

export const loginZodSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export const registerZodSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: strongPasswordSchema,
});

export type IRegisterPayload = z.infer<typeof registerZodSchema>;

export const verifyEmailZodSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;

export const forgotPasswordZodSchema = z.object({
    email: z.email("Invalid email address"),
});

export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>;

export const resetPasswordZodSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: strongPasswordSchema,
});

export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;

export const reviewZodSchema = z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
    content: z.string().min(10, "Review must be at least 10 characters"),
    isSpoiler: z.boolean(),
    tags: z.array(z.string()),
});

export type IReviewPayload = z.infer<typeof reviewZodSchema>;

export const updateProfileZodSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(80, "Name can be at most 80 characters"),
    image: z
        .union([
            z.string().url("Image URL must be a valid URL"),
            z.literal(""),
            z.null(),
            z.undefined(),
        ])
        .optional(),
});

export type IUpdateProfilePayload = z.infer<typeof updateProfileZodSchema>;

export const changePasswordZodSchema = z
    .object({
        currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
        newPassword: strongPasswordSchema,
        confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
        message: "Confirm password must match new password",
        path: ["confirmPassword"],
    });

export type IChangePasswordPayload = z.infer<typeof changePasswordZodSchema>;
