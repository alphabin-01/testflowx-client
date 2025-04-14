"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_ENDPOINTS } from "@/lib/api";
import { apiRequest, STATUS } from "@/lib/api-client";
import {
    ActivityIcon,
    CheckIcon,
    ClockIcon,
    XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell
} from "recharts";

// Types for metrics API response
interface Metrics {
    summary: {
        totalRuns: number;
        averageDuration: number;
        passRate: number;
        flakyRate: number;
        failureRate: number;
        skipRate: number;
        totalTests: number;
        totalPassed: number;
        totalFailed: number;
        totalSkipped: number;
        totalFlaky: number;
    };
    trends: {
        passRate: Array<{ date: string; value: number; _id?: string }>;
        duration: Array<{ date: string; value: number; _id?: string }>;
        testCount: Array<{ date: string; value: number; _id?: string }>;
    };
    topSlowestTests: Array<{
        testId: string;
        title: string;
        averageDuration: number;
        maxDuration: number;
        _id?: string;
    }>;
    ci?: {
        avgBuildTime: number;
        passRate: number;
        totalBuilds: number;
    };
    metadata?: {
        tags: string[];
        isPublic: boolean;
        generatedAt: string;
    };
    environments?: Array<{
        name: string;
        runs: number;
        passRate: number;
        averageDuration: number;
        _id?: string;
    }>;
    browsers?: Array<{
        name: string;
        version: string;
        runs: number;
        passRate: number;
        averageDuration: number;
        _id?: string;
    }>;
    branches?: Array<{
        name: string;
        runs: number;
        passRate: number;
        averageDuration: number;
        _id?: string;
    }>;
}

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

// Component for module test performance table
function ModuleTestPerformanceTable({ testData }: {
    testData: Array<{
        testId: string;
        title: string;
        averageDuration: number;
        maxDuration: number;
        _id?: string;
    }>
}) {
    // Helper function to determine status color based on duration
    const getStatusColor = (duration: number) => {
        if (duration < 1000) return "text-green-600";
        if (duration < 2000) return "text-amber-600";
        return "text-red-600";
    };

    return (
        <Card>
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl">Top Slowest Tests</CardTitle>
                <CardDescription>Performance by test</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="h-12 px-6 text-left font-semibold">Test</th>
                                <th className="h-12 px-6 text-left font-semibold">Avg. Duration</th>
                                <th className="h-12 px-6 text-left font-semibold">Max Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testData.map((test, index) => (
                                <tr
                                    key={test.testId}
                                    className={`${index < testData.length - 1 ? 'border-b' : ''} transition-colors hover:bg-muted/50`}
                                >
                                    <td className="p-6 font-medium">{test.title}</td>
                                    <td className={`p-6 font-medium ${getStatusColor(test.averageDuration)}`}>
                                        {(test.averageDuration / 1000).toFixed(1)}s
                                    </td>
                                    <td className="p-6">{(test.maxDuration / 1000).toFixed(1)}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

// Component for environments performance
function EnvironmentsTable({ environments }: {
    environments: Array<{
        name: string;
        runs: number;
        passRate: number;
        averageDuration: number;
        _id?: string;
    }>
}) {
    return (
        <Card>
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl">Environments</CardTitle>
                <CardDescription>Test performance by environment</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="h-12 px-6 text-left font-semibold">Environment</th>
                                <th className="h-12 px-6 text-left font-semibold">Runs</th>
                                <th className="h-12 px-6 text-left font-semibold">Pass Rate</th>
                                <th className="h-12 px-6 text-left font-semibold">Avg. Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {environments.map((env, index) => (
                                <tr
                                    key={env._id || env.name}
                                    className={`${index < environments.length - 1 ? 'border-b' : ''} transition-colors hover:bg-muted/50`}
                                >
                                    <td className="p-6 font-medium">{env.name}</td>
                                    <td className="p-6">{env.runs}</td>
                                    <td className="p-6 font-medium text-green-600">
                                        {env.passRate.toFixed(1)}%
                                    </td>
                                    <td className="p-6">{(env.averageDuration / 1000).toFixed(1)}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

// Component for browsers performance
function BrowsersTable({ browsers }: {
    browsers: Array<{
        name: string;
        version: string;
        runs: number;
        passRate: number;
        averageDuration: number;
        _id?: string;
    }>
}) {
    return (
        <Card>
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl">Browsers</CardTitle>
                <CardDescription>Test performance by browser</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="h-12 px-6 text-left font-semibold">Browser</th>
                                <th className="h-12 px-6 text-left font-semibold">Version</th>
                                <th className="h-12 px-6 text-left font-semibold">Runs</th>
                                <th className="h-12 px-6 text-left font-semibold">Pass Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {browsers.map((browser, index) => (
                                <tr
                                    key={browser._id || `${browser.name}-${browser.version}`}
                                    className={`${index < browsers.length - 1 ? 'border-b' : ''} transition-colors hover:bg-muted/50`}
                                >
                                    <td className="p-6 font-medium">{browser.name}</td>
                                    <td className="p-6">{browser.version}</td>
                                    <td className="p-6">{browser.runs}</td>
                                    <td className="p-6 font-medium text-green-600">
                                        {browser.passRate.toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

// Component for branches performance
function BranchesTable({ branches }: {
    branches: Array<{
        name: string;
        runs: number;
        passRate: number;
        averageDuration: number;
        _id?: string;
    }>
}) {
    return (
        <Card>
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl">Branches</CardTitle>
                <CardDescription>Test performance by branch</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="h-12 px-6 text-left font-semibold">Branch</th>
                                <th className="h-12 px-6 text-left font-semibold">Runs</th>
                                <th className="h-12 px-6 text-left font-semibold">Pass Rate</th>
                                <th className="h-12 px-6 text-left font-semibold">Avg. Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branches.map((branch, index) => (
                                <tr
                                    key={branch._id || branch.name}
                                    className={`${index < branches.length - 1 ? 'border-b' : ''} transition-colors hover:bg-muted/50`}
                                >
                                    <td className="p-6 font-medium">{branch.name}</td>
                                    <td className="p-6">{branch.runs}</td>
                                    <td className="p-6 font-medium text-green-600">
                                        {branch.passRate.toFixed(1)}%
                                    </td>
                                    <td className="p-6">{(branch.averageDuration / 1000).toFixed(1)}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

function TestSummaryBarChart({ summary }: { summary: Metrics['summary'] }) {
    const summaryData = [
        { name: 'Total Tests', value: summary.totalTests, fill: '#94a3b8' }, // Slate
        { name: 'Passed', value: summary.totalPassed, fill: '#22c55e' },     // Green
        { name: 'Failed', value: summary.totalFailed, fill: '#ef4444' },     // Red
        { name: 'Skipped', value: summary.totalSkipped, fill: '#f59e0b' },   // Amber
        { name: 'Flaky', value: summary.totalFlaky, fill: '#8b5cf6' },       // Violet
    ];

    return (
        <Card className="shadow-xl rounded-2xl border border-gray-200">
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">
                    Test Summary
                </CardTitle>
                <CardDescription className="text-gray-500">
                    Overview of total, passed, failed, skipped, and flaky tests
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-[20rem] sm:h-[24rem] md:h-[28rem]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={summaryData}
                            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                interval={0}
                            />
                            <YAxis
                                width={50}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                            />
                            <Tooltip
                                formatter={(value: number, name: string, props) => [
                                    value.toLocaleString(),
                                    props.payload?.name || 'Tests',
                                ]}
                                contentStyle={{
                                    fontSize: '14px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    backgroundColor: '#ffffff',
                                }}
                            />
                            <Legend
                                formatter={(value) => (
                                    <span style={{ fontSize: 12 }}>{value}</span>
                                )}
                            />
                            <Bar
                                dataKey="value"
                                name="Test Count"
                                radius={[12, 12, 0, 0]}
                                maxBarSize={50}
                                label={{ position: 'top', fontSize: 12, fill: '#374151' }}
                            >
                                {summaryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}


function TrendsAreaChart({ trends }: { trends: Metrics['trends'] }) {
    const trendData = trends.passRate.map((item, index) => {
        const date = new Date(item.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        });
        return {
            date,
            passRate: item.value,
            testCount: trends.testCount[index]?.value || 0,
            duration: trends.duration[index]?.value || 0,
        };
    });

    return (
        <Card className="shadow-xl rounded-2xl border border-gray-200">
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">
                    Trends Over Time
                </CardTitle>
                <CardDescription className="text-gray-500">
                    Visualize pass rate, test count, and duration progression
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-[24rem]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={trendData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis
                                yAxisId="left"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickFormatter={(val) => `${val}%`}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickFormatter={(val) => val.toLocaleString()}
                            />
                            <Tooltip
                                formatter={(value: number, name: string) => [
                                    name === 'Pass Rate (%)'
                                        ? `${value.toFixed(2)}%`
                                        : value.toLocaleString(),
                                    name,
                                ]}
                                labelClassName="font-semibold"
                            />
                            <Legend />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="passRate"
                                name="Pass Rate (%)"
                                stroke="#16a34a"
                                fill="#bbf7d0"
                                fillOpacity={0.3}
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="testCount"
                                name="Test Count"
                                stroke="#2563eb"
                                fill="#bfdbfe"
                                fillOpacity={0.25}
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="duration"
                                name="Duration (ms)"
                                stroke="#d97706"
                                fill="#fde68a"
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}


// Main component that brings everything together
export function AnalyticsContent() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // Use a hardcoded metrics ID for now - in real code, you'd probably get this from a route parameter
                const metricsId = "67f8dd368899263bbb1c7933";
                const response = await apiRequest<{ success: boolean, metrics: Metrics }>(API_ENDPOINTS.testMetrics.getMetricsById(metricsId), {
                    method: "GET",
                    headers: {
                        "X-API-KEY": "tfx_dev_459d26229b15a03b380c6488eab183f971c153b1dc86a080"
                    }
                });

                if (response.status === STATUS.SUCCESS && response.data && response.data.success) {
                    setMetrics(response.data.metrics);
                }
            } catch (error) {
                console.error("Failed to fetch metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-[400px]">Loading metrics...</div>;
    }

    if (!metrics) {
        return <div className="text-center p-8">Failed to load metrics data.</div>;
    }

    // Data for the metric cards
    const metricCardsData = [
        {
            title: "Pass Rate",
            value: `${metrics.summary.passRate.toFixed(1)}%`,
            change: `${metrics.summary.passRate > 90 ? "+" : ""}${(metrics.summary.passRate - 90).toFixed(1)}%`,
            description: "Overall",
            icon: <CheckIcon className="h-6 w-6 text-green-500" />,
            isPositive: metrics.summary.passRate >= 90
        },
        {
            title: "Failure Rate",
            value: `${metrics.summary.failureRate.toFixed(1)}%`,
            change: `${metrics.summary.failureRate < 10 ? "-" : "+"}${Math.abs(metrics.summary.failureRate - 10).toFixed(1)}%`,
            description: "Overall",
            icon: <XIcon className="h-6 w-6 text-red-500" />,
            isPositive: metrics.summary.failureRate <= 10
        },
        {
            title: "Avg. Duration",
            value: `${(metrics.summary.averageDuration / 1000).toFixed(1)}s`,
            change: `${metrics.summary.averageDuration < 3000 ? "-" : "+"}${Math.abs((metrics.summary.averageDuration - 3000) / 1000).toFixed(1)}s`,
            description: "Per test",
            icon: <ClockIcon className="h-6 w-6 text-blue-500" />,
            isPositive: metrics.summary.averageDuration <= 3000
        },
        {
            title: "Tests",
            value: metrics.summary.totalTests.toString(),
            change: `${metrics.summary.totalFlaky > 0 ? `${metrics.summary.totalFlaky} flaky` : "0 flaky"}`,
            description: "Total",
            icon: <ActivityIcon className="h-6 w-6 text-amber-500" />,
            isPositive: metrics.summary.totalFlaky === 0
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

            {/* New Charts Section with Summary Bar Chart */}
            <TestSummaryBarChart summary={metrics.summary} />

            {/* Trends Area Chart */}
            {metrics.trends.passRate.length > 0 && (
                <TrendsAreaChart trends={metrics.trends} />
            )}

            {/* Tables Section */}
            {metrics.topSlowestTests.length > 0 && (
                <ModuleTestPerformanceTable testData={metrics.topSlowestTests} />
            )}

            {/* Additional Data Tables */}
            <div className="grid gap-6 md:grid-cols-2">
                {metrics.environments && metrics.environments.length > 0 && (
                    <EnvironmentsTable environments={metrics.environments} />
                )}

                {metrics.browsers && metrics.browsers.length > 0 && (
                    <BrowsersTable browsers={metrics.browsers} />
                )}
            </div>

            {metrics.branches && metrics.branches.length > 0 && (
                <BranchesTable branches={metrics.branches} />
            )}
        </div>
    );
}