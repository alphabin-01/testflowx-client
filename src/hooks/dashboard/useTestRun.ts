import { API_ENDPOINTS } from '@/lib/api';
import { apiRequest, STATUS } from '@/lib/api-client';
import { TestRun } from '@/lib/typers';
import { useParams } from 'next/navigation';
import { useCallback, useState, useRef } from 'react';

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

// Cache interface to store API responses
interface CacheEntry {
    testRuns: TestRun[];
    pagination: Pagination;
    timestamp: number;
}

// In-memory cache for API responses (shared across hook instances)
const responseCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 60000; // 1 minute cache TTL

export function useTestRun() {
    const projectId = useParams().id as string;

    // Track in-flight requests to prevent duplicates
    const requestInProgress = useRef<string | null>(null);

    const [testRuns, setTestRuns] = useState<TestRun[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        pages: 1
    });

    const fetchTestRuns = useCallback(async (
        page: number = 1,
        limit: number = 20,
        statusFilter: string = 'All',
        forceRefresh: boolean = false
    ) => {
        // Create a unique cache key
        const cacheKey = `${projectId}-${page}-${limit}-${statusFilter}`;

        // Check if we have a valid cached response and we're not forcing a refresh
        const cachedResponse = responseCache[cacheKey];
        const now = Date.now();

        if (!forceRefresh &&
            cachedResponse &&
            now - cachedResponse.timestamp < CACHE_TTL) {
            // Use cached data
            setTestRuns(cachedResponse.testRuns);
            setPagination(cachedResponse.pagination);
            return;
        }

        // Create a request key based on parameters to deduplicate requests
        const requestKey = cacheKey;

        // If this exact request is already in progress, skip it
        if (requestInProgress.current === requestKey && isLoading) {
            return;
        }

        // Set this request as in progress
        requestInProgress.current = requestKey;
        setIsLoading(true);
        setError(null);

        try {
            // Build query parameters
            const params: Record<string, string | number> = {
                page,
                limit
            };

            // Only add filters if they're not set to 'All'
            if (statusFilter !== 'All') {
                params.status = statusFilter;
            }

            const res = await apiRequest<TestRunResponse>(API_ENDPOINTS.testRuns.getByProjectId(projectId), {
                method: 'GET',
                params
            });

            if (res.status !== STATUS.SUCCESS) {
                throw new Error(res.error.message);
            }

            // Check if response is successful
            if (!res.data.success) {
                throw new Error(res.data.message || 'Failed to fetch test runs');
            }

            // Make sure the required data exists
            if (!res.data.testRuns || !res.data.pagination) {
                throw new Error('Invalid response data structure');
            }

            // Update state with new data
            setTestRuns(res.data.testRuns);
            setPagination(res.data.pagination);

            // Cache the response
            responseCache[cacheKey] = {
                testRuns: res.data.testRuns,
                pagination: res.data.pagination,
                timestamp: now
            };

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch test runs');
        } finally {
            setIsLoading(false);
            // Clear the in-progress request
            requestInProgress.current = null;
        }
    }, [projectId, isLoading]);

    const getTestRun = useCallback((runId: string) => {
        return testRuns.find(run => run._id === runId);
    }, [testRuns]);

    // This function is kept for backward compatibility
    // and for any additional client-side filtering if needed
    const getFilteredRuns = useCallback((
        statusFilter: string,
        searchTerm: string = '',
        tagFilters: string[] = [],
    ) => {
        // Apply server-side filters first (if any are active)
        let filtered = testRuns;

        // Apply client-side filtering for improved user experience
        if (searchTerm || tagFilters.length > 0 || statusFilter !== 'All') {
            filtered = testRuns.filter(run => {
                // Handle status filter - case insensitive comparison
                const matchesStatus = statusFilter === 'All' ||
                    (run.status && run.status.toLowerCase() === statusFilter.toLowerCase());

                // Handle search term - check if run ID or environment contains the search term
                const matchesSearch = !searchTerm ||
                    run._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (run.environment && run.environment.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (run.ci && run.metadata.branchName &&
                        run.metadata.branchName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (run.ci && run.metadata.commitHash &&
                        run.metadata.commitHash.toLowerCase().includes(searchTerm.toLowerCase()));

                // Handle tag filters - run must include ALL selected tags
                const matchesTags = tagFilters.length === 0 ||
                    tagFilters.every(tag => run.tags.includes(tag));

                return matchesStatus && matchesSearch && matchesTags;
            });
        }

        return filtered;
    }, [testRuns]);

    // Clear cache for this project
    const clearCache = useCallback(() => {
        Object.keys(responseCache).forEach(key => {
            if (key.startsWith(`${projectId}-`)) {
                delete responseCache[key];
            }
        });
    }, [projectId]);

    return {
        testRuns,
        isLoading,
        error,
        pagination,
        fetchTestRuns,
        getTestRun,
        getFilteredRuns,
        clearCache
    };
}
