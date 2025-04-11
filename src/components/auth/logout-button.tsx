"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-context"

export function LogoutButton() {
    const { logout } = useAuth()

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="text-sm font-medium text-red-500"
        >
            Sign Out
        </Button>
    )
} 