"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconDotsVertical,
    IconExclamationCircle,
    IconInfoCircle,
    IconX,
    IconArrowDown,
    IconArrowUp,
    IconClock,
    IconAlertTriangle,
    IconExternalLink,
} from "@tabler/icons-react"
import { z } from "zod"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"

// Define schema for test data
export const testSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    status: z.string(),
    executionTime: z.number(),
    timestamp: z.string(),
    environment: z.string(),
    category: z.string(),
    errorMessage: z.string().nullable(),
    stackTrace: z.string().nullable(),
    testCases: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            status: z.string(),
            executionTime: z.number(),
            errorMessage: z.string().nullable(),
        })
    ).optional(),
})

type Test = z.infer<typeof testSchema>

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

// Test detail viewer component
function TestDetailViewer({ test }: { test: Test }) {
    return (
        <div className="px-4 py-2">
            <div className="flex flex-col gap-4">
                <div>
                    <h4 className="text-sm font-medium">Description</h4>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                </div>

                {test.errorMessage && (
                    <div>
                        <h4 className="text-sm font-medium">Error Message</h4>
                        <div className="mt-1 rounded-md bg-red-50 p-2 dark:bg-red-900/20">
                            <p className="text-sm text-red-700 dark:text-red-400">{test.errorMessage}</p>
                        </div>
                    </div>
                )}

                {test.stackTrace && (
                    <div>
                        <h4 className="text-sm font-medium">Stack Trace</h4>
                        <pre className="mt-1 max-h-[200px] overflow-auto rounded-md bg-gray-50 p-2 text-xs font-mono dark:bg-gray-900/50">
                            {test.stackTrace}
                        </pre>
                    </div>
                )}

                {test.testCases && test.testCases.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium">Test Cases</h4>
                        <div className="mt-1 rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {test.testCases.map(testCase => (
                                        <TableRow key={testCase.id}>
                                            <TableCell className="font-medium">{testCase.name}</TableCell>
                                            <TableCell><StatusBadge status={testCase.status} /></TableCell>
                                            <TableCell>{testCase.executionTime}s</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-2">
                    <Link href={`/testlens/${test.id}`} passHref>
                        <Button variant="outline" size="sm">
                            View Full Details
                            <IconExternalLink className="ml-1 size-3" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

// Expandable row component
function ExpandableRow({
    row,
    isMobile
}: {
    row: Row<Test>
    isMobile: boolean
}) {
    const [isExpanded, setIsExpanded] = React.useState(false)

    if (isMobile) {
        return (
            <>
                <TableRow className="group cursor-pointer border-b" onClick={() => setIsExpanded(true)}>
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                </TableRow>
                <Drawer open={isExpanded} onOpenChange={setIsExpanded}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Test Details: {row.original.name}</DrawerTitle>
                            <DrawerDescription>
                                Run on {new Date(row.original.timestamp).toLocaleString()}
                            </DrawerDescription>
                        </DrawerHeader>
                        <TestDetailViewer test={row.original} />
                        <DrawerFooter>
                            <DrawerClose>
                                <Button variant="outline" className="w-full">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        )
    }

    return (
        <>
            <TableRow className="group cursor-pointer border-b" onClick={() => setIsExpanded(!isExpanded)}>
                {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
            </TableRow>
            {isExpanded && (
                <TableRow>
                    <TableCell colSpan={row.getVisibleCells().length} className="p-0">
                        <TestDetailViewer test={row.original} />
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}

// Define columns for the table
const getColumns = (): ColumnDef<Test>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Test Name",
        cell: ({ row }) => {
            return (
                <div className="font-medium">
                    {row.original.name}
                </div>
            )
        },
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <StatusBadge status={row.original.status} />
        ),
    },
    {
        accessorKey: "executionTime",
        header: "Time",
        cell: ({ row }) => (
            <div>
                {row.original.executionTime}s
            </div>
        ),
    },
    {
        accessorKey: "environment",
        header: "Environment",
        cell: ({ row }) => (
            <Badge variant="outline" className="px-1.5">
                {row.original.environment}
            </Badge>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <Badge variant="outline" className="px-1.5">
                {row.original.category}
            </Badge>
        ),
    },
    {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: ({ row }) => (
            <div className="text-muted-foreground text-sm">
                {new Date(row.original.timestamp).toLocaleString()}
            </div>
        ),
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                <Link href={`/testlens/${row.original.id}`} passHref>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <IconExternalLink className="size-4" />
                        <span className="sr-only">View details</span>
                    </Button>
                </Link>
            </div>
        ),
    },
]

interface TestResultsTableProps {
    testData: Test[]
}

export function TestResultsTable({ testData }: TestResultsTableProps) {
    const isMobile = useIsMobile()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        environment: !isMobile,
        category: !isMobile,
        timestamp: !isMobile,
    })
    const [rowSelection, setRowSelection] = React.useState({})
    const [searchQuery, setSearchQuery] = React.useState("")

    // Set up the table
    const table = useReactTable({
        data: testData,
        columns: getColumns(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Apply global search filter
    React.useEffect(() => {
        if (searchQuery) {
            table.setGlobalFilter(searchQuery)
        } else {
            table.resetGlobalFilter()
        }
    }, [searchQuery, table])

    // Update column visibility when mobile state changes
    React.useEffect(() => {
        setColumnVisibility({
            environment: !isMobile,
            category: !isMobile,
            timestamp: !isMobile,
        })
    }, [isMobile])

    return (
        <div className="w-full space-y-4 px-4 lg:px-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Input
                        placeholder="Search tests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-full md:w-[250px] lg:w-[300px]"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-9">
                                Status
                                <IconChevronDown className="ml-2 size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuCheckboxItem
                                checked={!table.getColumn("status")?.getFilterValue()}
                                onCheckedChange={() => table.getColumn("status")?.setFilterValue(undefined)}
                            >
                                All Statuses
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            {["passed", "failed", "skipped", "flaky"].map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={table.getColumn("status")?.getFilterValue() === status}
                                    onCheckedChange={() => table.getColumn("status")?.setFilterValue(status)}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-9">
                                Environment
                                <IconChevronDown className="ml-2 size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuCheckboxItem
                                checked={!table.getColumn("environment")?.getFilterValue()}
                                onCheckedChange={() => table.getColumn("environment")?.setFilterValue(undefined)}
                            >
                                All Environments
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={table.getColumn("environment")?.getFilterValue() === "production"}
                                onCheckedChange={() => table.getColumn("environment")?.setFilterValue("production")}
                            >
                                Production
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={table.getColumn("environment")?.getFilterValue() === "staging"}
                                onCheckedChange={() => table.getColumn("environment")?.setFilterValue("staging")}
                            >
                                Staging
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={table.getColumn("environment")?.getFilterValue() === "development"}
                                onCheckedChange={() => table.getColumn("environment")?.setFilterValue("development")}
                            >
                                Development
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto h-9">
                            <IconDotsVertical className="size-4" />
                            <span className="sr-only">More</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Export CSV</DropdownMenuItem>
                        <DropdownMenuItem>Generate Report</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={table.getColumn("timestamp")?.getIsVisible()}
                            onCheckedChange={(value) => table.getColumn("timestamp")?.toggleVisibility(!!value)}
                        >
                            Show Timestamps
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={table.getColumn("environment")?.getIsVisible()}
                            onCheckedChange={(value) => table.getColumn("environment")?.toggleVisibility(!!value)}
                        >
                            Show Environment
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={table.getColumn("category")?.getIsVisible()}
                            onCheckedChange={(value) => table.getColumn("category")?.toggleVisibility(!!value)}
                        >
                            Show Category
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <ExpandableRow key={row.id} row={row} isMobile={isMobile} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <IconChevronsLeft className="h-4 w-4" />
                            <span className="sr-only">Go to first page</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <IconChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Go to previous page</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <IconChevronRight className="h-4 w-4" />
                            <span className="sr-only">Go to next page</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <IconChevronsRight className="h-4 w-4" />
                            <span className="sr-only">Go to last page</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
} 