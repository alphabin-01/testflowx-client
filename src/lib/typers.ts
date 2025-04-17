import { ReactNode } from "react";

type TestStatus = 'completed' | 'failed' | 'flaky' | 'skipped';
type Environment = 'ci' | 'local';

export interface TestCase {
    _id: string;
    title: string;
    fullTitle: string;
    status: TestStatus;
    startTime: string;
    endTime: string;
    duration: number;
    retries: number;
    attempts: unknown[];
    console: unknown[];
    parameters: unknown[];
    metadata?: {
        annotations: unknown[];
        categories: unknown[];
        dependencies: unknown[];
    };
    error?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TestSuite {
    _id: string;
    name: string;
    fileName: string;
    filePath: string;
    startTime: string;
    duration: number;
    status: TestStatus;
    testCases: TestCase[];
    testStats: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        flaky: number;
        timedOut: number;
    };
    tags: string[];
    parallelMode: boolean;
    createdAt: string;
    updatedAt: string;
}

export  interface TestRun {
    _id: string;
    runId: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: TestStatus;
    tags: string[];
    environment: Environment;
    testSuites: TestSuite[];
    metadata: {
        branchName: string;
        commitHash: string;
        commitMessage: string;
        commitAuthor: string;
        buildNumber: string;
        ciProvider: string;
    };
    testStats: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        flaky: number;
        timedOut: number;
    };
    system: {
        os: string;
        cpu: string;
        memory: string;
        nodejs: string;
        playwright: string;
        browser: string;
        browserVersion: string;
    };
    ci: boolean;
    submittedBy: string;
    createdAt: string;
    updatedAt: string;
}

export const statusConfig: Record<TestStatus, { color: string; bgColor: string; icon: ReactNode }> = {
    completed: {
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        icon: null // This will be set in the components that use it
    },
    failed: {
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        icon: null
    },
    flaky: {
        color: 'text-amber-500',
        bgColor: 'bg-amber-100 dark:bg-amber-900/20',
        icon: null
    },
    skipped: {
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        icon: null
    }
}; 