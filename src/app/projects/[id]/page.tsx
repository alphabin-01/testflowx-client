'use client';

import { ApiKeyCheck } from "@/components/api-keys/api-key-check";
import { DashboardContent } from "@/components/dashboard/content/overview";
import { useParams } from "next/navigation";

export default function ProjectPage() {
    const { id } = useParams();

    return (
        <ApiKeyCheck projectId={id as string}>
            <DashboardContent />
        </ApiKeyCheck>
    );
}