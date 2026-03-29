import { z } from "zod";

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
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
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
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;

export const reviewZodSchema = z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
    content: z.string().min(10, "Review must be at least 10 characters"),
    isSpoiler: z.boolean(),
    tags: z.array(z.string()),
});

export type IReviewPayload = z.infer<typeof reviewZodSchema>;
