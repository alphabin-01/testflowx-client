import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { API_ENDPOINTS } from '@/lib/api';
import { apiRequest, STATUS } from '@/lib/api-client';
import { TestCase, TestSuite } from '@/lib/typers';
import { CheckCircle, Clock, XCircle, AlertCircle, SkipForward } from 'lucide-react';
import TestDetailsDrawer from '../component/test-details-drawer';
import { Loader } from '@/components/ui/loader';
// Helper function to format duration
const formatDuration = (ms: number): string => {
    if (!ms) return "N/A";
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
};

// Status configuration for consistent styling
const STATUS_CONFIG = {
    'completed': {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        color: 'bg-green-500'
    },
    'passed': {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        color: 'bg-green-500'
    },
    'failed': {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        color: 'bg-red-500'
    },
    'flaky': {
        icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
        color: 'bg-yellow-500'
    },
    'skipped': {
        icon: <SkipForward className="h-4 w-4 text-blue-500" />,
        color: 'bg-blue-500'
    }
};

// Component props interface
interface TestSuiteItemProps {
    suite: TestSuite;
}

// Test case table component for better organization
const TestCaseTable = ({ testCases, fetchTestCasesDetails }: { testCases: TestCase[], fetchTestCasesDetails: (testCase: TestCase) => void }) => {
    return (
        <div className="w-full overflow-x-auto rounded-md border">
            <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Test Case
                        </th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                        </th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {testCases.map(testCase => (
                        <tr key={testCase._id} className="hover:bg-muted/30 cursor-pointer" onClick={() => {
                            fetchTestCasesDetails(testCase);
                        }}>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    {STATUS_CONFIG[testCase.status]?.icon || <Clock className="h-4 w-4" />}
                                    <span>{testCase.title}</span>
                                </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right text-xs text-muted-foreground">
                                {testCase.duration ? formatDuration(testCase.duration) : '0s'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right">
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs text-white ${STATUS_CONFIG[testCase.status]?.color || 'bg-slate-400'}`}
                                >
                                    {testCase.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Main component
const TestSuiteItem = ({ suite }: TestSuiteItemProps) => {
    const [expanded, setExpanded] = useState(false);
    const [testCases, setTestCases] = useState<TestCase[]>(suite.testCases || []);
    const [loading, setLoading] = useState(false);
    const [selectedTest, setSelectedTest] = useState<TestCase | undefined>(undefined);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const fetchTestCases = async (suiteId: string) => {
        setLoading(true);
        try {
            const response = await apiRequest(
                API_ENDPOINTS.testCases.getTestCasesBySuiteId(suiteId)
            );

            if (response.status === STATUS.SUCCESS) {
                // Type assertion for the response data
                const responseData = response.data as { testCases: TestCase[] };
                setTestCases(responseData.testCases);
            }
        } catch (error) {
            console.error("Failed to fetch test cases:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuiteClick = () => {
        const newExpandedState = !expanded;
        setExpanded(newExpandedState);

        // Only fetch test cases when expanding and none are already loaded
        if (newExpandedState && testCases.length === 0) {
            fetchTestCases(suite._id);
        }
    };

    const handleTestCaseClick = (testCase: TestCase) => {
        setSelectedTest(testCase);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedTest(undefined);
    };

    // Render test cases content based on loading and data state
    const renderTestCasesContent = () => {
        if (loading) {
            return (
                <div className="py-4 text-center text-muted-foreground">
                    <Loader />
                    Loading test cases...
                </div>
            );
        }

        if (testCases.length === 0) {
            return (
                <div className="py-4 text-center text-muted-foreground">
                    No test cases found for this suite.
                </div>
            );
        }

        return <TestCaseTable testCases={testCases} fetchTestCasesDetails={handleTestCaseClick} />;
    };

    return (
        <React.Fragment>
            {/* Main suite row */}
            <TableRow
                className="hover:bg-muted/50 cursor-pointer"
                onClick={handleSuiteClick}
            >
                <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        {suite.name}
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs">{suite.testStats.passed}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-xs">{suite.testStats.failed}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-xs">{suite.testStats.flaky}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-slate-400" />
                            <span className="text-xs">{suite.testStats.skipped}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">
                        {formatDuration(suite.duration || 0)}
                    </span>
                </TableCell>
            </TableRow>

            {/* Expanded test cases section */}
            {expanded && (
                <TableRow className="bg-muted/20">
                    <TableCell colSpan={4} className="p-0">
                        <div className="px-4 py-2">
                            {renderTestCasesContent()}
                        </div>
                    </TableCell>
                </TableRow>
            )}

            {/* Test Details Drawer */}
            <TestDetailsDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                test={selectedTest}
            />
        </React.Fragment>
    );
};

export default TestSuiteItem;