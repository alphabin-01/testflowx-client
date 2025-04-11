"use client";

import { SignOutButton, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
    const { signOut } = useClerk()

    return (
        <SignOutButton>
            <Button variant="outline" size="sm" onClick={() => {
                    signOut();
            }}>
                Sign Out
            </Button>
        </SignOutButton>
    );
} 