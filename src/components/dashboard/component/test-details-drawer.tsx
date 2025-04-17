"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestCase } from "@/lib/typers";
import {
    AlertTriangleIcon,
    CalendarIcon,
    CheckCircle2,
    ClockIcon,
    RefreshCw,
    TimerIcon,
    XCircle,
    XIcon
} from "lucide-react";

export interface TestError {
    message: string;
    stack: string;
    screenshot?: string;
}

interface TestDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    test?: TestCase;
}

export default function TestDetailsDrawer({ isOpen, onClose, test }: TestDetailsDrawerProps) {
    if (!test) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "passed":
            case "completed":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case "failed":
                return <XCircle className="h-4 w-4 text-red-500" />;
            case "running":
                return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
            case "flaky":
                return <AlertTriangleIcon className="h-4 w-4 text-amber-500" />;
            case "skipped":
                return <AlertTriangleIcon className="h-4 w-4 text-slate-400" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "passed":
            case "completed":
                return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
            case "failed":
                return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
            case "running":
                return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
            case "flaky":
                return <Badge className="bg-amber-100 text-amber-800">Flaky</Badge>;
            case "skipped":
                return <Badge className="bg-slate-100 text-slate-800">Skipped</Badge>;
            default:
                return <Badge className="bg-slate-100 text-slate-800">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Format duration helper
    const formatDuration = (ms: number) => {
        if (!ms) return "N/A";
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(1);
        return `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open: boolean) => !open && onClose()} direction="right" >
            <DrawerContent className="w-full md:min-w-[50vw] lg:min-w-[50vw] xl:min-w-[45vw] rounded-l-3xl">
                <DrawerHeader className="border-b pb-4">
                    <DrawerTitle className="flex items-center gap-2 text-xl font-semibold">
                        {getStatusIcon(test.status)}
                        <span className="truncate max-w-[90%]">{test.title}</span>
                        <Button variant="ghost" size="icon" className="ml-auto" onClick={onClose}>
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </DrawerTitle>

                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            {test.fullTitle && test.fullTitle !== test.title && (
                                <Badge variant="outline">{test.fullTitle}</Badge>
                            )}
                            {getStatusBadge(test.status)}
                            <Badge variant="outline" className="flex items-center gap-1">
                                <TimerIcon className="h-3 w-3" />
                                {formatDuration(test.duration)}
                            </Badge>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {formatDate(test.startTime)}
                        </Badge>
                    </div>
                </DrawerHeader>

                <div className="p-4 overflow-auto">
                    <Tabs defaultValue="details">
                        <TabsList className="mb-4">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            {test.error && <TabsTrigger value="error">Error</TabsTrigger>}
                            {(test.console && test.console.length > 0) && <TabsTrigger value="console">Console</TabsTrigger>}
                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Status</h3>
                                    <div className="p-3 bg-muted rounded-md">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(test.status)}
                                            <span className="capitalize">{test.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Duration</h3>
                                    <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                                        <ClockIcon className="h-4 w-4" />
                                        {formatDuration(test.duration)}
                                    </div>
                                </div>

                                {test.startTime && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Start Time</h3>
                                        <div className="p-3 bg-muted rounded-md">
                                            {formatDate(test.startTime)}
                                        </div>
                                    </div>
                                )}

                                {test.endTime && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">End Time</h3>
                                        <div className="p-3 bg-muted rounded-md">
                                            {formatDate(test.endTime)}
                                        </div>
                                    </div>
                                )}

                                {test.retries !== undefined && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Retries</h3>
                                        <div className="p-3 bg-muted rounded-md">
                                            {test.retries}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Created At</h3>
                                    <div className="p-3 bg-muted rounded-md">
                                        {formatDate(test.createdAt)}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Updated At</h3>
                                    <div className="p-3 bg-muted rounded-md">
                                        {formatDate(test.updatedAt)}
                                    </div>
                                </div>

                                {test.metadata && (
                                    <div className="col-span-2">
                                        <h3 className="text-sm font-medium mb-2">Metadata</h3>
                                        <div className="p-3 bg-muted rounded-md">
                                            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                                                {JSON.stringify(test.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {test.error && (
                            <TabsContent value="error" className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Error Message</h3>
                                    <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                                        {test.error}
                                    </div>
                                </div>
                            </TabsContent>
                        )}

                        {(test.console && test.console.length > 0) && (
                            <TabsContent value="console" className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Console Output</h3>
                                    <pre className="p-3 bg-muted rounded-md font-mono text-xs overflow-x-auto whitespace-pre max-h-60 overflow-y-auto">
                                        {test.console.join('\n')}
                                    </pre>
                                </div>
                            </TabsContent>
                        )}
                    </Tabs>
                </div>

                <DrawerFooter className="border-t pt-4">
                    <div className="flex gap-2">
                        <Button className="flex-1">
                            {test.status === 'failed' ? 'Mark as Fixed' : 'Rerun Test'}
                        </Button>
                        <Button variant="outline" className="flex-1">
                            View Full Details
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
} 