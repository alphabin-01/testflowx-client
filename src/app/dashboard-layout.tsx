'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/sidebar/sidebar";
import { SiteHeader } from "@/components/dashboard/header/site-header";
import { SidebarStateProvider } from "@/lib/sidebar-state";
import { useSidebarState } from "@/lib/sidebar-state";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarStateProvider>
            <SidebarProvider defaultOpen={true}>
                <LayoutContent>
                    {children}
                </LayoutContent>
            </SidebarProvider>
        </SidebarStateProvider>
    );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { sidebarVisible, sidebarWidth } = useSidebarState();

    return (
        <div className="flex h-screen overflow-hidden w-full">
            {/* Sidebar - will be toggled via SidebarTrigger */}
            <AppSidebar variant="inset" collapsible="offcanvas" />

            {/* Content area */}
            <div
                className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300"
                style={{
                    marginLeft: sidebarVisible ? '0' : '0',
                    width: sidebarVisible ? `calc(100% - ${sidebarWidth})` : '100%'
                }}
            >
                <SiteHeader className="flex-none h-14 border-b" />
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
} 