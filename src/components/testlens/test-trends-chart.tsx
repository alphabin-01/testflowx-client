"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"

interface TestData {
    id: number;
    name: string;
    description: string;
    status: string;
    executionTime: number;
    timestamp: string;
    environment: string;
    category: string;
    errorMessage: string | null;
    stackTrace: string | null;
    testCases?: Array<{
        id: number;
        name: string;
        status: string;
        executionTime: number;
        errorMessage: string | null;
    }>;
}

interface TestTrendsChartProps {
    testData: TestData[]
}

// Generate sample trend data since our test data doesn't have historical data
const generateTrendData = (testData: TestData[]) => {
    const dates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return date.toISOString().split('T')[0]
    })

    // Calculate current pass/fail/skip rates from testData
    const totalTests = testData.length
    const passedTests = testData.filter(test => test.status === "passed").length
    const failedTests = testData.filter(test => test.status === "failed").length

    // Calculate base percentages
    const basePassedPercent = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 70
    const baseFailedPercent = totalTests > 0 ? Math.round((failedTests / totalTests) * 100) : 20

    return dates.map(date => {
        // Generate random variation within ±10% of the base percentages
        const passedVariation = Math.floor(Math.random() * 20) - 10
        const failedVariation = Math.floor(Math.random() * 10) - 5

        // Calculate values ensuring they add up to 100%
        const passed = Math.max(0, Math.min(100, basePassedPercent + passedVariation))
        const failed = Math.max(0, Math.min(100 - passed, baseFailedPercent + failedVariation))
        const skipped = 100 - passed - failed

        return {
            date,
            passed,
            failed,
            skipped,
            total: Math.floor(Math.random() * 20) + totalTests
        }
    })
}

const chartConfig = {
    passed: {
        label: "Passed",
        color: "var(--green-600)",
    },
    failed: {
        label: "Failed",
        color: "var(--red-600)",
    },
    skipped: {
        label: "Skipped",
        color: "var(--gray-400)",
    },
} satisfies ChartConfig

export function TestTrendsChart({ testData }: TestTrendsChartProps) {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("30d")
    const [trendData] = React.useState(() => generateTrendData(testData))

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d")
        }
    }, [isMobile])

    // Filter trend data based on selected time range
    const filteredData = trendData.filter((item) => {
        if (timeRange === "7d") {
            return trendData.indexOf(item) >= trendData.length - 7
        } else if (timeRange === "14d") {
            return trendData.indexOf(item) >= trendData.length - 14
        }
        return true
    })

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Test Results Trend</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Test execution history over time
                    </span>
                    <span className="@[540px]/card:hidden">Test trends</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
                        <ToggleGroupItem value="14d">Last 14 days</ToggleGroupItem>
                        <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 30 days" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="14d" className="rounded-lg">
                                Last 14 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-[300px] w-full overflow-x-auto overflow-y-hidden px-1 pt-1">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-[4/1] h-full w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={filteredData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => {
                                        const date = new Date(value)
                                        return `${date.getDate()}/${date.getMonth() + 1}`
                                    }}
                                    minTickGap={10}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-muted-foreground">
                                                                Date
                                                            </span>
                                                            <span className="font-bold">
                                                                {new Date(data.date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-muted-foreground">
                                                                Total Tests
                                                            </span>
                                                            <span className="font-bold">
                                                                {data.total}
                                                            </span>
                                                        </div>
                                                        {["passed", "failed", "skipped"].map((key) => (
                                                            <div key={key} className="flex flex-col">
                                                                <span className="text-xs text-muted-foreground capitalize">
                                                                    {key}
                                                                </span>
                                                                <span className="font-bold">
                                                                    {data[key]}%
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="passed"
                                    stackId="1"
                                    stroke={chartConfig.passed.color}
                                    fill={chartConfig.passed.color}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="failed"
                                    stackId="1"
                                    stroke={chartConfig.failed.color}
                                    fill={chartConfig.failed.color}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="skipped"
                                    stackId="1"
                                    stroke={chartConfig.skipped.color}
                                    fill={chartConfig.skipped.color}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
} 