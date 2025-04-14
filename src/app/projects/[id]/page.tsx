'use client';

import { ApiKeyCheck } from "@/components/dashboard/api-keys/api-key-check";
import Overview from "@/components/dashboard/overview/overview";
import { useParams } from "next/navigation";

export default function ProjectPage() {
    const { id } = useParams();

    return (
        <ApiKeyCheck projectId={id as string}>
            <Overview />
        </ApiKeyCheck>
    );
}