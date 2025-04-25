import { AuthForm } from "@/components/ui/auth-form";

export default function SignUpPage() {
    return (
        <div className="flex justify-center items-center min-h-screen p-8">
            <AuthForm mode="signup" />
        </div>
    );
} 