"use client";

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";
import { API_ENDPOINTS } from "@/lib/api";
import { apiRequest, STATUS } from "@/lib/api-client";

type ApiKeyPermissions = {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
};

type Project = {
    _id: string;
    name: string;
};

type ApiKey = {
    id: string;
    name: string;
    key: string;
    project: Project;
    permissions: ApiKeyPermissions;
    isActive: boolean;
    expiresAt: string;
    createdAt: string;
};

type ApiKeyResponse = {
    success: boolean;
    count: number;
    apiKeys: ApiKey[];
};

type ApiKeyStatus = {
    hasKeys: boolean;
    isVerified: boolean;
};

type ApiKeyContextType = {
    checkApiKeys: (projectId: string) => Promise<boolean>;
    apiKeyStatuses: Record<string, ApiKeyStatus>;
    isLoading: boolean;
    getProjectApiKeys: (projectId: string) => Promise<ApiKey[]>;
    refreshApiKeys: (projectId?: string) => Promise<void>;
    allApiKeys: ApiKey[];
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
    const [apiKeyStatuses, setApiKeyStatuses] = useState<Record<string, ApiKeyStatus>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [allApiKeys, setAllApiKeys] = useState<ApiKey[]>([]);
    const apiKeysDataRef = useRef<ApiKeyResponse | null>(null);
    const apiRequestPromiseRef = useRef<Promise<ApiKeyResponse | null> | null>(null);

    // Fetch API keys only once for the entire application
    const fetchApiKeys = useCallback(async (forceRefresh = false, projectId?: string) => {
        if (apiKeysDataRef.current && !forceRefresh) return apiKeysDataRef.current;

        // If there's already a request in progress, return its promise
        if (apiRequestPromiseRef.current && !forceRefresh) {
            return apiRequestPromiseRef.current;
        }

        setIsLoading(true);

        // Create new promise and store in ref
        const endpoint = projectId
            ? API_ENDPOINTS.apiKeys.getByProject(projectId)
            : API_ENDPOINTS.apiKeys.list;

        apiRequestPromiseRef.current = apiRequest<ApiKeyResponse>(endpoint, {
            method: "GET",
        }).then(response => {
            if (response.status === STATUS.SUCCESS) {
                apiKeysDataRef.current = response.data;
                setAllApiKeys(response.data.apiKeys);
                return response.data;
            }
            return null;
        }).catch(error => {
            console.error("Error fetching API keys:", error);
            return null;
        }).finally(() => {
            setIsLoading(false);
            apiRequestPromiseRef.current = null;
        });

        return apiRequestPromiseRef.current;
    }, []);

    // Force refresh all API keys
    const refreshApiKeys = useCallback(async (projectId?: string) => {
        await fetchApiKeys(true, projectId);
    }, [fetchApiKeys]);

    // Get API keys for a specific project
    const getProjectApiKeys = useCallback(async (projectId: string): Promise<ApiKey[]> => {
        const data = await fetchApiKeys(false, projectId);
        if (!data) return [];

        return data.apiKeys.filter(key => key.project._id === projectId);
    }, [fetchApiKeys]);

    // Check if a project has API keys
    const checkApiKeys = useCallback(async (projectId: string): Promise<boolean> => {
        // Return cached result if available
        if (apiKeyStatuses[projectId]?.isVerified) {
            return apiKeyStatuses[projectId].hasKeys;
        }

        // If we don't have the data yet, fetch it
        const data = await fetchApiKeys(false, projectId);
        if (!data) {
            setApiKeyStatuses(prev => ({
                ...prev,
                [projectId]: { hasKeys: false, isVerified: true }
            }));
            return false;
        }

        // Check if the project has any API keys
        let hasKeys = false;
        for (const key of data.apiKeys) {
            if (key.project._id === projectId) {
                hasKeys = true;
                break;
            }
        }

        // Cache the result
        setApiKeyStatuses(prev => ({
            ...prev,
            [projectId]: { hasKeys, isVerified: true }
        }));

        return hasKeys;
    }, [apiKeyStatuses, fetchApiKeys]);

    return (
        <ApiKeyContext.Provider value={{
            checkApiKeys,
            apiKeyStatuses,
            isLoading,
            getProjectApiKeys,
            refreshApiKeys,
            allApiKeys
        }}>
            {children}
        </ApiKeyContext.Provider>
    );
}

export function useApiKeys() {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error("useApiKeys must be used within an ApiKeyProvider");
    }
    return context;
}