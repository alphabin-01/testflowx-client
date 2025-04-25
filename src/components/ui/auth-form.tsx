"use client"

import { useState } from "react"
import { z } from "zod"
import Link from "next/link"
import { LockIcon, MailIcon, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-context"

const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const signupSchema = loginSchema.extend({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
})

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
    const { login, signup } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validateForm = () => {
        try {
            if (mode === "login") {
                loginSchema.parse(formData)
            } else {
                signupSchema.parse(formData)
            }
            setErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message
                    }
                })
                setErrors(newErrors)
            }
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsLoading(true)
        try {
            if (mode === "login") {
                await login(formData.email, formData.password)
            } else {
                await signup(
                    formData.email,
                    formData.password,
                    formData.firstName,
                    formData.lastName
                )
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all">
            <div className="space-y-4 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-primary/10 p-4 backdrop-blur-sm">
                        <UserIcon size={28} className="text-primary" />
                    </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {mode === "login" ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                    {mode === "login"
                        ? "Enter your credentials to sign in to your account"
                        : "Enter your information to create an account"}
                </p>
            </div>
            
            <div className="my-8 h-px bg-border" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "signup" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={`h-11 transition-all ${errors.firstName ? 'border-destructive ring-1 ring-destructive' : ''}`}
                            />
                            {errors.firstName && <p className="text-xs font-medium text-destructive">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={`h-11 transition-all ${errors.lastName ? 'border-destructive ring-1 ring-destructive' : ''}`}
                            />
                            {errors.lastName && <p className="text-xs font-medium text-destructive">{errors.lastName}</p>}
                        </div>
                    </div>
                )}
                
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MailIcon size={18} className="text-muted-foreground" />
                        </div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`pl-10 h-11 transition-all ${errors.email ? 'border-destructive ring-1 ring-destructive' : ''}`}
                        />
                    </div>
                    {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    </div>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockIcon size={18} className="text-muted-foreground" />
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`pl-10 h-11 transition-all ${errors.password ? 'border-destructive ring-1 ring-destructive' : ''}`}
                        />
                    </div>
                    {errors.password && <p className="text-xs font-medium text-destructive">{errors.password}</p>}
                </div>

                <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-semibold transition-all"
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Sign Up"}
                </Button>
            </form>

            <div className="mt-8 space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <div className="text-center">
                    {mode === "login" ? (
                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/sign-up" className="font-medium text-primary hover:underline transition-colors">
                                Sign up
                            </Link>
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/sign-in" className="font-medium text-primary hover:underline transition-colors">
                                Sign in
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}