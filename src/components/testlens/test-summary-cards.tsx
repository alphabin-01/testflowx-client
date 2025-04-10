"use client"

import { IconCheck, IconX, IconMinus, IconAlertTriangle } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface TestSummaryCardsProps {
    testData: any[]
}

export function TestSummaryCards({ testData }: TestSummaryCardsProps) {
    // Calculate test statistics
    const totalTests = testData.length
    const passedTests = testData.filter(test => test.status === "passed").length
    const failedTests = testData.filter(test => test.status === "failed").length
    const skippedTests = testData.filter(test => test.status === "skipped").length
    const flakyTests = testData.filter(test => test.status === "flaky").length

    // Calculate success rate
    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0

    // Calculate average execution time
    const totalExecutionTime = testData.reduce((total, test) => total + test.executionTime, 0)
    const avgExecutionTime = totalTests > 0 ? (totalExecutionTime / totalTests).toFixed(2) : "0.00"

    // Get total test cases
    const totalTestCases = testData.reduce((total, test) =>
        total + (test.testCases ? test.testCases.length : 0), 0)

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Test Success Rate</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {successRate}%
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            <IconCheck className="size-3 mr-1" />
                            {passedTests} Passed
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {totalTests} Test Suites
                    </div>
                    <div className="text-muted-foreground">
                        {totalTestCases} Individual Test Cases
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Failed Tests</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {failedTests}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            <IconX className="size-3 mr-1" />
                            {Math.round((failedTests / totalTests) * 100)}%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {failedTests} Failed Test Suites
                    </div>
                    <div className="text-muted-foreground">
                        Requires immediate attention
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Flaky Tests</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {flakyTests}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                            <IconAlertTriangle className="size-3 mr-1" />
                            {Math.round((flakyTests / totalTests) * 100)}%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {flakyTests} Flaky Test Suites
                    </div>
                    <div className="text-muted-foreground">
                        Intermittent failures detected
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Execution Time</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {avgExecutionTime}s
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                            <IconMinus className="size-3 mr-1" />
                            Avg Time
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {totalExecutionTime.toFixed(2)}s Total Duration
                    </div>
                    <div className="text-muted-foreground">
                        Total test execution time
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
} 