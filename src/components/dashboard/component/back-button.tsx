"use client";

import { Button } from "@/components/ui/button";

export default function BackButton() {
    return (
        <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="sm"
        >
            Back
        </Button>
    );
} 