"use client"

import {
    IconAlertTriangle,
    IconFlask,
    IconHelp,
    IconHome,
    IconInnerShadowTop,
    IconKey,
    IconLayoutDashboard,
    IconSettings,
    IconX
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { NavSecondary } from "@/components/ui/nav-secondary"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarNav
} from "@/components/ui/sidebar"
import { useSidebarState } from "@/lib/sidebar-state"
import { useParams } from "next/navigation"

const data = {
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        }
    ],
}

export function AppSidebar({
    variant = "inset",
    collapsible = "offcanvas"
}: {
    variant?: "inset" | "sidebar" | "floating";
    collapsible?: "offcanvas" | "icon" | "none";
}) {
    const { sidebarVisible, setSidebarVisible } = useSidebarState();
    const params = useParams();
    const projectId = params?.id as string;

    if (!sidebarVisible) {
        return null;
    }

    // Define base routes and project-specific routes
    const dashboardLinks = [
        {
            title: "Dashboard",
            href: `/projects/${projectId}`,
            icon: <IconHome className="h-4 w-4" />,
            variant: "default" as const,
        },
        {
            title: "Analytics",
            href: `/projects/${projectId}/analytics`,
            icon: <IconLayoutDashboard className="h-4 w-4" />,
            variant: "default" as const,
        },
        {
            title: "Tests",
            href: `/projects/${projectId}/tests`,
            icon: <IconFlask className="h-4 w-4" />,
            variant: "default" as const,
        },
        {
            title: "Failures",
            href: `/projects/${projectId}/failures`,
            icon: <IconAlertTriangle className="h-4 w-4" />,
            variant: "default" as const,
        },
        {
            title: "API Keys",
            href: `/projects/${projectId}/api-keys`,
            icon: <IconKey className="h-4 w-4" />,
            variant: "default" as const,
        },
    ];

    return (
        <Sidebar
            variant={variant}
            collapsible={collapsible}
            className={`border-r bg-background relative p-0`}
        >
            <SidebarHeader className="flex h-14 flex-row items-center border-b p-3">
                <div className="flex items-center gap-2">
                    <IconInnerShadowTop className="h-6 w-6" />
                    <span className="font-semibold">TestFlowX</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-8 w-8"
                    onClick={() => setSidebarVisible(false)}
                >
                    <IconX className="h-4 w-4" />
                    <span className="sr-only">Close Sidebar</span>
                </Button>
            </SidebarHeader>
            <SidebarContent className="py-3">
                <SidebarNav
                    links={dashboardLinks}
                />

                <NavSecondary items={data.navSecondary} className="mt-auto" />

            </SidebarContent>
        </Sidebar>
    )
}
