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
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTestRun } from '@/hooks/dashboard/useTestRun';
import { statusConfig as baseStatusConfig, TestCase } from '@/lib/typers';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    Filter,
    RefreshCw,
    Search,
    Tag,
    XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Initialize with icons, just like in details.tsx
const statusConfig = {
    ...baseStatusConfig,
    completed: {
        ...baseStatusConfig.completed,
        icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
        bgColor: 'bg-emerald-500',
        textColor: 'text-emerald-700',
        bgLight: 'bg-emerald-50'
    },
    failed: {
        ...baseStatusConfig.failed,
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        bgColor: 'bg-red-500',
        textColor: 'text-red-700',
        bgLight: 'bg-red-50'
    },
    flaky: {
        ...baseStatusConfig.flaky,
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        bgColor: 'bg-amber-500',
        textColor: 'text-amber-700',
        bgLight: 'bg-amber-50'
    },
    skipped: {
        ...baseStatusConfig.skipped,
        icon: <Clock className="h-4 w-4 text-slate-500" />,
        bgColor: 'bg-slate-500',
        textColor: 'text-slate-700',
        bgLight: 'bg-slate-50'
    }
};

const TestRunItem = ({ run, navigateToRunDetails, toggleTag, filters }: { run: any, navigateToRunDetails: any, toggleTag: any, filters: any }) => {
    // Format date/time in a consistent way
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div
            className="border rounded-lg px-3 py-2 mb-2 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            onClick={() => navigateToRunDetails(run._id)}
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                {/* Left column - Status and ID */}
                <div className="flex items-start gap-3" style={{ alignItems: 'center' }}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${statusConfig[run.status as keyof typeof statusConfig]?.bgLight || 'bg-slate-100'}`}>
                        {statusConfig[run.status as keyof typeof statusConfig]?.icon || <Clock className="h-5 w-5 text-slate-500" />}
                    </div>

                    <div>
                        <h3 className="font-medium text-sm flex items-center">
                            <span className="mr-2 capitalize">{run.metadata.commitMessage}</span>
                            <Badge variant="outline" className="text-xs font-normal">
                                ID: {run._id}
                            </Badge>
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                            <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{formatDateTime(run.startTime)}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>{(run.duration / 1000).toFixed(1)}s</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap mt-2 gap-1.5">
                            {run.tags.map((tag: string) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!filters.tags?.includes(tag)) {
                                            toggleTag(tag);
                                        }
                                    }}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column - Environment info */}
                <div className="flex flex-col items-start md:items-end gap-2">
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {run.ci ? run.metadata?.branchName === 'main' ? 'Production' : 'SandBox' : run.environment}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

const TestRunListSkeleton = () => {
    return (
        <>
            {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-3 mb-2">
                    <div className="flex items-start gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="w-full">
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-28 mb-2" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

const TestContent = ({ projectId }: { projectId: string }) => {
    const router = useRouter();
    const {
        testRuns,
        isLoading,
        error,
        pagination,
        filters,
        applyFilters,
        fetchTestRuns,
        goToPage
    } = useTestRun();

    const [selectedTest, setSelectedTest] = useState<TestCase | null>(null);
    const [localSearchTerm, setLocalSearchTerm] = useState('');

    // Local filter states for UI
    const [branchOptions, setBranchOptions] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    // Track if the filters have been applied and API request is pending
    const [filtersChanged, setFiltersChanged] = useState(false);

    // Initialize local search term from filters - but only once
    useEffect(() => {
        setLocalSearchTerm(filters.searchTerm || '');
    }, []);  // Empty dependency array means this runs only once

    // Extract unique branches and tags from data
    useEffect(() => {
        if (testRuns.length > 0) {
            // Extract unique branches
            const branches = new Set<string>();
            testRuns.forEach(run => {
                if (run.ci && run.metadata?.branchName) {
                    branches.add(run.metadata.branchName);
                }
            });
            setBranchOptions(Array.from(branches));

            // Extract unique tags
            const tags = new Set<string>();
            testRuns.forEach(run => {
                if (run.tags && Array.isArray(run.tags)) {
                    run.tags.forEach(tag => tags.add(tag));
                }
            });
            setAvailableTags(Array.from(tags));
        }
    }, [testRuns]);  // Only depend on testRuns

    // Apply search term filter with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearchTerm !== filters.searchTerm) {
                applyFilters({ searchTerm: localSearchTerm });
                setFiltersChanged(true);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localSearchTerm, filters.searchTerm, applyFilters]);

    // Reset filter changes indicator when loading completes
    useEffect(() => {
        if (!isLoading) {
            setFiltersChanged(false);
        }
    }, [isLoading]);

    // Navigate to run details page
    const navigateToRunDetails = useCallback((runId: string) => {
        router.push(`/projects/${projectId}/test-run/${runId}`);
    }, [projectId, router]);

    // Handle filter changes - these now trigger API requests
    const handleStatusChange = useCallback((status: string) => {
        applyFilters({ status });
        setFiltersChanged(true);
    }, [applyFilters]);

    const handleBranchChange = useCallback((branch: string) => {
        applyFilters({ branch: branch === 'all' ? '' : branch });
        setFiltersChanged(true);
    }, [applyFilters]);

    const toggleTag = useCallback((tag: string) => {
        applyFilters({
            tags: filters.tags?.includes(tag)
                ? filters.tags.filter(t => t !== tag)
                : [...(filters.tags || []), tag]
        });
        setFiltersChanged(true);
    }, [applyFilters, filters.tags]);

    const clearAllTags = useCallback(() => {
        applyFilters({ tags: [] });
        setFiltersChanged(true);
    }, [applyFilters]);

    const clearAllFilters = useCallback(() => {
        setLocalSearchTerm('');
        applyFilters({
            status: 'All',
            branch: '',
            tags: [],
            searchTerm: ''
        });
        setFiltersChanged(true);
    }, [applyFilters]);

    const handleRefreshClick = useCallback(() => {
        fetchTestRuns(pagination.page, pagination.limit, filters, true);
        setFiltersChanged(true);
    }, [fetchTestRuns, pagination.page, pagination.limit, filters]);

    const handlePreviousPage = useCallback(() => {
        goToPage(pagination.page - 1);
        setFiltersChanged(true);
    }, [goToPage, pagination.page]);

    const handleNextPage = useCallback(() => {
        goToPage(pagination.page + 1);
        setFiltersChanged(true);
    }, [goToPage, pagination.page]);

    // Count active filters for badge display
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.status && filters.status !== 'All') count++;
        if (filters.branch) count++;
        if (filters.tags && filters.tags.length > 0) count++;
        if (filters.searchTerm) count++;
        return count;
    }, [filters]);

    // Filter section UI
    const filterSection = useMemo(() => (
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search test runs..."
                        className="pl-8"
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Select
                        value={filters.status || 'All'}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="flaky">Flaky</SelectItem>
                            <SelectItem value="skipped">Skipped</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.branch || 'all'}
                        onValueChange={handleBranchChange}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            {branchOptions.map(branch => (
                                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-1">
                                <Tag className="h-4 w-4" />
                                Tags {filters.tags && filters.tags.length > 0 && `(${filters.tags.length})`}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px] p-2">
                            {availableTags.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-1 px-2">No tags available</p>
                            ) : (
                                <div className="max-h-[200px] overflow-y-auto">
                                    {availableTags.map(tag => (
                                        <div key={tag} className="flex items-center py-1 px-2 hover:bg-muted rounded">
                                            <Button
                                                variant={filters.tags?.includes(tag) ? "default" : "outline"}
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
                            {filters.tags && filters.tags.length > 0 && (
                                <Button
                                    variant="ghost"
                                    className="w-full mt-2 h-7 text-xs"
                                    onClick={clearAllTags}
                                >
                                    Clear tags
                                </Button>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {activeFilterCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={clearAllFilters}
                        >
                            <Filter className="h-4 w-4" />
                            Clear Filters ({activeFilterCount})
                        </Button>
                    )}
                </div>
            </div>

            {/* Display selected tag filters */}
            {filters.tags && filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {filters.tags.map(tag => (
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

            {/* Show loading indicator during filter changes */}
            {filtersChanged && isLoading && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Updating results...
                </div>
            )}
        </div>
    ), [
        localSearchTerm,
        filters,
        availableTags,
        branchOptions,
        activeFilterCount,
        handleStatusChange,
        handleBranchChange,
        toggleTag,
        clearAllTags,
        clearAllFilters,
        filtersChanged,
        isLoading
    ]);

    // Main component render
    return (
        <div className="space-y-4">
            <CardHeader className="p-0 gap-0">
                <div className="flex items-center justify-between">
                    <CardTitle className='text-xl'>Test Runs</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={handleRefreshClick}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
                <CardDescription>Browse and analyze your test executions</CardDescription>
            </CardHeader>
            {/* <CardContent className='p-0'>
                {error && (
                    <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-900">
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                {filterSection}
            </CardContent> */}
            {/* Pagination controls */}
            {/* {!isLoading && testRuns.length > 0 && pagination && (
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Showing {testRuns.length} of {pagination.total} results
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
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
            )} */}



            <CardContent className='p-0'>
                {isLoading ? (
                    <TestRunListSkeleton />
                ) : testRuns.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                        <p className="text-muted-foreground">No test runs found matching your filters</p>
                    </div>
                ) : (
                    <div>
                        {testRuns.map((run) => (
                            <TestRunItem
                                key={run._id}
                                run={run}
                                navigateToRunDetails={navigateToRunDetails}
                                toggleTag={toggleTag}
                                filters={filters}
                            />
                        ))}
                    </div>
                )}


            </CardContent>

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