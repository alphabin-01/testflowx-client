'use client';

import { AnalyticsContent } from "@/components/dashboard/analytics/analytics";
import { ApiKeyCheck } from "@/components/dashboard/api-keys/api-key-check";
import { useParams } from "next/navigation";

export default function ProjectPage() {
    const { id } = useParams();

    return (
        <ApiKeyCheck projectId={id as string}>
            <div className="flex flex-col gap-8 p-8">
                <div className="flex flex-col space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">
                        Visualize your test metrics and performance
                    </p>
                </div>

                <AnalyticsContent projectId={id as string} />
            </div>
        </ApiKeyCheck>
    );
}