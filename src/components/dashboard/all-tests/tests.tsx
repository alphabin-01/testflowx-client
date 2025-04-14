import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Filter,
    GitBranch,
    GitCommit,
    MoreVertical,
    RefreshCw,
    Search,
    Terminal,
    XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback, useMemo } from 'react';
import { TestStatus } from '@/components/dashboard/all-tests/details';
// Sample tags for the dropdown (replace with actual tags from your data)
const allTags = ['frontend', 'backend', 'api', 'performance', 'e2e', 'integration', 'unit'];

interface StatusIndicator {
    color: string;
    icon: React.ReactNode;
}

// Status indicators and styles
const statusIndicator: Record<TestStatus, StatusIndicator> = {
    completed: { color: 'bg-green-500', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
    failed: { color: 'bg-red-500', icon: <XCircle className="h-4 w-4 text-red-500" /> },
    flaky: { color: 'bg-amber-500', icon: <AlertTriangle className="h-4 w-4 text-amber-500" /> },
    skipped: { color: 'bg-gray-500', icon: <Clock className="h-4 w-4 text-gray-500" /> },
};

// Filter options
const statusOptions = ['All', 'Success', 'Failed', 'Flaky'];
const environmentOptions = ['All', 'CI', 'Local'];

const TestContent = ({ projectId }: { projectId: string }) => {
    const router = useRouter();
    const { isLoading, error, fetchTestRuns, getFilteredRuns, pagination } = useTestRun();
    const [selectedTest, setSelectedTest] = useState<TestCase | null>(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('All');
    const [envFilter, setEnvFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Use the hook to get filtered runs
    const filteredRuns = useMemo(() =>
        getFilteredRuns(statusFilter, envFilter, searchTerm, selectedTags),
        [getFilteredRuns, statusFilter, envFilter, searchTerm, selectedTags]
    );

    // Use effect to fetch test runs on component mount
    React.useEffect(() => {
        fetchTestRuns();
    }, [fetchTestRuns]);

    // Format date/time
    const formatDateTime = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    }, []);

    // Toggle tag selection
    const toggleTagSelection = useCallback((tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    }, []);

    // Add a function to navigate to test run details
    const navigateToRunDetails = useCallback((runId: string) => {
        router.push(`/projects/${projectId}/test-run/${runId}`);
    }, [projectId, router]);

    const clearAllTags = useCallback(() => setSelectedTags([]), []);

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
                            onClick={() => fetchTestRuns()}
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
                                        {statusOptions.map((status) => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={envFilter} onValueChange={setEnvFilter}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Environment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {environmentOptions.map((env) => (
                                            <SelectItem key={env} value={env}>{env}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex gap-1">
                                            <Filter className="h-4 w-4" />
                                            Tags
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        {allTags.map((tag) => (
                                            <DropdownMenuItem key={tag} className="flex gap-2 items-center">
                                                <Checkbox
                                                    checked={selectedTags.includes(tag)}
                                                    onCheckedChange={() => toggleTagSelection(tag)}
                                                    id={`tag-${tag}`}
                                                />
                                                <label htmlFor={`tag-${tag}`} className="flex-1 cursor-pointer">{tag}</label>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.map(tag => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="cursor-pointer"
                                        onClick={() => toggleTagSelection(tag)}
                                    >
                                        {tag}
                                        <XCircle className="ml-1 h-3 w-3" />
                                    </Badge>
                                ))}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                    onClick={clearAllTags}
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}
                    </div>
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
                                        key={run.id}
                                        className="hover:bg-muted/50 cursor-pointer"
                                        onClick={() => navigateToRunDetails(run.id)}
                                    >
                                        <TableCell className="font-medium">{run.id}</TableCell>
                                        <TableCell>{formatDateTime(run.startTime)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                {(run.duration / 1000).toFixed(1)}s
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`h-2 w-2 rounded-full ${statusIndicator[run.status as TestStatus].color}`}></div>
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
                                                    <DropdownMenuItem onClick={() => navigateToRunDetails(run.id)}>
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
                                    onClick={() => fetchTestRuns(pagination.page - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page >= pagination.pages}
                                    onClick={() => fetchTestRuns(pagination.page + 1)}
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
                                        {statusIndicator[selectedTest.status]?.icon}
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

                            {/* Additional test details would go here */}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default TestContent; 