"use client";

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
import { useSidebar } from "@/components/ui/sidebar";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { PanelLeftCloseIcon, PanelLeftIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
    const { toggleSidebar, open } = useSidebar();
    const { user, isSignedIn } = useUser();

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:px-3 shadow-sm">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="hover:bg-muted"
                    aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {open ? (
                        <PanelLeftCloseIcon className="h-5 w-5" />
                    ) : (
                        <PanelLeftIcon className="h-5 w-5" />
                    )}
                </Button>
                <div className="font-semibold">Test Report Dashboard</div>
            </div>
            <div className="flex items-center gap-4">
                {isSignedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                                    <AvatarFallback>
                                        {user.firstName?.charAt(0) || <UserIcon className="h-5 w-5" />}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{user.fullName || "My Account"}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile/">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <SignOutButton />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <SignInButton mode="modal">
                        <Button variant="default" size="sm">Sign In</Button>
                    </SignInButton>
                )}
            </div>
        </header>
    );
} 