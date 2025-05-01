'use client';

import { ApiKeyCheck } from "@/components/dashboard/api-keys/api-key-check";
import { SalesforceEnvironmentInsights } from "@/components/dashboard/salesforce/environment-insights";
import { useParams } from "next/navigation";

export default function InsightsPage() {
    const { id } = useParams();
    
    return (
        <ApiKeyCheck projectId={id as string}>
            <div className="flex flex-col gap-8 p-8">
                <div className="flex flex-col space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight">AI Analytics</h2>
                    <p className="text-muted-foreground">
                        AI-powered analysis and recommendations for your tests
                    </p>
                </div>

                <SalesforceEnvironmentInsights />
            </div>
        </ApiKeyCheck>
    );
}