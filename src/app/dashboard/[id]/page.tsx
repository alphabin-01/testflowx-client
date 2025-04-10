"use client"

import { useEffect, useState } from "react"
import { IconArrowLeft, IconCircleCheckFilled, IconClock, IconX, IconAlertTriangle } from "@tabler/icons-react"
import Link from "next/link"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import testData from "../../dashboard/test-data.json"

// Status badge component
function StatusBadge({ status }: { status: string }) {
    if (status === "passed") {
        return (
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <IconCircleCheckFilled className="size-3 mr-1" />
                Passed
            </Badge>
        )
    } else if (status === "failed") {
        return (
            <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <IconX className="size-3 mr-1" />
                Failed
            </Badge>
        )
    } else if (status === "skipped") {
        return (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
                <IconClock className="size-3 mr-1" />
                Skipped
            </Badge>
        )
    } else if (status === "flaky") {
        return (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                <IconAlertTriangle className="size-3 mr-1" />
                Flaky
            </Badge>
        )
    }
    return (
        <Badge variant="outline">
            {status}
        </Badge>
    )
}

// Generate some mock history data
const generateHistoryData = (testId: number) => {
    const runs = []
    const currentDate = new Date()

    for (let i = 0; i < 10; i++) {
        const date = new Date(currentDate)
        date.setDate(date.getDate() - i)

        // Generate random status with bias towards current status
        const statuses = ["passed", "failed", "skipped", "flaky"]
        const currentTest = testData.find(t => t.id === testId)
        const currentStatus = currentTest?.status || "passed"

        let status
        if (i === 0) {
            status = currentStatus
        } else {
            const random = Math.random()
            if (random < 0.6) {
                status = currentStatus
            } else {
                const filteredStatuses = statuses.filter(s => s !== currentStatus)
                status = filteredStatuses[Math.floor(Math.random() * filteredStatuses.length)]
            }
        }

        runs.push({
            id: i + 1,
            date: date.toISOString(),
            status,
            executionTime: Math.round((Math.random() * 5 + 1) * 100) / 100,
            environment: currentTest?.environment || "staging"
        })
    }

    return runs
}

export default function TestDetailPage({ params }: { params: { id: string } }) {
    const [test, setTest] = useState<any>(null)
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        // Find the test by ID
        const testId = parseInt(params.id)
        const foundTest = testData.find(t => t.id === testId)
        if (foundTest) {
            setTest(foundTest)
            setHistory(generateHistoryData(testId))
        }
    }, [params.id])

    if (!test) {
        return <div>Loading...</div>
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <Breadcrumb className="mb-4">
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/testlens">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink>Test Details</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </Breadcrumb>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Link href="/testlens">
                                            <Button variant="outline" size="sm">
                                                <IconArrowLeft className="size-4 mr-1" />
                                                Back
                                            </Button>
                                        </Link>
                                        <h1 className="text-2xl font-bold">{test.name}</h1>
                                        <StatusBadge status={test.status} />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{test.environment}</Badge>
                                        <Badge variant="outline">{test.category}</Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Execution Time</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{test.executionTime}s</div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Test Cases</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{test.testCases?.length || 0}</div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Last Run</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm">{new Date(test.timestamp).toLocaleString()}</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle>Test Description</CardTitle>
                                        <CardDescription>
                                            Detailed information about this test
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{test.description}</p>
                                    </CardContent>
                                </Card>

                                <Tabs defaultValue="testCases" className="w-full">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="testCases">Test Cases</TabsTrigger>
                                        <TabsTrigger value="history">History</TabsTrigger>
                                        {test.errorMessage && (
                                            <TabsTrigger value="errors">Errors</TabsTrigger>
                                        )}
                                    </TabsList>

                                    <TabsContent value="testCases" className="mt-0">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Test Cases</CardTitle>
                                                <CardDescription>
                                                    Individual test cases within this test suite
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {test.testCases && test.testCases.length > 0 ? (
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>ID</TableHead>
                                                                <TableHead>Name</TableHead>
                                                                <TableHead>Status</TableHead>
                                                                <TableHead>Time</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {test.testCases.map((testCase: any) => (
                                                                <TableRow key={testCase.id}>
                                                                    <TableCell>{testCase.id}</TableCell>
                                                                    <TableCell className="font-medium">{testCase.name}</TableCell>
                                                                    <TableCell><StatusBadge status={testCase.status} /></TableCell>
                                                                    <TableCell>{testCase.executionTime}s</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                ) : (
                                                    <div className="text-center p-4 text-muted-foreground">
                                                        No test cases available.
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="history" className="mt-0">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Execution History</CardTitle>
                                                <CardDescription>
                                                    Previous runs of this test
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Run #</TableHead>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead>Time</TableHead>
                                                            <TableHead>Environment</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {history.map((run) => (
                                                            <TableRow key={run.id}>
                                                                <TableCell>{run.id}</TableCell>
                                                                <TableCell>{new Date(run.date).toLocaleString()}</TableCell>
                                                                <TableCell><StatusBadge status={run.status} /></TableCell>
                                                                <TableCell>{run.executionTime}s</TableCell>
                                                                <TableCell>{run.environment}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {test.errorMessage && (
                                        <TabsContent value="errors" className="mt-0">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Error Details</CardTitle>
                                                    <CardDescription>
                                                        Information about errors encountered during test execution
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-col gap-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium mb-2">Error Message</h4>
                                                            <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                                                                <p className="text-sm text-red-700 dark:text-red-400">{test.errorMessage}</p>
                                                            </div>
                                                        </div>

                                                        {test.stackTrace && (
                                                            <div>
                                                                <h4 className="text-sm font-medium mb-2">Stack Trace</h4>
                                                                <pre className="max-h-[300px] overflow-auto rounded-md bg-gray-50 p-3 text-xs font-mono dark:bg-gray-900/50">
                                                                    {test.stackTrace}
                                                                </pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    )}
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}