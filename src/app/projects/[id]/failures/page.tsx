'use client';

import { ApiKeyCheck } from "@/components/api-keys/api-key-check";
import { FailuresContent } from "@/components/dashboard/common/failures-content";
import { useParams } from "next/navigation";

export default function FailuresPage() {
    const { id } = useParams();

    return (
        <ApiKeyCheck projectId={id as string}>
            <div className="flex flex-col gap-8 p-8">
                <div className="flex flex-col space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight">Failures</h2>
                    <p className="text-muted-foreground">
                        Review and address test failures
                    </p>
                </div>

                <FailuresContent />
            </div>
        </ApiKeyCheck>
    );
} 