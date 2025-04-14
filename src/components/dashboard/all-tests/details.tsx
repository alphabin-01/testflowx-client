"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Import UI components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

// Import icons
import {
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clock,
    Download,
    ExternalLink,
    FolderKanban,
    GitBranch,
    HomeIcon,
    Info,
    PlayCircle,
    RefreshCw,
    Terminal,
    XCircle
} from 'lucide-react';

// Import components
import BreadcrumbNav from '@/components/dashboard/component/breadcumb';

// Dynamically import the TestDetailsDrawer to avoid hydration issues
const TestDetailsDrawer = dynamic(
    () => import('@/components/dashboard/component/test-details-drawer'),
    { ssr: false }
);

// Types
export type TestStatus = 'completed' | 'failed' | 'flaky' | 'skipped';
type Environment = 'CI' | 'local';

interface TestCase {
    id: string;
    name: string;
    duration: string;
    status: TestStatus;
    error?: string;
    steps?: {
        name: string;
        status: TestStatus;
        duration: string;
        screenshot?: string;
    }[];
}

interface TestSuite {
    id: string;
    name: string;
    duration: string;
    status: TestStatus;
    testCases: TestCase[];
}

interface TestRun {
    id: string;
    startTime: string;
    duration: string;
    status: TestStatus;
    tags: string[];
    environment: Environment;
    gitBranch?: string;
    gitCommit?: string;
    browser?: string;
    runBy?: string;
    testSuites: TestSuite[];
}

interface StatusIndicator {
    color: string;
    bgColor: string;
    icon: React.ReactNode;
}

// Mock data fetching function - in a real app, this would be an API call
const fetchTestRun = (id: string): TestRun => {
    // This is mock data - in a real app, you would fetch this from an API
    const testRunsData: Record<string, TestRun> = {
        'run-123': {
            id: 'run-123',
            startTime: '2023-06-10T14:30:00Z',
            duration: '1m 32s',
            status: 'completed',
            tags: ['regression', 'main'],
            environment: 'CI',
            gitBranch: 'main',
            gitCommit: 'abc123',
            browser: 'Chrome',
            runBy: 'CI Pipeline',
            testSuites: [
                {
                    id: 'suite-1',
                    name: 'Authentication Tests',
                    duration: '35s',
                    status: 'completed',
                    testCases: [
                        {
                            id: 'test-1',
                            name: 'Should login with valid credentials',
                            duration: '12s',
                            status: 'completed',
                            steps: [
                                { name: 'Navigate to login page', status: 'completed', duration: '2s' },
                                { name: 'Enter username', status: 'completed', duration: '1s' },
                                { name: 'Enter password', status: 'completed', duration: '1s' },
                                { name: 'Click login button', status: 'completed', duration: '8s' },
                            ]
                        },
                        {
                            id: 'test-2',
                            name: 'Should show error with invalid credentials',
                            duration: '10s',
                            status: 'completed',
                            steps: [
                                { name: 'Navigate to login page', status: 'completed', duration: '2s' },
                                { name: 'Enter invalid username', status: 'completed', duration: '1s' },
                                { name: 'Enter invalid password', status: 'completed', duration: '1s' },
                                { name: 'Click login button', status: 'completed', duration: '6s' },
                            ]
                        },
                        {
                            id: 'test-3',
                            name: 'Should logout completedfully',
                            duration: '13s',
                            status: 'completed',
                            steps: [
                                { name: 'Login to application', status: 'completed', duration: '6s' },
                                { name: 'Click logout button', status: 'completed', duration: '7s' },
                            ]
                        },
                    ],
                },
                {
                    id: 'suite-2',
                    name: 'Product Page Tests',
                    duration: '57s',
                    status: 'completed',
                    testCases: [
                        {
                            id: 'test-4',
                            name: 'Should display product details',
                            duration: '15s',
                            status: 'completed',
                            steps: [
                                { name: 'Navigate to product page', status: 'completed', duration: '5s' },
                                { name: 'Verify product title', status: 'completed', duration: '5s' },
                                { name: 'Verify product price', status: 'completed', duration: '5s' },
                            ]
                        },
                        {
                            id: 'test-5',
                            name: 'Should add product to cart',
                            duration: '22s',
                            status: 'completed',
                            steps: [
                                { name: 'Navigate to product page', status: 'completed', duration: '5s' },
                                { name: 'Click add to cart button', status: 'completed', duration: '8s' },
                                { name: 'Verify cart updated', status: 'completed', duration: '9s' },
                            ]
                        },
                        {
                            id: 'test-6',
                            name: 'Should update product quantity',
                            duration: '20s',
                            status: 'completed',
                            steps: [
                                { name: 'Navigate to cart page', status: 'completed', duration: '5s' },
                                { name: 'Update product quantity', status: 'completed', duration: '8s' },
                                { name: 'Verify cart total updated', status: 'completed', duration: '7s' },
                            ]
                        },
                    ],
                },
            ],
        },
        'run-122': {
            id: 'run-122',
            startTime: '2023-06-09T10:15:00Z',
            duration: '2m 05s',
            status: 'failed',
            tags: ['feature', 'checkout'],
            environment: 'CI',
            gitBranch: 'feature/checkout',
            gitCommit: 'def456',
            browser: 'Firefox',
            runBy: 'CI Pipeline',
            testSuites: [
                {
                    id: 'suite-3',
                    name: 'Checkout Tests',
                    duration: '1m 25s',
                    status: 'failed',
                    testCases: [
                        {
                            id: 'test-7',
                            name: 'Should proceed to checkout',
                            duration: '18s',
                            status: 'completed',
                            steps: [
                                { name: 'Navigate to cart page', status: 'completed', duration: '5s' },
                                { name: 'Click checkout button', status: 'completed', duration: '13s' },
                            ]
                        },
                        {
                            id: 'test-8',
                            name: 'Should complete payment process',
                            duration: '42s',
                            status: 'failed',
                            error: 'Payment gateway timeout after 30s',
                            steps: [
                                { name: 'Enter payment details', status: 'completed', duration: '10s' },
                                { name: 'Submit payment form', status: 'failed', duration: '32s', screenshot: '/mock-screenshots/payment-error.jpg' },
                            ]
                        },
                        {
                            id: 'test-9',
                            name: 'Should show order confirmation',
                            duration: '25s',
                            status: 'skipped',
                            steps: []
                        },
                    ],
                },
                {
                    id: 'suite-4',
                    name: 'User Profile Tests',
                    duration: '40s',
                    status: 'completed',
                    testCases: [
                        {
                            id: 'test-10',
                            name: 'Should update user profile',
                            duration: '22s',
                            status: 'completed',
                            steps: [
                                { name: 'Navigate to profile page', status: 'completed', duration: '5s' },
                                { name: 'Update profile information', status: 'completed', duration: '10s' },
                                { name: 'Save profile', status: 'completed', duration: '7s' },
                            ]
                        },
                        {
                            id: 'test-11',
                            name: 'Should change password',
                            duration: '18s',
                            status: 'completed',
                            steps: [
                                { name: 'Navigate to profile page', status: 'completed', duration: '5s' },
                                { name: 'Enter new password', status: 'completed', duration: '5s' },
                                { name: 'Confirm new password', status: 'completed', duration: '8s' },
                            ]
                        },
                    ],
                },
            ],
        },
        'run-121': {
            id: 'run-121',
            startTime: '2023-06-08T16:45:00Z',
            duration: '1m 58s',
            status: 'flaky',
            tags: ['smoke', 'critical'],
            environment: 'local',
            browser: 'Chrome',
            runBy: 'John Developer',
            testSuites: [
                {
                    id: 'suite-5',
                    name: 'Critical Path Tests',
                    duration: '1m 58s',
                    status: 'flaky',
                    testCases: [
                        {
                            id: 'test-12',
                            name: 'Should load homepage',
                            duration: '15s',
                            status: 'completed',
                            steps: [
                                { name: 'Navigate to homepage', status: 'completed', duration: '15s' },
                            ]
                        },
                        {
                            id: 'test-13',
                            name: 'Should navigate through main menu',
                            duration: '23s',
                            status: 'completed',
                            steps: [
                                { name: 'Click category menu', status: 'completed', duration: '8s' },
                                { name: 'Verify sub-menu appears', status: 'completed', duration: '5s' },
                                { name: 'Click sub-menu item', status: 'completed', duration: '10s' },
                            ]
                        },
                        {
                            id: 'test-14',
                            name: 'Should search for products',
                            duration: '40s',
                            status: 'flaky',
                            error: 'Test passed on retry',
                            steps: [
                                { name: 'Type in search box', status: 'completed', duration: '5s' },
                                { name: 'Submit search', status: 'flaky', duration: '25s', screenshot: '/mock-screenshots/search-retry.jpg' },
                                { name: 'Verify search results', status: 'completed', duration: '10s' },
                            ]
                        },
                        {
                            id: 'test-15',
                            name: 'Should complete checkout process',
                            duration: '40s',
                            status: 'completed',
                            steps: [
                                { name: 'Add product to cart', status: 'completed', duration: '10s' },
                                { name: 'Proceed to checkout', status: 'completed', duration: '12s' },
                                { name: 'Complete payment', status: 'completed', duration: '18s' },
                            ]
                        },
                    ],
                },
            ],
        },
    };

    return testRunsData[id] || {
        id,
        startTime: new Date().toISOString(),
        duration: 'N/A',
        status: 'failed',
        tags: ['unknown'],
        environment: 'CI',
        testSuites: [],
    };
};

// Status indicators and styles - moved outside component to prevent re-creation on each render
const statusIndicator: Record<TestStatus, StatusIndicator> = {
    completed: {
        color: 'text-green-500',
        bgColor: 'bg-green-500',
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    failed: {
        color: 'text-red-500',
        bgColor: 'bg-red-500',
        icon: <XCircle className="h-4 w-4 text-red-500" />
    },
    flaky: {
        color: 'text-amber-500',
        bgColor: 'bg-amber-500',
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />
    },
    skipped: {
        color: 'text-gray-500',
        bgColor: 'bg-gray-500',
        icon: <Clock className="h-4 w-4 text-gray-500" />
    },
};

// Helper functions
const formatDateTime = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('default', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }).format(date);
    } catch (e) {
        console.error('Error formatting date:', e);
        return dateString; // fallback if date parsing fails
    }
};

const getTotalCounts = (testRun: TestRun) => {
    let total = 0;
    let passed = 0;
    let failed = 0;
    let flaky = 0;
    let skipped = 0;

    testRun.testSuites.forEach(suite => {
        suite.testCases.forEach(testCase => {
            total++;
            if (testCase.status === 'completed') passed++;
            else if (testCase.status === 'failed') failed++;
            else if (testCase.status === 'flaky') flaky++;
            else if (testCase.status === 'skipped') skipped++;
        });
    });

    return { total, passed, failed, flaky, skipped };
};

export default function TestRunPage({ projectId }: { projectId: string }) {
    const params = useParams();
    const runId = typeof params?.test === 'string' ? params.test : '';

    // State management
    const [testRun, setTestRun] = useState<TestRun | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedSuites, setExpandedSuites] = useState<string[]>([]);
    const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Handle client-side only code
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch test run data
    useEffect(() => {
        if (!runId) return;

        try {
            const data = fetchTestRun(runId);
            setTestRun(data);
            // Initialize expanded suites state once we have the data
            setExpandedSuites(data.testSuites.map(suite => suite.id));
        } catch (error) {
            console.error('Error fetching test run:', error);
        } finally {
            setLoading(false);
        }
    }, [runId]);

    // UI interaction handlers
    const toggleSuiteExpansion = (suiteId: string) => {
        setExpandedSuites(prev =>
            prev.includes(suiteId)
                ? prev.filter(id => id !== suiteId)
                : [...prev, suiteId]
        );
    };

    // Convert TestCase to TestDetails format for the drawer
    const mapTestCaseToTestDetails = (testCase: TestCase) => {
        if (!testRun) return null;

        const testError = testCase.error ? {
            message: testCase.error,
            stack: '',
            screenshot: testCase.steps?.find(step => step.screenshot)?.screenshot
        } : undefined;

        return {
            id: testCase.id,
            name: testCase.name,
            module: testRun.testSuites.find(suite =>
                suite.testCases.some(tc => tc.id === testCase.id)
            )?.name || '',
            failureType: testCase.status === 'failed' ? 'Bug' :
                testCase.status === 'flaky' ? 'Flaky' :
                    testCase.status === 'skipped' ? 'UI Change' : '',
            failureRate: '25%', // This would come from actual data in a real app
            priority: 'Medium', // This would be determined by logic in a real app
            lastRun: testRun.startTime ? formatDateTime(testRun.startTime) : '',
            duration: testCase.duration,
            error: testError,
            history: [
                // Mock history data - in a real app, this would come from an API
                { date: formatDateTime(testRun.startTime || ''), status: testCase.status === 'completed' ? 'Pass' : 'Fail' },
                { date: '1 day ago', status: 'Pass' },
                { date: '3 days ago', status: 'Pass' },
                { date: '1 week ago', status: 'Fail' },
            ]
        };
    };

    const handleTestCaseClick = (testCase: TestCase) => {
        setSelectedTestCase(testCase);
        setDrawerOpen(true);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <p>Loading test run details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!testRun) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <p>Test run not found</p>
                    <Button asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const counts = getTotalCounts(testRun);

    const breadcrumbLinks = [
        { label: "Home", href: `/projects/${projectId}`, icon: <HomeIcon size={16} /> },
        { label: "Projects", href: `/projects/${projectId}/tests`, icon: <FolderKanban size={16} /> },
        { label: "Test Run", icon: <PlayCircle size={16} /> },
    ];

    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-col space-y-1.5">
                <BreadcrumbNav links={breadcrumbLinks} />
            </div>

            {/* Test Run Header */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                Test Run: {testRun.id}
                                <Badge
                                    className={`ml-2 capitalize ${statusIndicator[testRun.status].color}`}
                                >
                                    {testRun.status}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                {isClient ? (
                                    <>Started at {formatDateTime(testRun.startTime)} • Duration: {testRun.duration}</>
                                ) : (
                                    <>Started at {testRun.startTime} • Duration: {testRun.duration}</>
                                )}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Export
                            </Button>
                            <Button variant="outline" size="sm">
                                <PlayCircle className="h-4 w-4 mr-1" />
                                Re-run
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col border rounded-md p-3">
                            <span className="text-sm text-muted-foreground">Environment</span>
                            <div className="flex items-center gap-1 mt-1">
                                {testRun.environment === 'CI' ? (
                                    <GitBranch className="h-4 w-4" />
                                ) : (
                                    <Terminal className="h-4 w-4" />
                                )}
                                <span className="font-medium">{testRun.environment}</span>
                            </div>
                        </div>
                        {testRun.gitBranch && (
                            <div className="flex flex-col border rounded-md p-3">
                                <span className="text-sm text-muted-foreground">Git Branch</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <GitBranch className="h-4 w-4" />
                                    <span className="font-medium">{testRun.gitBranch}</span>
                                </div>
                            </div>
                        )}
                        {testRun.browser && (
                            <div className="flex flex-col border rounded-md p-3">
                                <span className="text-sm text-muted-foreground">Browser</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="font-medium">{testRun.browser}</span>
                                </div>
                            </div>
                        )}
                        {testRun.runBy && (
                            <div className="flex flex-col border rounded-md p-3">
                                <span className="text-sm text-muted-foreground">Run By</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <Info className="h-4 w-4" />
                                    <span className="font-medium">{testRun.runBy}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {testRun.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Test Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Test Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-5 gap-4 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{counts.total}</span>
                            <span className="text-sm text-muted-foreground">Total</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-green-500">{counts.passed}</span>
                            <span className="text-sm text-muted-foreground">Passed</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-red-500">{counts.failed}</span>
                            <span className="text-sm text-muted-foreground">Failed</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-amber-500">{counts.flaky}</span>
                            <span className="text-sm text-muted-foreground">Flaky</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-500">{counts.skipped}</span>
                            <span className="text-sm text-muted-foreground">Skipped</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Test Suites & Cases */}
            {isClient && (
                <Card>
                    <CardHeader>
                        <CardTitle>Test Suites</CardTitle>
                        <CardDescription>
                            {testRun.testSuites.length} suites, {counts.total} test cases
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {testRun.testSuites.map((suite) => (
                                <div key={suite.id} className="border rounded-md">
                                    <div
                                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                                        onClick={() => toggleSuiteExpansion(suite.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {expandedSuites.includes(suite.id) ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                            <div className="font-medium">{suite.name}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`h-2 w-2 rounded-full ${statusIndicator[suite.status].bgColor}`}></div>
                                                <span className="text-sm capitalize">{suite.status}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {suite.duration}
                                            </div>
                                        </div>
                                    </div>

                                    {expandedSuites.includes(suite.id) && (
                                        <div className="border-t p-3">
                                            <div className="border rounded-md">
                                                <div className="grid grid-cols-3 bg-muted/50 p-2">
                                                    <div className="font-medium text-sm">Test Case</div>
                                                    <div className="font-medium text-sm">Duration</div>
                                                    <div className="font-medium text-sm">Status</div>
                                                </div>
                                                {suite.testCases.map((testCase) => (
                                                    <div
                                                        key={testCase.id}
                                                        className="grid grid-cols-3 p-2 border-t hover:bg-muted/30 cursor-pointer"
                                                        onClick={() => handleTestCaseClick(testCase)}
                                                    >
                                                        <div>{testCase.name}</div>
                                                        <div>{testCase.duration}</div>
                                                        <div className="flex items-center gap-1.5">
                                                            {statusIndicator[testCase.status].icon}
                                                            <span className="text-sm capitalize">
                                                                {testCase.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Test Details Drawer - Only render when drawer is open and we're on the client */}
            {isClient && selectedTestCase && drawerOpen && (
                <TestDetailsDrawer
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    test={mapTestCaseToTestDetails(selectedTestCase)}
                />
            )}
        </div>
    );
}