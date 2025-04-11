'use client';

import DashboardLayout from "@/app/dashboard-layout";
import { useProject } from "@/contexts/project-context";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ProjectLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { id } = useParams();
    const { fetchProject, loading } = useProject();
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!fetchedRef.current && id && typeof id === 'string') {
            fetchProject(id);
            fetchedRef.current = true;
        }
    }, [id, fetchProject]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center">Loading project data...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
} 