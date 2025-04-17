import { API_ENDPOINTS } from '@/lib/api';
import { apiRequest, STATUS } from '@/lib/api-client';
import { useCallback, useState } from 'react';
import { useApiCache } from './useApiCache';

// Define ApiResponse types for reuse
interface SuccessResponse<T> {
    status: typeof STATUS.SUCCESS;
    data: T;
}

interface ErrorResponse {
    status: typeof STATUS.ERROR;
    error: {
        message: string;
        [key: string]: unknown;
    };
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

interface UseCachedApiOptions {
    ttl?: number;
    enabled?: boolean;
}

interface RequestOptions<T> {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    params?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
    forceRefresh?: boolean;
}

/**
 * A hook that provides a simple way to make cached API requests
 * 
 * @param options Cache configuration options
 * @returns Functions to make cached API requests and manage the cache
 */
export function useCachedApi(options: UseCachedApiOptions = {}) {
    const { cachedRequest, invalidateCache, clearCache } = useApiCache(options);
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    // Function to make a cached API request
    const request = useCallback(async <T>(
        endpoint: string,
        options: RequestOptions<T> = {}
    ): Promise<T | null> => {
        const {
            method = 'GET',
            body,
            params,
            headers,
            forceRefresh = false
        } = options;

        // Set loading state for this endpoint
        setIsLoading(prev => ({ ...prev, [endpoint]: true }));
        // Clear any existing errors
        setErrors(prev => ({ ...prev, [endpoint]: null }));

        try {
            // Use the cachedRequest wrapper
            const response = await cachedRequest<ApiResponse<T>>(
                endpoint,
                // This function will only be called if the request isn't cached
                async () => {
                    return apiRequest<T>(endpoint, {
                        method,
                        body,
                        params,
                        headers
                    });
                },
                // Options for the cache
                {
                    params: {
                        ...(params || {}),
                        method
                    } as Record<string, unknown>,
                    forceRefresh
                }
            );

            // Handle API response
            if (response.status === STATUS.ERROR) {
                throw new Error(response.error.message);
            }

            return response.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setErrors(prev => ({ ...prev, [endpoint]: errorMessage }));
            return null;
        } finally {
            setIsLoading(prev => ({ ...prev, [endpoint]: false }));
        }
    }, [cachedRequest]);

    // Check if a specific request is loading
    const isLoadingRequest = useCallback((endpoint: string) => {
        return !!isLoading[endpoint];
    }, [isLoading]);

    // Get error for a specific endpoint
    const getError = useCallback((endpoint: string) => {
        return errors[endpoint] || null;
    }, [errors]);

    return {
        request,
        invalidateCache,
        clearCache,
        isLoadingRequest,
        getError
    };
}

// Example usage:
// 
// function MyComponent() {
//   const { request, isLoadingRequest } = useCachedApi();
//   const [data, setData] = useState(null);
//
//   const fetchData = async () => {
//     const endpoint = API_ENDPOINTS.testRuns.getByProjectId(projectId);
//     const result = await request(endpoint, { 
//       params: { page: 1, limit: 10 }
//     });
//     if (result) {
//       setData(result);
//     }
//   };
//
//   return (
//     <div>
//       <button onClick={fetchData} disabled={isLoadingRequest(endpoint)}>
//         {isLoadingRequest(endpoint) ? 'Loading...' : 'Fetch Data'}
//       </button>
//     </div>
//   );
// } 