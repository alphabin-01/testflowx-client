"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './auth-context'
import { Loader } from '../ui/loader'
// Routes that authenticated users shouldn't access (login/signup pages)
const authRoutes = ['/sign-in', '/sign-up']

// Routes that require authentication
const protectedRoutes = ['/', '/dashboard', '/analytics', '/tests', '/failures', '/settings']

interface AuthGuardProps {
    children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Don't redirect while still loading
        if (isLoading) return

        const isAuthRoute = authRoutes.includes(pathname)
        const isProtectedRoute = protectedRoutes.some(route =>
            pathname === route || pathname.startsWith(`${route}/`)
        )

        if (user) {
            // If user is logged in and tries to access auth routes, redirect to dashboard
            if (isAuthRoute) {
                router.push('/')
            }
        } else {
            // If user is not logged in and tries to access protected routes, redirect to login
            if (isProtectedRoute) {
                // Save the attempted URL for later redirect after login
                if (typeof window !== 'undefined') {
                    localStorage.setItem('redirectAfterLogin', pathname)
                }
                router.push('/sign-in')
            }
        }
    }, [user, isLoading, pathname, router])

    // Show nothing while checking authentication
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        )
    }

    return <>{children}</>
} 