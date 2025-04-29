import { API_ENDPOINTS } from '@/lib/api';
import { apiRequest, STATUS } from '@/lib/api-client';
import { TestRun } from '@/lib/typers';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useRef, useEffect } from 'react';

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

// Filter state interface
export interface TestRunFilters {
    status?: string;
    branch?: string;
    tags?: string[];
    searchTerm?: string;
}

// In-memory cache for API responses (shared across hook instances)
const responseCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 60000; // 1 minute cache TTL

export function useTestRun() {
    const router = useRouter();
    const projectId = useParams().id as string;
    const searchParams = useSearchParams();

    // Track in-flight requests to prevent duplicates
    const requestInProgress = useRef<string | null>(null);

    // Track if we've initialized from URL params yet
    const initializedFromUrl = useRef(false);

    const [testRuns, setTestRuns] = useState<TestRun[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        pages: 1
    });

    // Initialize filters state but don't derive from URL yet
    const [filters, setFilters] = useState<TestRunFilters>({
        status: 'All',
        branch: '',
        tags: [],
        searchTerm: ''
    });

    // This function updates the URL without triggering a re-render
    const updateUrlWithFilters = useCallback((newFilters: TestRunFilters, page: number) => {
        const params = new URLSearchParams();

        if (newFilters.status && newFilters.status !== 'All') {
            params.set('status', newFilters.status);
        }

        if (newFilters.branch) {
            params.set('branch', newFilters.branch);
        }

        if (newFilters.tags && newFilters.tags.length > 0) {
            params.set('tags', newFilters.tags.join(','));
        }

        if (newFilters.searchTerm) {
            params.set('search', newFilters.searchTerm);
        }

        if (page > 1) {
            params.set('page', page.toString());
        }

        // Replace the URL with the new params - using replace to avoid adding to history
        const newUrl = `/projects/${projectId}/tests${params.toString() ? `?${params.toString()}` : ''}`;
        router.replace(newUrl, { scroll: false });
    }, [projectId, router]);

    // Update filters and trigger a fetch
    const applyFilters = useCallback((newFilters: Partial<TestRunFilters>) => {
        setFilters(prev => {
            // Create a new object to avoid mutation
            return { ...prev, ...newFilters };
        });
    }, []);

    // Main fetch function - enhanced to handle API filtering
    const fetchTestRuns = useCallback(async (
        page: number = 1,
        limit: number = 20,
        currentFilters: TestRunFilters = filters,
        forceRefresh: boolean = false
    ) => {
        // Only update URL if we've already initialized (to avoid loop)
        if (initializedFromUrl.current) {
            updateUrlWithFilters(currentFilters, page);
        }

        // Create a unique cache key based on all parameters
        const filterString = JSON.stringify(currentFilters);
        const cacheKey = `${projectId}-${page}-${limit}-${filterString}`;

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

        // If this exact request is already in progress, skip it
        if (requestInProgress.current === cacheKey && isLoading) {
            return;
        }

        // Set this request as in progress
        requestInProgress.current = cacheKey;
        setIsLoading(true);
        setError(null);

        try {
            // Build query parameters
            const params: Record<string, string | number> = {
                page,
                limit
            };

            // Apply all filters to API request
            if (currentFilters.status && currentFilters.status !== 'All') {
                params.status = currentFilters.status;
            }

            if (currentFilters.branch) {
                params.branch = currentFilters.branch;
            }

            if (currentFilters.tags && currentFilters.tags.length > 0) {
                params.tags = currentFilters.tags.join(',');
            }


            if (currentFilters.searchTerm) {
                params.search = currentFilters.searchTerm;
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
    }, [projectId, isLoading, filters, updateUrlWithFilters]);

    // Effect to fetch data when filters change
    useEffect(() => {
        // Only trigger fetch if we've initialized from URL
        if (initializedFromUrl.current) {
            // Debounce to avoid multiple rapid fetches when filters change
            const timer = setTimeout(() => {
                fetchTestRuns(1, pagination.limit, filters);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [filters, fetchTestRuns, pagination.limit]);

    // Read initial filters from URL on component mount - runs only once
    useEffect(() => {
        // Skip if we've already initialized
        if (initializedFromUrl.current) {
            return;
        }

        const page = parseInt(searchParams.get('page') || '1', 10);
        const initialFilters: TestRunFilters = {
            status: searchParams.get('status') || 'All',
            branch: searchParams.get('branch') || '',
            tags: searchParams.get('tags') ? searchParams.get('tags')!.split(',') : [],
            searchTerm: searchParams.get('search') || ''
        };

        // Update state without triggering useEffect
        setFilters(initialFilters);

        // Set initialization flag to true
        initializedFromUrl.current = true;

        // Initial data fetch
        fetchTestRuns(page, pagination.limit, initialFilters);
    }, [searchParams, fetchTestRuns, pagination.limit]);

    const getTestRun = useCallback((runId: string) => {
        return testRuns.find(run => run._id === runId);
    }, [testRuns]);

    // This function is now primarily for instant client-side filtering
    // while waiting for the API response
    const getFilteredRuns = useCallback((
        statusFilter: string,
        searchTerm: string = '',
        tagFilters: string[] = [],
    ) => {
        // Apply client-side filtering for improved user experience
        let filtered = testRuns;

        if (searchTerm || tagFilters.length > 0 || statusFilter !== 'All') {
            filtered = testRuns.filter(run => {
                // Handle status filter - case insensitive comparison
                const matchesStatus = statusFilter === 'All' ||
                    (run.status && run.status.toLowerCase() === statusFilter.toLowerCase());

                // Handle search term - check if run ID or environment contains the search term
                const matchesSearch = !searchTerm ||
                    run._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (run.environment && run.environment.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (run.ci && run.metadata?.branchName &&
                        run.metadata.branchName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (run.ci && run.metadata?.commitHash &&
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

    // Navigate to a specific page
    const goToPage = useCallback((page: number) => {
        fetchTestRuns(page, pagination.limit, filters);
    }, [fetchTestRuns, pagination.limit, filters]);

    return {
        testRuns,
        isLoading,
        error,
        pagination,
        filters,
        fetchTestRuns,
        getTestRun,
        getFilteredRuns,
        clearCache,
        applyFilters,
        goToPage,
        setTestRuns
    };
}

// Add delete function
export const deleteTestRun = async (runId: string) => {
    try {
        const res = await apiRequest(API_ENDPOINTS.testRuns.deleteTestRun(runId), {
            method: 'DELETE',
        });
        if (res.status === STATUS.SUCCESS) {
            return res.data;
        }
        throw new Error(res.error.message);
    } catch (error) {
        throw error;
    }
};