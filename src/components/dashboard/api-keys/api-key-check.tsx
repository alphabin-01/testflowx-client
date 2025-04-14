"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApiKeys } from "@/contexts/api-key-context";

type ApiKeyCheckProps = {
    projectId: string;
    children: ReactNode;
    redirectTo?: string; // Optional custom redirect path
};

export function ApiKeyCheck({ projectId, children, redirectTo }: ApiKeyCheckProps) {
    const [isChecking, setIsChecking] = useState(true);
    const [hasApiKeys, setHasApiKeys] = useState<boolean | null>(null);
    const router = useRouter();
    const { checkApiKeys, apiKeyStatuses, isLoading } = useApiKeys();

    useEffect(() => {
        const verifyApiKeys = async () => {
            if (!projectId) return;

            // Check if we already have a cached result
            if (apiKeyStatuses[projectId]?.isVerified) {
                setHasApiKeys(apiKeyStatuses[projectId].hasKeys);
                setIsChecking(false);
                return;
            }

            // Otherwise, check API keys
            const result = await checkApiKeys(projectId);
            setHasApiKeys(result);
            setIsChecking(false);
        };

        verifyApiKeys();
    }, [projectId, apiKeyStatuses, checkApiKeys]);

    // Handle redirection in an effect
    useEffect(() => {
        if (hasApiKeys === false) {
            const redirectPath = redirectTo || `/projects/${projectId}/api-keys`;
            router.push(redirectPath);
        }
    }, [hasApiKeys, projectId, redirectTo, router]);

    if (isChecking || isLoading) {
        return <div className="p-8 text-center">Verifying project configuration...</div>;
    }

    if (hasApiKeys === false) {
        return <div className="p-8 text-center">Redirecting to API key creation...</div>;
    }

    return <>{children}</>;
} 