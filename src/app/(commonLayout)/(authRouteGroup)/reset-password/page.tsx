import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";
import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
    searchParams: Promise<{ email?: string }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
    const params = await searchParams;
    const email = params.email;

    if (!email) {
        redirect("/forgot-password");
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <ResetPasswordForm email={email} />
        </div>
    );
};

export default ResetPasswordPage;