import { useApiKeys } from '@/contexts/api-key-context';
import { API_ENDPOINTS } from '@/lib/api';
import { apiRequest, STATUS } from '@/lib/api-client';
import { TestRun } from '@/lib/typers';
import { xApiKeyHeader } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useState, useCallback } from 'react';

interface Pagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

// Define response interface to handle API response structure
interface TestRunResponse {
    success: boolean;
    message?: string;
    testRuns?: TestRun[];
    pagination?: Pagination;
}

export function useTestRun() {
    const projectId = useParams().id as string;
    const { getFirstApiKey } = useApiKeys();
    
    const [testRuns, setTestRuns] = useState<TestRun[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        pages: 1
    });

    const fetchTestRuns = useCallback(async (page: number = 1, limit: number = 20) => {
        setIsLoading(true);
        setError(null);

        try {
            // const res = await apiRequest<TestRunResponse>(API_ENDPOINTS.testRuns.getByProjectId(projectId), {
            //     method: 'GET',
            //     headers: xApiKeyHeader(getFirstApiKey(projectId) as string),
            //     params: {
            //         page,
            //         limit
            //     }
            // });

            // if (res.status !== STATUS.SUCCESS) {
            //     throw new Error(res.error.message);
            // }

            // // Check if response is successful
            // if (!res.data.success) {
            //     throw new Error(res.data.message || 'Failed to fetch test runs');
            // }

            // // Make sure the required data exists
            // if (!res.data.testRuns || !res.data.pagination) {
            //     throw new Error('Invalid response data structure');
            // }

            // setTestRuns(res.data.testRuns);
            // setPagination(res.data.pagination);

            // Mock data for development
            const mockResponse = {
                success: true,
                testRuns: [
                    {
                        metadata: {
                            branchName: "pratik/stu-4625",
                            commitHash: "cd7ec1aef2793edf9a52930b4219ae8b81719b2a",
                            commitMessage: "Implement mp4 support for tts-v2 (#2727)",
                            commitAuthor: "Steve Higgs",
                            buildNumber: "unknown",
                            ciProvider: "unknown"
                        },
                        testStats: {
                            total: 1,
                            passed: 0,
                            failed: 1,
                            skipped: 0,
                            flaky: 0,
                            timedOut: 0
                        },
                        system: {
                            os: "darwin 23.6.0",
                            cpu: "unknown",
                            memory: "unknown",
                            nodejs: "v20.17.0",
                            playwright: "unknown",
                            browser: "unknown",
                            browserVersion: "unknown"
                        },
                        id: "67fcd157c6a84d87aed3b8d3",
                        project: "67fcae02b01a9f651f39129c",
                        runId: "run_1744621911247_85uq3aq",
                        startTime: "2025-04-14T09:11:51.146Z",
                        duration: 34242,
                        status: "failed",
                        environment: "local",
                        ci: true,
                        tags: ["Smoke", "Regression"],
                        submittedBy: "67fcadc8b01a9f651f391295",
                        createdAt: "2025-04-14T09:11:51.249Z",
                        updatedAt: "2025-04-14T09:12:25.388Z",
                        endTime: "2025-04-14T09:12:25.388Z"
                    },
                    {
                        metadata: {
                            branchName: "pratik/stu-4625",
                            commitHash: "cd7ec1aef2793edf9a52930b4219ae8b81719b2a",
                            commitMessage: "Implement mp4 support for tts-v2 (#2727)",
                            commitAuthor: "Steve Higgs",
                            buildNumber: "unknown",
                            ciProvider: "unknown"
                        },
                        testStats: {
                            total: 4,
                            passed: 0,
                            failed: 4,
                            skipped: 0,
                            flaky: 0,
                            timedOut: 0
                        },
                        system: {
                            os: "darwin 23.6.0",
                            cpu: "unknown",
                            memory: "unknown",
                            nodejs: "v20.17.0",
                            playwright: "unknown",
                            browser: "unknown",
                            browserVersion: "unknown"
                        },
                        id: "67fccfc9c6a84d87aed3b7e8",
                        project: "67fcae02b01a9f651f39129c",
                        runId: "run_1744621513194_ng87et7",
                        startTime: "2025-04-14T09:05:13.032Z",
                        duration: 40288,
                        status: "failed",
                        environment: "local",
                        ci: false,
                        tags: [],
                        submittedBy: "67fcadc8b01a9f651f391295",
                        createdAt: "2025-04-14T09:05:13.195Z",
                        updatedAt: "2025-04-14T09:05:53.321Z",
                        endTime: "2025-04-14T09:05:53.320Z"
                    },
                    {
                        metadata: {
                            branchName: "pratik/stu-4625",
                            commitHash: "cd7ec1aef2793edf9a52930b4219ae8b81719b2a",
                            commitMessage: "Implement mp4 support for tts-v2 (#2727)",
                            commitAuthor: "Steve Higgs",
                            buildNumber: "unknown",
                            ciProvider: "unknown"
                        },
                        testStats: {
                            total: 4,
                            passed: 0,
                            failed: 0,
                            skipped: 0,
                            flaky: 0,
                            timedOut: 0
                        },
                        system: {
                            os: "darwin 23.6.0",
                            cpu: "unknown",
                            memory: "unknown",
                            nodejs: "v20.17.0",
                            playwright: "unknown",
                            browser: "unknown",
                            browserVersion: "unknown"
                        },
                        id: "67fccfb7c6a84d87aed3b7a2",
                        project: "67fcae02b01a9f651f39129c",
                        runId: "run_1744621495499_byt3fr9",
                        startTime: "2025-04-14T09:04:55.347Z",
                        duration: 14605,
                        status: "completed",
                        environment: "local",
                        ci: false,
                        tags: [],
                        submittedBy: "67fcadc8b01a9f651f391295",
                        createdAt: "2025-04-14T09:04:55.501Z",
                        updatedAt: "2025-04-14T09:05:09.955Z",
                        endTime: "2025-04-14T09:05:09.952Z"
                    }
                ],
                pagination: {
                    total: 3,
                    page: 1,
                    limit: 20,
                    pages: 1
                }
            };

            setTestRuns(mockResponse.testRuns);
            setPagination(mockResponse.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch test runs');
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    const getTestRun = useCallback((runId: string) => {
        return testRuns.find(run => run.id === runId);
    }, [testRuns]);

    const getFilteredRuns = useCallback((
        statusFilter: string,
        envFilter: string,
        searchTerm: string,
        selectedTags: string[]
    ) => {
        return testRuns.filter(run => {
            const matchesStatus = statusFilter === 'All' || run.status === statusFilter.toLowerCase();
            const matchesEnv = envFilter === 'All' || run.environment === envFilter;
            const matchesSearch = run.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTags = selectedTags.length === 0 ||
                selectedTags.every(tag => run.tags.includes(tag));

            return matchesStatus && matchesEnv && matchesSearch && matchesTags;
        });
    }, [testRuns]);

    return {
        testRuns,
        isLoading,
        error,
        pagination,
        fetchTestRuns,
        getTestRun,
        getFilteredRuns
    };
}
