"use client";

import { DashboardContent } from "@/components/dashboard/content/overview";

type ProjectContentProps = {
    projectId: string;
    projectName: string;
};

export function ProjectContent({ projectId, projectName }: ProjectContentProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{projectName}</h1>
            <div id={`project-${projectId}`}>
                <DashboardContent />
            </div>
        </div>
    );
}