"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ActivityIcon,
    CheckIcon,
    ClockIcon,
    XIcon,
} from "lucide-react";
import React from "react";

// Separate component for metric cards
function MetricCard({ title, value, change, description, icon, isPositive }: Readonly<{ title: string, value: string, change: string, description: string, icon: React.ReactNode, isPositive: boolean }>) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent className="pt-4">
                <div className="text-3xl font-bold tracking-tight">{value}</div>
                <p className={`flex items-center text-xs mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="font-medium mr-1">{change}</span>
                    <span className="text-muted-foreground">{description}</span>
                </p>
            </CardContent>
        </Card>
    );
}

// Component for the failure distribution chart
function FailureDistributionChart() {
    // Distribution data
    const distributionData = [
        { category: "API Errors", percentage: 42.5, color: "bg-red-500" },
        { category: "Flaky Tests", percentage: 38.5, color: "bg-amber-500" },
        { category: "UI Changes", percentage: 14.0, color: "bg-blue-500" },
        { category: "Other", percentage: 5.0, color: "bg-gray-500" },
    ];

    return (
        <Card>
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl">Failure Distribution</CardTitle>
                <CardDescription>By failure type</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-80 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="space-y-6">
                            {distributionData.map((item) => (
                                <div key={item.category} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`h-4 w-4 rounded-full ${item.color} mr-3`}></div>
                                            <span className="text-sm font-medium">{item.category}</span>
                                        </div>
                                        <span className="text-sm font-bold">{item.percentage}%</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all duration-300`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Component for pass rate trend chart
function PassRateTrendChart() {
    // Use state to store the chart data
    const [trendData, setTrendData] = React.useState<Array<{ day: number, passRate: number }>>([]);

    // Generate data only on client-side to avoid hydration mismatch
    React.useEffect(() => {
        // Create sample data for the chart
        const data = Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            passRate: 92 + Math.random() * 6, // Random value between 92-98%
        }));
        setTrendData(data);
    }, []);

    return (
        <Card>
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl">Pass Rate Trend</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-80 flex items-center justify-center">
                    <div className="w-full h-full">
                        <div className="relative h-full flex items-end">
                            {trendData.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex-1 flex flex-col items-center group"
                                >
                                    <div
                                        className="w-full max-w-5 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors"
                                        style={{ height: trendData.length ? `${item.passRate - 50}%` : '0%' }}
                                        title={trendData.length ? `Day ${item.day}: ${item.passRate.toFixed(1)}%` : ''}
                                    ></div>
                                    {/* Only show every 5th label to avoid crowding */}
                                    {index % 5 === 0 && (
                                        <div className="mt-2 text-xs text-muted-foreground">{item.day}</div>
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

// Component for module test performance table
function ModuleTestPerformanceTable() {
    // Module data for the table
    const moduleData = [
        { name: "Authentication", tests: 128, passRate: 98.4, avgDuration: 1.2, flakyTests: 2, status: "text-green-600" },
        { name: "Payment", tests: 214, passRate: 88.3, avgDuration: 3.5, flakyTests: 18, status: "text-red-600" },
        { name: "User Profile", tests: 167, passRate: 92.8, avgDuration: 2.1, flakyTests: 11, status: "text-amber-600" },
        { name: "Search", tests: 195, passRate: 97.4, avgDuration: 4.2, flakyTests: 5, status: "text-green-600" },
        { name: "Checkout", tests: 243, passRate: 94.2, avgDuration: 2.8, flakyTests: 14, status: "text-amber-600" },
    ];

    // Helper function to determine status color based on pass rate
    const getStatusColor = (passRate: number) => {
        if (passRate >= 95) return "text-green-600";
        if (passRate >= 90) return "text-amber-600";
        return "text-red-600";
    };

    return (
        <Card>
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl">Module Test Performance</CardTitle>
                <CardDescription>Pass rate by module</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="h-12 px-6 text-left font-semibold">Module</th>
                                <th className="h-12 px-6 text-left font-semibold">Tests</th>
                                <th className="h-12 px-6 text-left font-semibold">Pass Rate</th>
                                <th className="h-12 px-6 text-left font-semibold">Avg. Duration</th>
                                <th className="h-12 px-6 text-left font-semibold">Flaky Tests</th>
                            </tr>
                        </thead>
                        <tbody>
                            {moduleData.map((module, index) => (
                                <tr
                                    key={module.name}
                                    className={`${index < moduleData.length - 1 ? 'border-b' : ''} transition-colors hover:bg-muted/50`}
                                >
                                    <td className="p-6 font-medium">{module.name}</td>
                                    <td className="p-6">{module.tests}</td>
                                    <td className={`p-6 font-medium ${getStatusColor(module.passRate)}`}>
                                        {module.passRate}%
                                    </td>
                                    <td className="p-6">{module.avgDuration}s</td>
                                    <td className="p-6">{module.flakyTests}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

// Main component that brings everything together
export function AnalyticsContent() {
    // Data for the metric cards
    const metricCardsData = [
        {
            title: "Pass Rate",
            value: "94.8%",
            change: "+1.2%",
            description: "Last 7 days",
            icon: <CheckIcon className="h-6 w-6 text-green-500" />,
            isPositive: true
        },
        {
            title: "Failure Rate",
            value: "5.2%",
            change: "-1.2%",
            description: "Last 7 days",
            icon: <XIcon className="h-6 w-6 text-red-500" />,
            isPositive: true
        },
        {
            title: "Avg. Duration",
            value: "2.5s",
            change: "-0.3s",
            description: "Per test",
            icon: <ClockIcon className="h-6 w-6 text-blue-500" />,
            isPositive: true
        },
        {
            title: "Flaky Tests",
            value: "47",
            change: "+5",
            description: "Identified",
            icon: <ActivityIcon className="h-6 w-6 text-amber-500" />,
            isPositive: false
        }
    ];

    return (
        <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {metricCardsData.map((metric) => (
                    <MetricCard
                        key={metric.title}
                        title={metric.title}
                        value={metric.value}
                        change={metric.change}
                        description={metric.description}
                        icon={metric.icon}
                        isPositive={metric.isPositive}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <FailureDistributionChart />
                <PassRateTrendChart />
            </div>

            {/* Table Section */}
            <ModuleTestPerformanceTable />
        </div>
    );
}