"use client"

import {
    IconBolt,
    IconChartLine,
    IconFlask,
    IconHistory,
    IconHome,
    IconList,
    IconMoodSad,
    IconSettings,
    IconX
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarNav
} from "@/components/ui/sidebar"
import { useSidebarState } from "@/lib/sidebar-state"
import { KeyIcon } from "lucide-react"
import { useParams } from "next/navigation"

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

    // Define dashboard links
    const dashboardLinks = [
        {
            title: "Dashboard",
            href: `/projects/${projectId}`,
            icon: <IconHome className="h-4 w-4" />,
            variant: "default" as const,
        },
        {
            title: "AI Analytics",
            href: `/projects/${projectId}/insights`,
            icon: <IconChartLine className="h-4 w-4" />,
            variant: "default" as const,
        },
    ];

    // Define tests links
    const testsLinks = [
        {
            title: "Latest Runs",
            href: `/projects/${projectId}/tests`,
            icon: <IconHistory className="h-4 w-4" />,
            variant: "default" as const,
        }
    ];

    const othersLinks = [
        {
            title: "Api Keys",
            href: `/projects/${projectId}/api-keys`,
            icon: <KeyIcon className="h-4 w-4" />,
            variant: "default" as const,
        }
    ];

    return (
        <Sidebar
            variant={variant}
            collapsible={collapsible}
            className={`border-r bg-background relative p-0`}
        >
            <SidebarHeader className="flex h-14 flex-row items-center border-b bg-gradient-to-r from-primary/10 to-background p-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shadow-sm transition-colors hover:bg-primary/20">
                        <IconHome className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-md font-semibold">
                        TestPluse
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => setSidebarVisible(false)}
                >
                    <IconX className="h-4 w-4" />
                    <span className="sr-only">Close Sidebar</span>
                </Button>
            </SidebarHeader>
            <SidebarContent className="py-3">
                <div className="mb-4">
                    <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider">DASHBOARD</h3>
                    </div>
                    <SidebarNav links={dashboardLinks} />
                </div>

                <div>
                    <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider">TESTS</h3>
                    </div>
                    <SidebarNav links={testsLinks} />
                </div>

                <div>
                    <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider">OTHERS</h3>
                    </div>
                    <SidebarNav links={othersLinks} />
                </div>
            </SidebarContent>
        </Sidebar>
    )
}
