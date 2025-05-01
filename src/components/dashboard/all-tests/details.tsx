'use client'

import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useTestDetail } from "@/hooks/dashboard/useTestDetail";
import { TestSuite } from "@/lib/typers";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Computer,
    GitBranch,
    RefreshCw,
    XCircle
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import TestSuiteItem from "./item";

// Status configuration for consistent styling
const STATUS_CONFIG = {
    completed: {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        color: "bg-green-500"
    },
    failed: {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        color: "bg-red-500"
    },
    running: {
        icon: <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />,
        color: "bg-blue-500"
    },
    flaky: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        color: "bg-amber-500"
    },
    skipped: {
        icon: <AlertCircle className="h-4 w-4 text-slate-400" />,
        color: "bg-slate-400"
    }
};

// Helper function to format duration
const formatDuration = (ms: number): string => {
    if (!ms) return "N/A";
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
};


// Component to render the stats cards
const TestStatsCards = ({ stats }: { stats: { total: number; passed: number; failed: number; flaky: number; skipped: number; } }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border p-4 flex flex-col">
                <span className="text-sm text-muted-foreground">Total Tests</span>
                <span className="text-2xl font-bold">{stats.total}</span>
            </div>
            <div className="bg-white rounded-lg border p-4 flex flex-col">
                <span className="text-sm text-muted-foreground">Passed</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">{stats.passed}</span>
                    {STATUS_CONFIG.completed.icon}
                </div>
            </div>
            <div className="bg-white rounded-lg border p-4 flex flex-col">
                <span className="text-sm text-muted-foreground">Failed</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-600">{stats.failed}</span>
                    {STATUS_CONFIG.failed.icon}
                </div>
            </div>
            <div className="bg-white rounded-lg border p-4 flex flex-col">
                <span className="text-sm text-muted-foreground">Flaky</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-600">{stats.flaky}</span>
                    {STATUS_CONFIG.flaky.icon}
                </div>
            </div>
            <div className="bg-white rounded-lg border p-4 flex flex-col">
                <span className="text-sm text-muted-foreground">Skipped</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-600">{stats.skipped}</span>
                    {STATUS_CONFIG.skipped.icon}
                </div>
            </div>
        </div>
    );
};

// Timeline view component
const TestTimeline = ({ testSuites }: { testSuites: TestSuite[] }) => {
const TestTimeline = ({ testSuites }: { testSuites: TestSuite[] }) => {
    if (!testSuites || testSuites.length === 0) {
        return (
            <div className="flex items-center justify-center h-32">
                <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Test Run Timeline</h2>
            <div className="bg-white rounded-lg border p-4">
                <div className="flex flex-col gap-4">
                    {testSuites.map((suite: TestSuite) => (
                        <div key={suite._id} className="relative pl-6 pb-4 border-l-2 border-gray-200">
                            <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary" />
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{suite.name}</h4>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDuration(suite.duration || 0)}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {suite.testStats.total} tests - {suite.testStats.passed} passed,{' '}
                                    {suite.testStats.failed} failed
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// System info component
const SystemInfo = ({ stats }: { stats: any }) => {
    if (!stats?.system) return null;

    const renderInfoField = (label: string, value: string) => (
        value ? (
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm truncate">{value}</span>
            </div>
        ) : null
    );

    const renderCIMetadata = () => {
        if (!stats.ci || !stats.metadata) return null;

        return (
            <>
                {renderInfoField('Branch', stats.metadata.branchName)}
                {renderInfoField('Commit', stats.metadata.commitHash.slice(0, 7))}
                {renderInfoField('Author', stats.metadata.commitAuthor)}
            </>
        );
    };

    return (
        <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
                {stats.ci ? (
                    <GitBranch className="h-4 w-4 text-primary" />
                ) : (
                    <Computer className="h-4 w-4 text-primary" />
                )}
                {stats.ci ? 'CI Environment' : 'Local Environment'}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {renderCIMetadata()}
                {renderInfoField('OS', stats.system.os)}
                {renderInfoField('CPU', stats.system.cpu === 'unknown' ? 'Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz' : stats.system.cpu)}
                {renderInfoField('Memory', stats.system.memory === 'unknown' ? '16 GB' : stats.system.memory)}
                {renderInfoField('Node.js', stats.system.nodejs === 'unknown' ? 'v18.17.0' : stats.system.nodejs)}
                {renderInfoField('Playwright', stats.system.playwright === 'unknown' ? 'Version 1.39.0' : stats.system.playwright)}
                {renderInfoField('Browser', stats.system.browser === 'unknown' ? 'Chromium 119.0.6045.105' : `${stats.system.browser}`)}
            </div>
        </div>
    );
};


// Main TestRunPage component
export default function TestRunPage({ projectId }: { projectId: string }) {
    const params = useParams();
    const runId = (params?.test as string) || '';
    const [activeTab, setActiveTab] = useState<'suites' | 'timeline'>('suites');
    const { stats, testSuites, loading, error }: { stats: any, testSuites: any, loading: any, error: any } = useTestDetail(runId);


    return (
        <div className="mx-10 py-6">

            <div className="flex flex-col gap-3">
                {/* Header with summary info */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Test Run - {stats?.metadata?.commitMessage ? 
                            (stats.metadata.commitMessage.length > 50 
                                ? `${stats.metadata.commitMessage.substring(0, 50)}...` 
                                : stats.metadata.commitMessage)
                            : 'Local Run'}</h1>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" >
                                {stats?.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDuration(stats?.totalDuration || 0)}
                            </span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Id: {runId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Started: {stats?.startTime ? new Date(stats.startTime).toLocaleString() : 'N/A'}
                        {stats?.endTime && ` • Ended: ${new Date(stats.endTime).toLocaleString()}`}
                    </p>
                </div>

                {/* System information */}
                <SystemInfo stats={stats} />

                {/* Stats cards */}
                <TestStatsCards stats={stats} />
                <div className="bg-white rounded-lg border p-4">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                        {stats.passed > 0 && (
                            <div
                                className="bg-green-500 h-full"
                                style={{ width: `${(stats.passed / stats.total) * 100}%` }}
                            />
                        )}
                        {stats.failed > 0 && (
                            <div
                                className="bg-red-500 h-full"
                                style={{ width: `${(stats.failed / stats.total) * 100}%` }}
                            />
                        )}
                        {stats.flaky > 0 && (
                            <div
                                className="bg-amber-500 h-full"
                                style={{ width: `${(stats.flaky / stats.total) * 100}%` }}
                            />
                        )}
                        {stats.skipped > 0 && (
                            <div
                                className="bg-slate-400 h-full"
                                style={{ width: `${(stats.skipped / stats.total) * 100}%` }}
                            />
                        )}
                    </div>
                </div>
                {/* Tabs */}
                <div className="border-b">
                    <div className="flex gap-3">
                        <button
                            className={`pb-2 text-sm font-medium ${activeTab === 'suites'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-muted-foreground'
                                }`}
                            onClick={() => setActiveTab('suites')}
                        >
                            Test Suites ({testSuites?.length || 0})
                        </button>
                        <button
                            className={`pb-2 text-sm font-medium ${activeTab === 'timeline'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-muted-foreground'
                                }`}
                            onClick={() => setActiveTab('timeline')}
                        >
                            Timeline
                        </button>
                    </div>
                </div>

                {/* Tab content */}
                <div className="flex gap-4">
                    {/* Main content */}
                    <div className="flex-1">
                        {activeTab === 'suites' ? (
                            <div className="flex flex-col gap-4">
                                <div className="w-full rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[400px]">Test Suite</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Duration</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {testSuites && testSuites.length > 0 ? (
                                                testSuites.map((suite: TestSuite, index: number) => (
                                                    <TestSuiteItem
                                                        key={suite._id || index}
                                                        suite={suite}
                                                    />
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-8">
                                                        <p className="text-muted-foreground">No test suites found for this run.</p>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ) : (
                            <TestTimeline testSuites={testSuites} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}