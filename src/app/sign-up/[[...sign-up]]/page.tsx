import { AuthForm } from "@/components/ui/auth-form";

export default function SignUpPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <AuthForm mode="signup" />
            </div>
        </div>
    );
} 