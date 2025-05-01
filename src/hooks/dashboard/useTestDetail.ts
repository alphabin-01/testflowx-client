'use client';

import { API_ENDPOINTS } from '@/lib/api';
import { apiRequest, STATUS } from '@/lib/api-client';
import { TestRun, TestSuite, TestCase } from '@/lib/typers';
import { useCallback, useMemo, useState, useEffect } from 'react';

/**
 * Type for test statistics
 */
export type TestStats = {
    total: number;
    passed: number;
    failed: number;
    flaky: number;
    skipped: number;
}


/**
 * Custom hook to manage test run details, including test suites and test cases.
 * Handles data fetching, caching, and UI state.
 */
export function useTestDetail(runId: string) {
    const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
    const [runStats, setRunStats] = useState<TestRun | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [loadedSuiteIds, setLoadedSuiteIds] = useState<Set<string>>(new Set());


    const fetchTestRunStats = useCallback(async () => {
        setLoading(true);

        try {
            const response = await apiRequest(API_ENDPOINTS.testRuns.getTestRunById(runId));
            setRunStats(response.data.testRun as TestRun);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch test run stats');
        } finally {
            setLoading(false);
        }
    }, [runId]);

    const fetchTestSuites = useCallback(async () => {
        setLoading(true);

        try {
            const response = await apiRequest(API_ENDPOINTS.testSuites.getTestRunById(runId));
            setTestSuites(response.data.testSuites as TestSuite[]);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch test run suites');
        } finally {
            setLoading(false);
        }
    }, [runId]);

    useEffect(() => {
        fetchTestSuites();
        fetchTestRunStats();
    }, []);

    /**
     * Fetch test cases for a specific test suite
     */
    const fetchTestCases = useCallback(async (suiteId: string) => {
        if (loadedSuiteIds.has(suiteId)) {
            return;
        }

        setLoading(true);
        try {
            const response = await apiRequest(API_ENDPOINTS.testCases.getTestCasesBySuiteId(suiteId));

            if (response.status !== STATUS.SUCCESS) {
                setError(response.error.message);
                return;
            }

            // Update the test suites array with the fetched test cases
            setTestSuites(prevSuites =>
                prevSuites.map(suite =>
                    suite._id === suiteId
                        ? { ...suite, testCases: response.data.testCases as TestCase[] }
                        : suite
                )
            );

            // Mark this suite ID as loaded
            setLoadedSuiteIds(prev => new Set(prev).add(suiteId));
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch test cases');
        } finally {
            setLoading(false);
        }
    }, [loadedSuiteIds]);

    /**
     * Calculate and memoize test statistics
     */
    const stats: TestStats = useMemo(() => ({
        total: runStats?.testStats?.total || 0,
        passed: runStats?.testStats?.passed || 0,
        failed: runStats?.testStats?.failed || 0,
        flaky: runStats?.testStats?.flaky || 0,
        skipped: runStats?.testStats?.skipped || 0,
        totalDuration: runStats?.duration || 0,
        status: runStats?.status || 'unknown',
        startTime: runStats?.startTime,
        endTime: runStats?.endTime,
        metadata: runStats?.metadata,
        system: runStats?.system,
        // ci: runStats?.ci
        ci: true
    }), [runStats]);

    return {
        testSuites,
        runStats,
        loading,
        error,
        stats,
        fetchTestCases,
    };
}