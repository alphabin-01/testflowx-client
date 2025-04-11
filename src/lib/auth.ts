import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Utility function to check if user is authenticated
 * and redirect to sign-in if not
 */
export async function requireAuth() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    return user.id;
}

/**
 * Utility function to check if user is authenticated
 * but doesn't redirect
 */
export async function checkAuth() {
    const user = await currentUser();
    return !!user;
} 