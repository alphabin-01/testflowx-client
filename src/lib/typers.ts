type TestStatus = 'completed' | 'failed' | 'flaky' | 'skipped';
type Environment = 'ci' | 'local';

export interface TestCase {
    id: string;
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
    id: string;
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
    id: string;
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


