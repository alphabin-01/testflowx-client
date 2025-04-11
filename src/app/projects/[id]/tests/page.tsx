'use client';

import { TestsContent } from "@/components/dashboard/content/tests";
import DashboardLayout from "../../../dashboard-layout";
import { ApiKeyCheck } from "@/components/api-keys/api-key-check";
import { useParams } from "next/navigation";

export default function TestsPage() {
    const { id } = useParams();

    return (
        <DashboardLayout>
            <ApiKeyCheck projectId={id as string}>
                <div className="flex flex-col gap-8 p-8">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-2xl font-bold tracking-tight">Tests</h2>
                        <p className="text-muted-foreground">
                            Run and manage tests
                        </p>
                    </div>

                    <TestsContent />
                </div>
            </ApiKeyCheck>
        </DashboardLayout>
    );
} 