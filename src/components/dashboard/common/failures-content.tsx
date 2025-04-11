"use client";

import TestDetailsDrawer, { TestDetails } from "@/components/dashboard/common/test-details-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertTriangleIcon,
    FilterIcon,
    LineChartIcon,
    RefreshCwIcon,
    SearchIcon,
    XIcon
} from "lucide-react";
import { useState } from "react";

// Sample failure data based on the test data from tests-content.tsx
const testData: TestDetails[] = [
    {
        id: "1",
        name: "checkout/payment-gateway/ProcessTransaction",
        module: "Payment",
        failureType: "Bug",
        failureRate: "100% (12/12)",
        priority: "High",
        lastRun: "2 hours ago",
        duration: "3.5s",
        error: {
            message: "Error: TimeoutError: Navigation timeout of 30000 ms exceeded at /test/checkout/payment.spec.ts:120:12",
            stack: `
Error: TimeoutError: Navigation timeout of 30000 ms exceeded
    at /test/checkout/payment.spec.ts:120:12
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Function.retry (/node_modules/playwright/lib/utils.js:152:22)
    at async Page.waitForNavigation (/node_modules/playwright/lib/page.js:541:29)
    at async PaymentPage.completePayment (/src/pages/payment.ts:28:14)
    at async Context.<anonymous> (/test/checkout/payment.spec.ts:42:3)`,
            screenshot: "https://via.placeholder.com/800x600?text=Payment+Error+Screenshot"
        },
        history: [
            { date: "Apr 9, 2023 - 14:30", status: "Fail" },
            { date: "Apr 9, 2023 - 10:15", status: "Fail" },
            { date: "Apr 8, 2023 - 22:45", status: "Fail" },
            { date: "Apr 7, 2023 - 18:20", status: "Pass" },
            { date: "Apr 6, 2023 - 15:10", status: "Pass" }
        ]
    },
    {
        id: "2",
        name: "user-profile/LoginModule",
        module: "Profile",
        failureType: "Flaky",
        failureRate: "60% (6/10)",
        priority: "Medium",
        lastRun: "4 hours ago",
        duration: "2.1s",
        error: {
            message: "Error: Element is not visible: [data-testid=login-button] at /test/auth/login.spec.ts:45:8",
            stack: `
Error: Element is not visible: [data-testid=login-button]
    at /test/auth/login.spec.ts:45:8
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async LoginPage.submitLoginForm (/src/pages/login.ts:18:10)
    at async Context.<anonymous> (/test/auth/login.spec.ts:35:5)`,
            screenshot: "https://via.placeholder.com/800x600?text=Login+Error+Screenshot"
        },
        history: [
            { date: "Apr 9, 2023 - 12:15", status: "Fail" },
            { date: "Apr 9, 2023 - 08:30", status: "Pass" },
            { date: "Apr 8, 2023 - 23:45", status: "Fail" },
            { date: "Apr 8, 2023 - 20:20", status: "Pass" },
            { date: "Apr 8, 2023 - 16:10", status: "Fail" }
        ]
    },
    {
        id: "3",
        name: "product-search/ApplyFilters",
        module: "Search",
        failureType: "UI Change",
        failureRate: "100% (8/8)",
        priority: "Medium",
        lastRun: "6 hours ago",
        duration: "4.2s",
        error: {
            message: "Error: Unable to locate element: [data-testid=filter-dropdown] at /test/search/filters.spec.ts:78:10",
            stack: `
Error: Unable to locate element: [data-testid=filter-dropdown]
    at /test/search/filters.spec.ts:78:10
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async SearchPage.applyFilter (/src/pages/search.ts:32:12)
    at async Context.<anonymous> (/test/search/filters.spec.ts:62:7)`,
            screenshot: "https://via.placeholder.com/800x600?text=Search+Filter+Screenshot"
        },
        history: [
            { date: "Apr 9, 2023 - 10:30", status: "Fail" },
            { date: "Apr 9, 2023 - 06:45", status: "Fail" },
            { date: "Apr 8, 2023 - 22:15", status: "Fail" },
            { date: "Apr 8, 2023 - 18:30", status: "Fail" },
            { date: "Apr 8, 2023 - 14:10", status: "Pass" }
        ]
    }
];

export function FailuresContent() {
    const [selectedTest, setSelectedTest] = useState<TestDetails | undefined>(undefined);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const openTestDrawer = (test: TestDetails) => {
        setSelectedTest(test);
        setDrawerOpen(true);
    };

    const closeTestDrawer = () => {
        setDrawerOpen(false);
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

    const filteredTests = testData.filter(test =>
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.failureType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Failure Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-2">
                            <div className="flex justify-between items-center">
                                <span>122</span>
                                <span className="text-sm text-muted-foreground">Total Failures</span>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <XIcon className="h-4 w-4 text-red-500" />
                                    <span className="text-sm">Bugs</span>
                                </div>
                                <div className="text-sm font-medium">58 (47.5%)</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm">Flaky Tests</span>
                                </div>
                                <div className="text-sm font-medium">47 (38.5%)</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">UI Changes</span>
                                </div>
                                <div className="text-sm font-medium">17 (14.0%)</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Failure Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-2">
                            <div className="flex justify-between items-center">
                                <span>+18</span>
                                <span className="text-sm text-red-600">vs Last Week</span>
                            </div>
                        </div>
                        <div className="h-[100px] flex items-center justify-center border border-muted rounded-md bg-muted/10">
                            <LineChartIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Most Affected Modules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Payment</span>
                                <div className="text-sm">38 (31.1%)</div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-primary rounded-full h-2.5" style={{ width: '31.1%' }}></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Profile</span>
                                <div className="text-sm">26 (21.3%)</div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-primary rounded-full h-2.5" style={{ width: '21.3%' }}></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Search</span>
                                <div className="text-sm">19 (15.6%)</div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-primary rounded-full h-2.5" style={{ width: '15.6%' }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <TabsList className="w-full sm:w-auto bg-muted/70">
                        <TabsTrigger value="all">All Failures</TabsTrigger>
                        <TabsTrigger value="flaky">Flaky Tests</TabsTrigger>
                        <TabsTrigger value="recurring">Recurring Issues</TabsTrigger>
                    </TabsList>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-grow min-w-[200px]">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search failures..."
                                className="pl-8 h-9 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <FilterIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <RefreshCwIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <TabsContent value="all" className="m-0">
                    <Card className="border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle>All Failures</CardTitle>
                            <CardDescription>Complete list of all test failures</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-auto rounded-md border">
                                <table className="w-full caption-bottom text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="h-10 px-4 text-left font-medium">Issue</th>
                                            <th className="h-10 px-4 text-left font-medium">Test Name</th>
                                            <th className="h-10 px-4 text-left font-medium">Module</th>
                                            <th className="h-10 px-4 text-left font-medium">Failure Rate</th>
                                            <th className="h-10 px-4 text-left font-medium">Priority</th>
                                            <th className="h-10 px-4 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTests.length > 0 ? (
                                            filteredTests.map((test) => (
                                                <tr
                                                    key={test.id}
                                                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                                                    onClick={() => openTestDrawer(test)}
                                                >
                                                    <td className="p-2 pl-4">
                                                        <div className="flex items-center gap-2">
                                                            {getTypeIcon(test.failureType)}
                                                            <span>{test.failureType}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 pl-4 font-medium max-w-[300px] truncate">
                                                        {test.name}
                                                    </td>
                                                    <td className="p-2 pl-4">{test.module}</td>
                                                    <td className="p-2 pl-4">{test.failureRate}</td>
                                                    <td className="p-2 pl-4">
                                                        <Badge
                                                            className={`
                                                                ${test.priority === "High" ? "bg-red-100 text-red-800" : ""}
                                                                ${test.priority === "Medium" ? "bg-yellow-100 text-yellow-800" : ""}
                                                                ${test.priority === "Low" ? "bg-blue-100 text-blue-800" : ""}
                                                            `}
                                                        >
                                                            {test.priority}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-2 pr-4 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openTestDrawer(test);
                                                            }}
                                                        >
                                                            Details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="h-24 text-center text-muted-foreground">
                                                    No failures found matching your search criteria
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="flaky" className="m-0">
                    <Card className="border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle>Flaky Tests</CardTitle>
                            <CardDescription>Tests that pass and fail intermittently</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-auto rounded-md border">
                                <table className="w-full caption-bottom text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="h-10 px-4 text-left font-medium">Test Name</th>
                                            <th className="h-10 px-4 text-left font-medium">Module</th>
                                            <th className="h-10 px-4 text-left font-medium">Inconsistency Rate</th>
                                            <th className="h-10 px-4 text-left font-medium">Last 5 Runs</th>
                                            <th className="h-10 px-4 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTests.filter(test => test.failureType === "Flaky").length > 0 ? (
                                            filteredTests.filter(test => test.failureType === "Flaky").map((test) => (
                                                <tr
                                                    key={test.id}
                                                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                                                    onClick={() => openTestDrawer(test)}
                                                >
                                                    <td className="p-2 pl-4 font-medium max-w-[300px] truncate">
                                                        {test.name}
                                                    </td>
                                                    <td className="p-2 pl-4">{test.module}</td>
                                                    <td className="p-2 pl-4">{test.failureRate}</td>
                                                    <td className="p-2 pl-4">
                                                        <div className="flex gap-1.5">
                                                            {test.history.slice(0, 5).map((run, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`w-3.5 h-3.5 rounded-full ${run.status === "Pass" ? "bg-green-500" : "bg-red-500"}`}
                                                                    title={`${run.date}: ${run.status}`}
                                                                ></div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="p-2 pr-4 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openTestDrawer(test);
                                                            }}
                                                        >
                                                            Details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="h-24 text-center text-muted-foreground">
                                                    No flaky tests found matching your search criteria
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="recurring" className="m-0">
                    <Card className="border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle>Recurring Issues</CardTitle>
                            <CardDescription>Failures that have been seen multiple times</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-auto rounded-md border">
                                <table className="w-full caption-bottom text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="h-10 px-4 text-left font-medium">Error Pattern</th>
                                            <th className="h-10 px-4 text-left font-medium">Affected Tests</th>
                                            <th className="h-10 px-4 text-left font-medium">First Seen</th>
                                            <th className="h-10 px-4 text-left font-medium">Last Seen</th>
                                            <th className="h-10 px-4 text-left font-medium">Frequency</th>
                                            <th className="h-10 px-4 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b transition-colors hover:bg-muted/50 cursor-pointer">
                                            <td className="p-2 pl-4 font-medium max-w-[300px] truncate">
                                                TimeoutError: Navigation timeout exceeded
                                            </td>
                                            <td className="p-2 pl-4">12</td>
                                            <td className="p-2 pl-4">Apr 6, 2023</td>
                                            <td className="p-2 pl-4">Apr 9, 2023</td>
                                            <td className="p-2 pl-4">28 occurrences</td>
                                            <td className="p-2 pr-4 text-right">
                                                <Button variant="ghost" size="sm">Group</Button>
                                            </td>
                                        </tr>
                                        <tr className="border-b transition-colors hover:bg-muted/50 cursor-pointer">
                                            <td className="p-2 pl-4 font-medium max-w-[300px] truncate">
                                                Element is not visible: [data-testid=*]
                                            </td>
                                            <td className="p-2 pl-4">8</td>
                                            <td className="p-2 pl-4">Apr 8, 2023</td>
                                            <td className="p-2 pl-4">Apr 9, 2023</td>
                                            <td className="p-2 pl-4">16 occurrences</td>
                                            <td className="p-2 pr-4 text-right">
                                                <Button variant="ghost" size="sm">Group</Button>
                                            </td>
                                        </tr>
                                        <tr className="border-b transition-colors hover:bg-muted/50 cursor-pointer">
                                            <td className="p-2 pl-4 font-medium max-w-[300px] truncate">
                                                Unable to locate element: [data-testid=*]
                                            </td>
                                            <td className="p-2 pl-4">6</td>
                                            <td className="p-2 pl-4">Apr 8, 2023</td>
                                            <td className="p-2 pl-4">Apr 9, 2023</td>
                                            <td className="p-2 pl-4">14 occurrences</td>
                                            <td className="p-2 pr-4 text-right">
                                                <Button variant="ghost" size="sm">Group</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <TestDetailsDrawer
                isOpen={drawerOpen}
                onClose={closeTestDrawer}
                test={selectedTest}
            />
        </div>
    );
} 