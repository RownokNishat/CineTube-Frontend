import VerifyEmailForm from "@/components/modules/Auth/VerifyEmailForm";
import { redirect } from "next/navigation";

interface VerifyEmailPageProps {
    searchParams: Promise<{ email?: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
    const params = await searchParams;
    const email = params.email;

    if (!email) {
        redirect("/register");
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <VerifyEmailForm email={email} />
        </div>
    );
};

export default VerifyEmailPage;