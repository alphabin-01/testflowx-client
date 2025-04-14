'use client';

import { ApiKeyCheck } from "@/components/dashboard/api-keys/api-key-check";
import BreadcrumbNav from "@/components/dashboard/component/breadcumb";
import { AnalyticsContent } from "@/components/dashboard/analytics/analytics";
import { ChartBar, HomeIcon } from "lucide-react";
import { useParams } from "next/navigation";

export default function AnalyticsPage() {
    const { id } = useParams();
    const breadcrumbLinks = [
        { label: "Home", href: `/projects/${id}`, icon: <HomeIcon size={16} /> },
        { label: "Analytics", icon: <ChartBar size={16} /> },
    ];
    return (
        <ApiKeyCheck projectId={id as string}>

            <div className="flex flex-col gap-8 p-8">
                <BreadcrumbNav links={breadcrumbLinks} />
                <div className="flex flex-col space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">
                        Visualize your test metrics and performance
                    </p>
                </div>

                <AnalyticsContent />
            </div>
        </ApiKeyCheck>
    );
} 