'use client';

import { ApiKeyCheck } from "@/components/dashboard/api-keys/api-key-check";
import TestContent from "@/components/dashboard/all-tests/tests";
import { useParams } from "next/navigation";

export default function TestsPage() {
    const { id } = useParams();

    return (
        <ApiKeyCheck projectId={id as string}>
            <div className="flex flex-col gap-8 p-8">
                <TestContent projectId={id as string} />
            </div>
        </ApiKeyCheck>
    );
} 