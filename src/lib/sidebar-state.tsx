"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

type SidebarStateContextType = {
    sidebarVisible: boolean
    setSidebarVisible: (visible: boolean) => void
    sidebarWidth: string
}

const SidebarStateContext = createContext<SidebarStateContextType | undefined>(undefined)

export function SidebarStateProvider({ children }: { children: ReactNode }) {
    const [sidebarVisible, setSidebarVisible] = useState(true)

    // Load sidebar state from localStorage if available
    useEffect(() => {
        const storedState = localStorage.getItem('sidebarVisible')
        if (storedState !== null) {
            setSidebarVisible(storedState === 'true')
        }
    }, [])

    // Save sidebar state to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('sidebarVisible', String(sidebarVisible))
    }, [sidebarVisible])

    // Calculate sidebar width based on visibility
    const sidebarWidth = sidebarVisible ? '240px' : '0px'

    return (
        <SidebarStateContext.Provider value={{
            sidebarVisible,
            setSidebarVisible,
            sidebarWidth
        }}>
            {children}
        </SidebarStateContext.Provider>
    )
}

export function useSidebarState() {
    const context = useContext(SidebarStateContext)
    if (context === undefined) {
        throw new Error("useSidebarState must be used within a SidebarStateProvider")
    }
    return context
}