"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export type TabType = "dashboard" | "tests" | "analytics" | "failures" | "history" | "environments" | "users" | "tasks" | "settings";
export type ContentTabType = "overview" | "analytics" | "tests" | "failures" | "history" | "environments";

interface DashboardContextType {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    contentTab: ContentTabType;
    setContentTab: (tab: ContentTabType) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
    children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");
    const [contentTab, setContentTab] = useState<ContentTabType>("overview");

    // Sync sidebar and content tabs
    const handleSetActiveTab = (tab: TabType) => {
        setActiveTab(tab);

        // Map sidebar tabs to content tabs
        if (tab === "dashboard") {
            setContentTab("overview");
        } else if (tab === "analytics") {
            setContentTab("analytics");
        } else if (tab === "tests") {
            setContentTab("tests");
        } else if (tab === "failures") {
            setContentTab("failures");
        } else if (tab === "history") {
            setContentTab("history");
        } else if (tab === "environments") {
            setContentTab("environments");
        }
    };

    return (
        <DashboardContext.Provider
            value={{
                activeTab,
                setActiveTab: handleSetActiveTab,
                contentTab,
                setContentTab
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
} 