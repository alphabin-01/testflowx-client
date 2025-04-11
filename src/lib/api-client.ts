// src/lib/api-client.ts
import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';
import { getApiUrl, DEFAULT_TIMEOUT } from './api-config';




/**
 * API response status codes
 */
export const STATUS = {
    SUCCESS: 'success',
    ERROR: 'error'
} as const;

export type StatusType = typeof STATUS[keyof typeof STATUS];

/**
 * Error types for better error handling
 */
export const ERROR_TYPES = {
    NETWORK: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT_ERROR',
    AUTH: 'AUTHENTICATION_ERROR',
    PERMISSION: 'PERMISSION_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    SERVER: 'SERVER_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR'
} as const;

export type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];

interface ErrorDetails {
    [key: string]: unknown;
}

interface ErrorResponse {
    status: typeof STATUS.ERROR;
    error: {
        type: ErrorType;
        message: string;
        details: ErrorDetails;
    };
}

interface SuccessResponse<T> {
    status: typeof STATUS.SUCCESS;
    data: T;
    message: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

interface ApiRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: object | null;
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    timeout?: number;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
    errorMessage?: string | null;
    skipAuth?: boolean;
}

interface ErrorHandlingOptions {
    showToast?: boolean;
    customMessage?: string | null;
}

const mapStatusToErrorType = (statusCode: number): ErrorType => {
    switch (true) {
        case statusCode === 401:
            return ERROR_TYPES.AUTH;
        case statusCode === 403:
            return ERROR_TYPES.PERMISSION;
        case statusCode === 404:
            return ERROR_TYPES.NOT_FOUND;
        case statusCode >= 400 && statusCode < 500:
            return ERROR_TYPES.VALIDATION;
        case statusCode >= 500:
            return ERROR_TYPES.SERVER;
        default:
            return ERROR_TYPES.UNKNOWN;
    }
};

const createErrorResponse = (type: ErrorType, message: string, details: ErrorDetails = {}): ErrorResponse => ({
    status: STATUS.ERROR,
    error: {
        type,
        message,
        details
    }
});

/**
 * Create a standardized success response
 * @param {T} data - Response data
 * @param {string} message - Success message
 * @returns {SuccessResponse<T>} Standardized success response
 */
const createSuccessResponse = <T>(data: T, message = 'Operation successful'): SuccessResponse<T> => ({
    status: STATUS.SUCCESS,
    data,
    message
});

const handleApiError = (error: unknown, options: ErrorHandlingOptions = {}): ErrorResponse => {
    const { showToast = true, customMessage = null } = options;

    if (axios.isCancel(error)) {
        const message = customMessage || 'Request timed out. Please try again.';
        if (showToast) {
            toast.error(message);
        }
        return createErrorResponse(ERROR_TYPES.TIMEOUT, message);
    }

    if (!navigator.onLine) {
        const message = customMessage || 'Network connection issue. Please check your internet connection.';
        if (showToast) {
            toast.error(message);
        }
        return createErrorResponse(ERROR_TYPES.NETWORK, message);
    }

    const axiosError = error as AxiosError<unknown>;

    // Handle network errors including CORS
    if (axiosError.message?.includes('Network Error') || axiosError.code === 'ERR_NETWORK') {
        const message = customMessage || 'Network connection issue. This could be due to CORS policy restrictions or server unavailability.';
        if (showToast) {
            toast.error(message);
        }
        return createErrorResponse(ERROR_TYPES.NETWORK, message);
    }

    if (axiosError.response) {
        const statusCode = axiosError.response.status;
        const errorType = mapStatusToErrorType(statusCode);
        let message = customMessage;

        if (!message) {
            switch (errorType) {
                case ERROR_TYPES.AUTH:
                    message = 'Authentication failed. Please log in again.';
                    break;
                case ERROR_TYPES.PERMISSION:
                    message = 'You do not have permission to perform this action.';
                    break;
                case ERROR_TYPES.NOT_FOUND:
                    message = 'The requested resource was not found.';
                    break;
                case ERROR_TYPES.VALIDATION:
                    message = axiosError.response.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
                        ? String(axiosError.response.data.message)
                        : 'Please check your input and try again.';
                    break;
                case ERROR_TYPES.SERVER:
                    message = 'Server error occurred. Please try again later.';
                    break;
                default:
                    message = 'An unexpected error occurred. Please try again.';
            }
        }

        if (showToast) {
            toast.error(message);
        }

        return createErrorResponse(errorType, message as string, axiosError.response.data as ErrorDetails);
    }

    const message = customMessage || 'An unexpected error occurred. Please try again.';
    if (showToast) {
        toast.error(message);
    }

    return createErrorResponse(ERROR_TYPES.UNKNOWN, message, {
        originalError: axiosError.message || 'Unknown error'
    });
};

export async function apiRequest<T = unknown>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const {
        method = 'GET',
        body = null,
        headers = {},
        params = {},
        timeout = DEFAULT_TIMEOUT,
        showSuccessToast = false,
        showErrorToast = true,
        successMessage = 'Operation successful',
        errorMessage = null,
        skipAuth = false
    } = options;

    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
    };

    if (!skipAuth) {
        const token = localStorage.getItem('auth_token');
        if (token) {
            requestHeaders.Authorization = `Bearer ${token}`;
        }
    }

    const axiosConfig: AxiosRequestConfig = {
        method,
        url: getApiUrl(endpoint),
        headers: requestHeaders,
        params,
        timeout,
        withCredentials: true
    };

    if (method !== 'GET' && body) {
        axiosConfig.data = body;
    }

    const source = axios.CancelToken.source();
    axiosConfig.cancelToken = source.token;

    try {
        const response: AxiosResponse = await axios(axiosConfig);
        const result = createSuccessResponse<T>(response.data, successMessage);

        if (showSuccessToast) {
            toast.success(successMessage);
        }

        return result;
    } catch (error) {
        // Check for specific CORS errors
        const axiosError = error as AxiosError;
        if (axiosError.message?.includes('from origin') && axiosError.message?.includes('has been blocked by CORS policy')) {
            const corsMessage = errorMessage || 'Cross-Origin Request Blocked: The server does not allow requests from this origin.';
            if (showErrorToast) {
                toast.error(corsMessage);
            }
            return createErrorResponse(ERROR_TYPES.PERMISSION, corsMessage, { originalError: axiosError.message });
        }

        return handleApiError(error, {
            showToast: showErrorToast,
            customMessage: errorMessage
        });
    }
}