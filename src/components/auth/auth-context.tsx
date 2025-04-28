"use client"

import { API_ENDPOINTS } from "@/lib/api"
import { apiRequest, STATUS } from "@/lib/api-client"
import { getPingUrl } from "@/lib/api-config"
import { useRouter } from "next/navigation"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

interface User {
    id: string
    email: string
    firstName?: string
    lastName?: string
}

interface LoginData {
    token: string
    user: User
}

interface RegisterResponse {
    success: boolean
    message: string
    data?: User
    error?: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_TOKEN_KEY = 'auth_token'
const USER_DATA_KEY = 'user_data'
const REDIRECT_KEY = 'redirectAfterLogin'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    setInterval(() => {
        fetch(getPingUrl())
          .catch(error => console.error('Error pinging server', error));
      }, 5 * 60 * 1000); // every 5 minutes

    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem(AUTH_TOKEN_KEY)
            if (token) {
                try {
                    const userJson = localStorage.getItem(USER_DATA_KEY)
                    if (userJson) {
                        setUser(JSON.parse(userJson))
                    }
                } catch (error) {
                    console.error("Invalid session", error)
                    localStorage.removeItem(AUTH_TOKEN_KEY)
                    localStorage.removeItem(USER_DATA_KEY)
                }
            }
            setIsLoading(false)
        }

        checkSession()
    }, [])

    const handleAuthToken = (token: string) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`
    }

    const handleUserData = (userData: User) => {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
        setUser(userData)
    }

    const handleRedirect = () => {
        const redirectUrl = localStorage.getItem(REDIRECT_KEY)
        if (redirectUrl) {
            localStorage.removeItem(REDIRECT_KEY)
            router.push(redirectUrl)
        } else {
            router.push("/")
        }
    }

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true)
        try {
            const res = await apiRequest<LoginData>(API_ENDPOINTS.auth.login, {
                method: 'POST',
                body: { email, password }
            })

            if (res.status === STATUS.SUCCESS) {
                const { token, user: userData } = res.data

                if (!token || !userData) {
                    throw new Error('Invalid response format')
                }

                handleAuthToken(token)
                handleUserData(userData)
                toast.success("Successfully logged in!")
                handleRedirect()
                return
            }

            throw new Error(res.status === STATUS.ERROR ? res.error.message : "Login failed")
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<void> => {
        setIsLoading(true)
        try {
            const res = await apiRequest<RegisterResponse>(API_ENDPOINTS.auth.register, {
                method: 'POST',
                body: { email, password, firstName, lastName }
            })

            if (res.status === STATUS.SUCCESS) {
                toast.success("Account created successfully! Please sign in.")
                router.push("/sign-in")
                return
            }

            throw new Error(res.status === STATUS.ERROR ? res.error.message : "Signup failed")
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(USER_DATA_KEY)
        document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
        router.push("/sign-in")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}