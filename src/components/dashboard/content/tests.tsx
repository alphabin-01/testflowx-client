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
    PlusIcon,
    RefreshCwIcon,
    SearchIcon,
    XIcon
} from "lucide-react";
import React, { useState } from "react";

// Status and Type Utilities
const StatusBadges = {
    Pass: <Badge className="bg-green-100 text-green-800">Pass</Badge>,
    Fail: <Badge className="bg-red-100 text-red-800">Fail</Badge>,
    Flaky: <Badge className="bg-amber-100 text-amber-800">Flaky</Badge>
};

const TypeIcons = {
    Bug: <XIcon className="h-4 w-4 text-red-500" />,
    Flaky: <AlertTriangleIcon className="h-4 w-4 text-amber-500" />,
    "UI Change": <AlertTriangleIcon className="h-4 w-4 text-blue-500" />
};

const PriorityBadges = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-blue-100 text-blue-800"
};

// Sample test data
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

// Helper components and functions
function TestTableHeader({ columns }: Readonly<{ columns: string[] }>) {
    return (
        <thead>
            <tr className="border-b bg-muted/50">
                {columns.map((column: string) => (
                    <th key={column} className="h-10 px-4 text-left font-medium">
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

function EmptyTestRow({ message, colSpan }: Readonly<{ message: string, colSpan: number }>) {
    return (
        <tr>
            <td colSpan={colSpan} className="h-24 text-center text-muted-foreground">
                {message}
            </td>
        </tr>
    );
}

function SearchAndFilterControls({
    searchQuery,
    setSearchQuery
}: Readonly<{
    searchQuery: string,
    setSearchQuery: (query: string) => void
}>) {
    return (
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow min-w-[200px]">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tests..."
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
                <Button size="sm" className="gap-1 h-9">
                    <PlusIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">New Test</span>
                </Button>
            </div>
        </div>
    );
}

type TestRowRenderer = (test: TestDetails) => React.ReactNode;

function TestsTable({
    tests,
    columns,
    renderRow,
    emptyMessage
}: Readonly<{
    tests: TestDetails[],
    columns: string[],
    renderRow: TestRowRenderer,
    emptyMessage: string
}>) {
    return (
        <div className="overflow-auto rounded-md border">
            <table className="w-full caption-bottom text-sm">
                <TestTableHeader columns={columns} />
                <tbody>
                    {tests.length > 0 ? (
                        tests.map(renderRow)
                    ) : (
                        <EmptyTestRow
                            message={emptyMessage}
                            colSpan={columns.length}
                        />
                    )}
                </tbody>
            </table>
        </div>
    );
}

function TestsTabCard({
    title,
    description,
    children
}: Readonly<{
    title: string,
    description: string,
    children: React.ReactNode
}>) {
    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export function TestsContent() {
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

    // Filter tests based on search query
    const filteredTests = testData.filter(test =>
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.failureType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get tests with failing status
    const failingTests = filteredTests.filter(test => test.history[0].status === "Fail");

    // Table column definitions
    const recentColumns = ["Status", "Test Name", "Module", "Duration", "Last Run", "Actions"];
    const failureColumns = ["Issue", "Test Name", "Module", "Failure Rate", "Priority", "Actions"];

    // Row renderer functions
    const renderRecentRow = (test: TestDetails) => (
        <tr
            key={test.id}
            className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
            onClick={() => openTestDrawer(test)}
        >
            <td className="p-2 pl-4">
                {StatusBadges[test.history[0].status as keyof typeof StatusBadges]}
            </td>
            <td className="p-2 pl-4 font-medium max-w-[300px] truncate">
                {test.name}
            </td>
            <td className="p-2 pl-4">{test.module}</td>
            <td className="p-2 pl-4">{test.duration}</td>
            <td className="p-2 pl-4 text-muted-foreground">{test.lastRun}</td>
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
    );

    const renderFailureRow = (test: TestDetails) => (
        <tr
            key={test.id}
            className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
            onClick={() => openTestDrawer(test)}
        >
            <td className="p-2 pl-4">
                <div className="flex items-center gap-2">
                    {TypeIcons[test.failureType as keyof typeof TypeIcons] || TypeIcons.Bug}
                    <span>{test.failureType}</span>
                </div>
            </td>
            <td className="p-2 pl-4 font-medium max-w-[300px] truncate">
                {test.name}
            </td>
            <td className="p-2 pl-4">{test.module}</td>
            <td className="p-2 pl-4">{test.failureRate}</td>
            <td className="p-2 pl-4">
                <Badge className={PriorityBadges[test.priority] || PriorityBadges.Medium}>
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
    );

    return (
        <div className="space-y-6">
            <Tabs defaultValue="recent" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <TabsList className="w-full sm:w-auto bg-muted/70">
                        <TabsTrigger value="recent">Recent Runs</TabsTrigger>
                        <TabsTrigger value="failures">Failures</TabsTrigger>
                        <TabsTrigger value="all">All Tests</TabsTrigger>
                    </TabsList>

                    <SearchAndFilterControls
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </div>

                <TabsContent value="recent" className="m-0">
                    <TestsTabCard
                        title="Recent Test Runs"
                        description="Latest test executions across all modules"
                    >
                        <TestsTable
                            tests={filteredTests}
                            columns={recentColumns}
                            renderRow={renderRecentRow}
                            emptyMessage="No tests found matching your search criteria"
                        />
                    </TestsTabCard>
                </TabsContent>

                <TabsContent value="failures" className="m-0">
                    <TestsTabCard
                        title="Test Failures"
                        description="Tests that are currently failing"
                    >
                        <TestsTable
                            tests={failingTests}
                            columns={failureColumns}
                            renderRow={renderFailureRow}
                            emptyMessage="No failing tests found matching your search criteria"
                        />
                    </TestsTabCard>
                </TabsContent>

                <TabsContent value="all" className="m-0">
                    <TestsTabCard
                        title="All Tests"
                        description="Complete test suite"
                    >
                        <div className="h-80 flex items-center justify-center rounded-md border bg-muted/20">
                            <div className="text-center text-muted-foreground">
                                <p>Full test suite listing will be displayed here</p>
                            </div>
                        </div>
                    </TestsTabCard>
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