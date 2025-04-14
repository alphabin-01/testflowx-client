'use client';

import TestRunPage from "@/components/dashboard/all-tests/details";
import { useParams } from "next/navigation";    

export default function TestsPage() {
    const { id } = useParams();

    return (
        <TestRunPage projectId={id as string} />
    );
} 