"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    CheckCircleIcon,
    TrendingUpIcon,
    XCircleIcon
} from "lucide-react";
import React from "react";

// Summary Card Component
function SummaryCard({ title, value, change, icon, isPositive }: Readonly<{ title: string, value: string, change: string, icon: React.ReactNode, isPositive: boolean }>) {
    return (
        <Card className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                    {isPositive ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    <span>{change}</span>
                </p>
            </CardContent>
        </Card>
    );
}

// Main Dashboard Content Component
export function DashboardContent() {
    // Summary cards data
    const summaryCardsData = [
        {
            title: "Total Tests",
            value: "2,347",
            change: "+23 compared to last week",
            icon: <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />,
            isPositive: true
        },
        {
            title: "Pass Rate",
            value: "94.8%",
            change: "+1.2% compared to last week",
            icon: <CheckCircleIcon className="h-4 w-4 text-green-500" />,
            isPositive: true
        },
        {
            title: "Failed Tests",
            value: "122",
            change: "+18 compared to last week",
            icon: <XCircleIcon className="h-4 w-4 text-destructive" />,
            isPositive: false
        }
    ];

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Test Dashboard</h1>
                <p className="text-muted-foreground">
                    Track and analyze your automated test results
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                {summaryCardsData.map((card) => (
                    <SummaryCard
                        key={card.title}
                        title={card.title}
                        value={card.value}
                        change={card.change}
                        icon={card.icon}
                        isPositive={card.isPositive}
                    />
                ))}
            </div>

            {/* Test Duration and Failure Categories */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
                <TestDurationChart />
                <FailureCategories />
            </div>

            {/* Failed Tests Table */}
            <div className="mb-6">
                <FailedTestsTable />
            </div>
        </div>
    );
}

// Test Duration Chart Component
function TestDurationChart() {
    const [chartData, setChartData] = React.useState<Array<{ height: number, hours: number, minutes: number }>>([]);

    // Generate data only on the client side
    React.useEffect(() => {
        const data = Array.from({ length: 14 }).map(() => {
            return {
                height: 20 + Math.random() * 70,
                hours: Math.floor(2 + Math.random() * 3),
                minutes: Math.floor(Math.random() * 60)
            };
        });
        setChartData(data);
    }, []);

    return (
        <Card className="shadow-sm transition-shadow hover:shadow-md h-full">
            <CardHeader>
                <CardTitle className="text-lg">Test Duration</CardTitle>
                <CardDescription>
                    Average execution time across all tests
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-bold">2h 14m</div>
                            <p className="text-xs text-green-600 flex items-center mt-2">
                                <ArrowDownIcon className="h-3 w-3 mr-1" />
                                <span>12min faster compared to last week</span>
                            </p>
                        </div>
                    </div>
                    <div className="h-[200px] relative rounded-lg bg-muted/5">
                        {/* Sample duration trend chart */}
                        <div className="absolute inset-0 flex items-end px-4 pb-4">
                            {Array.from({ length: 14 }).map((_, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center group">
                                    <div
                                        className="w-full max-w-6 bg-blue-500 hover:bg-blue-600 transition-colors rounded-t"
                                        style={{
                                            height: chartData[index] ? `${chartData[index].height}%` : '0%'
                                        }}
                                        title={chartData[index] ? `Day ${index + 1}: ${chartData[index].hours}h ${chartData[index].minutes}m` : ''}
                                    ></div>
                                    {/* Only show some labels to avoid crowding */}
                                    {index % 3 === 0 && (
                                        <div className="mt-2 text-xs text-muted-foreground">Day {index + 1}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Failure Categories Component
function FailureCategories() {
    // Failure category data
    const failureData = [
        {
            name: "Flaky Tests",
            percentage: 38.5,
            color: "bg-purple-500",
            count: 47
        },
        {
            name: "Actual Bugs",
            percentage: 47.5,
            color: "bg-red-500",
            count: 58
        },
        {
            name: "UI Changes",
            percentage: 14.0,
            color: "bg-blue-500",
            count: 17
        }
    ];

    return (
        <Card className="shadow-sm transition-shadow hover:shadow-md h-full">
            <CardHeader>
                <CardTitle className="text-lg">Test Failure Categories</CardTitle>
                <CardDescription>
                    Top reasons for test failures
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {failureData.map((category) => (
                        <div key={category.name} className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <div className={`h-4 w-4 rounded-full ${category.color}`}></div>
                                    <p className="font-medium">{category.name}</p>
                                </div>
                                <div className="mt-1 ml-7">
                                    <p className="text-sm text-muted-foreground">{category.percentage}% of failures</p>
                                </div>
                            </div>
                            <div className="text-sm font-semibold">{category.count} tests</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Failed Tests Table Component
function FailedTestsTable() {
    // Failed tests data
    const failedTestsData = [
        {
            name: "checkout/payment-gateway/ProcessTransaction",
            module: "Payment",
            type: "Bug",
            rate: "100% (12/12)",
            priority: "High",
            priorityClass: "bg-red-100 text-red-800"
        },
        {
            name: "user-profile/LoginModule",
            module: "Profile",
            type: "Flaky",
            rate: "60% (6/10)",
            priority: "Medium",
            priorityClass: "bg-yellow-100 text-yellow-800"
        },
        {
            name: "product-search/ApplyFilters",
            module: "Search",
            type: "UI Change",
            rate: "100% (8/8)",
            priority: "Medium",
            priorityClass: "bg-yellow-100 text-yellow-800"
        }
    ];

    return (
        <Card className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">Recent Failed Tests</CardTitle>
                <CardDescription>
                    Latest failures requiring attention
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Test Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Module</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Failure Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Failure Rate</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Priority</th>
                            </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                            {failedTestsData.map((test) => (
                                <tr key={test.name} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium truncate max-w-[200px]">{test.name}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">{test.module}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">{test.type}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">{test.rate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${test.priorityClass}`}>
                                            {test.priority}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center flex-wrap gap-2">
                <p className="text-xs text-muted-foreground">
                    Updated just now
                </p>
                <p className="text-xs text-muted-foreground">
                    Showing 3 of 122 failures
                </p>
            </CardFooter>
        </Card>
    );
}