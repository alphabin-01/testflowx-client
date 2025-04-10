"use client"

import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import testData from "../../dashboard/test-data.json"

// Get failed tests
const failedTests = testData.filter(test => test.status === "failed" || test.status === "flaky")

export default function FailureAnalysisPage() {
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
                                        <BreadcrumbLink>Failure Analysis</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </Breadcrumb>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Link href="/testlens">
                                            <Button variant="outline" size="sm">
                                                <IconArrowLeft className="size-4 mr-1" />
                                                Back
                                            </Button>
                                        </Link>
                                        <h1 className="text-2xl font-bold">Failure Analysis</h1>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Failed Tests</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {failedTests.filter(t => t.status === "failed").length}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Flaky Tests</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {failedTests.filter(t => t.status === "flaky").length}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {failedTests.length}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Failed Tests</CardTitle>
                                        <CardDescription>
                                            List of all tests that have failed or are flaky
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Test Name</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Environment</TableHead>
                                                    <TableHead>Error Message</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {failedTests.map(test => (
                                                    <TableRow key={test.id}>
                                                        <TableCell className="font-medium">{test.name}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={test.status === "failed" ? "destructive" : "outline"}>
                                                                {test.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{test.environment}</TableCell>
                                                        <TableCell className="max-w-[300px] truncate">
                                                            {test.errorMessage || "No error message"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Link href={`/testlens/${test.id}`}>
                                                                <Button variant="outline" size="sm">View Details</Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
} 