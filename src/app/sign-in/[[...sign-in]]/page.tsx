import { AuthForm } from "@/components/ui/auth-form";

export default function SignInPage() {
    return (
        <div className="flex justify-center items-center min-h-screen p-8 shadow-md">
            <AuthForm mode="login" />
        </div>
    );
} 