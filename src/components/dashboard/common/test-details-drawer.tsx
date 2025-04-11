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
import { AlertTriangleIcon, CalendarIcon, CheckIcon, TimerIcon, XIcon } from "lucide-react";

export interface TestHistory {
    date: string;
    status: "Pass" | "Fail";
}

export interface TestError {
    message: string;
    stack: string;
    screenshot?: string;
}

export interface TestDetails {
    id: string;
    name: string;
    module: string;
    failureType: string;
    failureRate: string;
    priority: "High" | "Medium" | "Low";
    lastRun: string;
    duration: string;
    error?: TestError;
    history: TestHistory[];
}

interface TestDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    test?: TestDetails;
}

export default function TestDetailsDrawer({ isOpen, onClose, test }: TestDetailsDrawerProps) {
    if (!test) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pass":
                return <CheckIcon className="h-4 w-4 text-green-500" />;
            case "Fail":
                return <XIcon className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "High":
                return <Badge className="bg-red-100 text-red-800">High</Badge>;
            case "Medium":
                return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
            case "Low":
                return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
            default:
                return null;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Bug":
                return <XIcon className="h-4 w-4 text-red-500" />;
            case "Flaky":
                return <AlertTriangleIcon className="h-4 w-4 text-amber-500" />;
            case "UI Change":
                return <AlertTriangleIcon className="h-4 w-4 text-blue-500" />;
            default:
                return <XIcon className="h-4 w-4 text-red-500" />;
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open: boolean) => !open && onClose()} direction="right" >
            <DrawerContent className="w-full md:min-w-[50vw] lg:min-w-[50vw] xl:min-w-[45vw] rounded-l-3xl">
                <DrawerHeader className="border-b pb-4">
                    <DrawerTitle className="flex items-center gap-2 text-xl font-semibold">
                        {getTypeIcon(test.failureType)}
                        <span className="truncate max-w-[90%]">{test.name}</span>
                        <Button variant="ghost" size="icon" className="ml-auto" onClick={onClose}>
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </DrawerTitle>

                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{test.module}</Badge>
                            {getPriorityBadge(test.priority)}
                            <Badge variant="outline" className="flex items-center gap-1">
                                <TimerIcon className="h-3 w-3" />
                                {test.duration}
                            </Badge>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {test.lastRun}
                        </Badge>
                    </div>
                </DrawerHeader>

                <div className="p-4 overflow-auto">
                    <Tabs defaultValue="details">
                        <TabsList className="mb-4">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="error">Error</TabsTrigger>
                            <TabsTrigger value="history">History</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium mb-2">Failure Type</h3>
                                <div className="p-3 bg-muted rounded-md">
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(test.failureType)}
                                        <span>{test.failureType}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Failure Rate</h3>
                                <div className="p-3 bg-muted rounded-md">{test.failureRate}</div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Priority</h3>
                                <div className="p-3 bg-muted rounded-md flex items-center">
                                    {getPriorityBadge(test.priority)}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Last Run</h3>
                                <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    {test.lastRun}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="error" className="space-y-4">
                            {test.error ? (
                                <>
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Error Message</h3>
                                        <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                                            {test.error.message}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Stack Trace</h3>
                                        <pre className="p-3 bg-muted rounded-md font-mono text-xs overflow-x-auto whitespace-pre">
                                            {test.error.stack}
                                        </pre>
                                    </div>

                                    {test.error.screenshot && (
                                        <div>
                                            <h3 className="text-sm font-medium mb-2">Screenshot</h3>
                                            <div className="p-3 bg-muted rounded-md">
                                                <div className="bg-gray-200 rounded-md h-48 flex items-center justify-center">
                                                    <span className="text-gray-500">Screenshot placeholder</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="p-4 text-center text-muted-foreground">
                                    No error details available
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="history" className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium mb-2">Recent Test Runs</h3>
                                <div className="bg-muted rounded-md overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-3 font-medium">Date</th>
                                                <th className="text-right p-3 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {test.history.map((run, idx) => (
                                                <tr key={idx} className="border-b last:border-0">
                                                    <td className="p-3">{run.date}</td>
                                                    <td className="p-3 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {getStatusIcon(run.status)}
                                                            <span className={run.status === "Pass" ? "text-green-600" : "text-red-600"}>
                                                                {run.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <DrawerFooter className="border-t pt-4">
                    <div className="flex gap-2">
                        <Button className="flex-1">Mark as Fixed</Button>
                        <Button variant="outline" className="flex-1">Assign</Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
} 