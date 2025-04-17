"use client"

import { cn } from "@/lib/utils"
import { IconMenu2 } from "@tabler/icons-react"
import { useSidebarState } from "@/lib/sidebar-state"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { LogoutButton } from "@/components/auth/logout-button";
import { useProject } from "@/contexts/project-context";

export function SiteHeader({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { sidebarVisible, setSidebarVisible } = useSidebarState()
  const { user } = useAuth();
  const { currentProject } = useProject();

  return (
    <header
      className={cn(
        "flex h-14 justify-between items-center gap-2 border-b bg-background px-4 lg:px-3",
        className
      )}
      {...props}
    >
      {!sidebarVisible && (
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 h-8 w-8"
          onClick={() => setSidebarVisible(true)}
        >
          <IconMenu2 className="h-4 w-4" />
          <span className="sr-only">Show Sidebar</span>
        </Button>
      )}
      <div className="flex items-center">
        <Link href="/" className="text-base font-semibold">TestFlowX</Link>
        {currentProject && (
          <div className="flex items-center">
            <span className="text-muted-foreground mx-2">/</span>
            <Link href={`/projects/${currentProject.id}`} className="text-base font-medium">{currentProject.name}</Link>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={`${user?.firstName}` || "User"} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{`${user?.firstName}` || "My Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile/">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}
