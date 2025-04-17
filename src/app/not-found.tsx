"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/95 p-3">
            <div className="w-full max-w-lg bg-card border border-border/40 rounded-lg shadow-sm p-8 mx-auto">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/5 mb-2">
                        <span className="text-2xl font-semibold text-primary">404</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Page Not Found</h1>
                        <p className="text-muted-foreground text-sm max-w-md">
                            We couldn&apos;t locate the resource you&apos;re looking for. It may have been moved,
                            deleted, or the URL might be incorrect.
                        </p>
                    </div>

                    <div className="w-full max-w-xs pt-4 flex flex-col space-y-3">
                        <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90">
                            <Link href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Return to Dashboard
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </div>

                    <div className="w-full border-t border-border pt-6 mt-2">
                        <p className="text-xs text-muted-foreground/70">
                            If you need assistance, please contact our support team.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 