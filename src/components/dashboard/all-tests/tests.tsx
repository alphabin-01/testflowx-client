import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTestRun } from '@/hooks/dashboard/useTestRun';
import { TestCase } from '@/lib/typers';
import { statusConfig as baseStatusConfig } from '@/lib/typers';
import {
    Clock,
    GitBranch,
    GitCommit,
    MoreVertical,
    RefreshCw,
    Search,
    Terminal,
    XCircle,
    CheckCircle,
    AlertTriangle,
    Tag
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Initialize with icons, just like in details.tsx
const statusConfig = {
    ...baseStatusConfig,
    completed: {
        ...baseStatusConfig.completed,
        icon: <CheckCircle className="h-4 w-4" />
    },
    failed: {
        ...baseStatusConfig.failed,
        icon: <XCircle className="h-4 w-4" />
    },
    flaky: {
        ...baseStatusConfig.flaky,
        icon: <AlertTriangle className="h-4 w-4" />
    },
    skipped: {
        ...baseStatusConfig.skipped,
        icon: <Clock className="h-4 w-4" />
    }
};

const TestContent = ({ projectId }: { projectId: string }) => {
    const router = useRouter();
    const { testRuns, isLoading, error, fetchTestRuns, pagination, getFilteredRuns } = useTestRun();
    const [selectedTest, setSelectedTest] = useState<TestCase | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Filter states
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
 
    // Memoize the filtered runs
    const filteredRuns = useMemo(() =>
        getFilteredRuns(statusFilter, searchTerm, selectedTags),
        [getFilteredRuns, statusFilter, searchTerm, selectedTags]);

    // Combine both useEffect hooks into one with proper dependency tracking
    useEffect(() => {
        if (!isLoading) {
            // Perform the fetch after a small delay to batch multiple state updates
            const fetchTimeout = setTimeout(() => {
                fetchTestRuns(pagination.page, pagination.limit, statusFilter);
            }, 10);

            return () => clearTimeout(fetchTimeout);
        }
    }, [fetchTestRuns, statusFilter, pagination.page, pagination.limit, isLoading]);

    // Memoize frequently used callbacks to prevent unnecessary re-renders
    const formatDateTime = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    }, []);

    const navigateToRunDetails = useCallback((runId: string) => {
        router.push(`/projects/${projectId}/test-run/${runId}`);
    }, [projectId, router]);

    const handleRefreshClick = useCallback(() => {
        fetchTestRuns(pagination.page, pagination.limit, statusFilter);
    }, [fetchTestRuns, pagination.page, pagination.limit, statusFilter]);

    const handlePreviousPage = useCallback(() => {
        fetchTestRuns(pagination.page - 1, pagination.limit, statusFilter);
    }, [fetchTestRuns, pagination.page, pagination.limit, statusFilter]);

    const handleNextPage = useCallback(() => {
        fetchTestRuns(pagination.page + 1, pagination.limit, statusFilter);
    }, [fetchTestRuns, pagination.page, pagination.limit, statusFilter]);

    const toggleTag = useCallback((tag: string) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tag)
                ? prevTags.filter(t => t !== tag)
                : [...prevTags, tag]
        );
    }, []);

    const clearAllTags = useCallback(() => {
        setSelectedTags([]);
    }, []);

    // Memoize computed values to avoid recalculation on each render
    const uniqueStatuses = useMemo(() => {
        const statuses = new Set(['All']);
        testRuns.forEach(run => {
            if (run.status) statuses.add(run.status);
        });
        return Array.from(statuses);
    }, [testRuns]);

    const allAvailableTags = useMemo(() => {
        const tags = new Set<string>();
        testRuns.forEach(run => {
            run.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [testRuns]);

    // Memoize UI sections to prevent unnecessary re-renders
    const filterSection = useMemo(() => (
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search test runs..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueStatuses.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-1">
                                <Tag className="h-4 w-4" />
                                Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px] p-2">
                            {allAvailableTags.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-1 px-2">No tags available</p>
                            ) : (
                                <div className="max-h-[200px] overflow-y-auto">
                                    {allAvailableTags.map(tag => (
                                        <div key={tag} className="flex items-center py-1 px-2 hover:bg-muted rounded">
                                            <Button
                                                variant={selectedTags.includes(tag) ? "default" : "outline"}
                                                size="sm"
                                                className="h-6 w-full justify-start text-xs"
                                                onClick={() => toggleTag(tag)}
                                            >
                                                {tag}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {selectedTags.length > 0 && (
                                <Button
                                    variant="ghost"
                                    className="w-full mt-2 h-7 text-xs"
                                    onClick={clearAllTags}
                                >
                                    Clear all
                                </Button>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Display selected tag filters */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTags.map(tag => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="pr-1 flex items-center gap-1"
                        >
                            {tag}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => toggleTag(tag)}
                            >
                                <XCircle className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 text-xs"
                        onClick={clearAllTags}
                    >
                        Clear all
                    </Button>
                </div>
            )}
        </div>
    ), [searchTerm, statusFilter, selectedTags, uniqueStatuses, allAvailableTags, toggleTag, clearAllTags]);

    // Main component render
    return (
        <div className="space-y-4">
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle>Test Runs</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={handleRefreshClick}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                            {isLoading ? "Loading..." : "Refresh"}
                        </Button>
                    </div>
                    <CardDescription>Browse and analyze your test executions</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Error message */}
                    {error && (
                        <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-900">
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {filterSection}
                </CardContent>
            </Card>

            {/* Test Runs Table */}
            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Test Run ID</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Env</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                                        <p className="mt-2 text-sm text-muted-foreground">Loading test runs...</p>
                                    </TableCell>
                                </TableRow>
                            ) : filteredRuns.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        No test runs found matching your filters
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRuns.map((run) => (
                                    <TableRow
                                        key={run._id}
                                        className="hover:bg-muted/50 cursor-pointer"
                                        onClick={() => navigateToRunDetails(run._id)}
                                    >
                                        <TableCell className="font-medium">{run._id}</TableCell>
                                        <TableCell>{formatDateTime(run.startTime)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                {(run.duration / 1000).toFixed(1)}s
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`h-2 w-2 rounded-full ${statusConfig[run.status]?.bgColor || 'bg-gray-200'
                                                    }`}></div>
                                                <span className="capitalize">{run.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {run.tags.map((tag: string) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex items-left gap-1.5 flex-col">
                                            <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                                                {run.ci ? <GitBranch className="h-3 w-3" /> : <Terminal className="h-3 w-3" />}
                                                {run.ci ? run.metadata.branchName : run.environment}
                                            </Badge>
                                            {run.ci && (
                                                <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                                                    <GitCommit className="h-3 w-3" />
                                                    {run.metadata.commitHash}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigateToRunDetails(run._id)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Download Results</DropdownMenuItem>
                                                    <DropdownMenuItem>Re-run Tests</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination info */}
                    {!isLoading && filteredRuns.length > 0 && pagination && (
                        <div className="py-2 px-4 text-sm text-muted-foreground border-t flex justify-between items-center">
                            <div>
                                Showing {filteredRuns.length} of {pagination.total} results
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page <= 1}
                                    onClick={handlePreviousPage}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page >= pagination.pages}
                                    onClick={handleNextPage}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Test Details */}
            {selectedTest && (
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle>Test Case Details</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setSelectedTest(null)}
                        >
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-medium text-lg">{selectedTest.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1.5">
                                        {statusConfig[selectedTest.status]?.icon}
                                        <span className="text-sm capitalize">{selectedTest.status}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {selectedTest.duration}
                                    </div>
                                </div>
                            </div>

                            {selectedTest.error && (
                                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-900">
                                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">Error</h4>
                                    <p className="text-sm text-red-700 dark:text-red-400">{selectedTest.error}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default TestContent;