"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { apiRequest, STATUS } from '@/lib/api-client';

// Define Project Type
export interface ProjectMember {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface ProjectOwner {
    id: string;
    email: string;
    name: string;
}

export interface ProjectSettings {
    retentionPeriod: number;
    notificationsEnabled: boolean;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    owner: ProjectOwner;
    members: ProjectMember[];
    userRole: string;
    apiKeyCount: number;
    settings: ProjectSettings;
    createdAt: string;
    updatedAt: string;
}

interface ProjectContextType {
    currentProject: Project | null;
    loading: boolean;
    error: string | null;
    fetchProject: (id: string) => Promise<void>;
    clearProject: () => void;
    projectId: string | null;
}

// Create the context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
export function ProjectProvider({ children }: { children: ReactNode }) {
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [projectId, setProjectId] = useState<string | null>(null);
    const apiRequestPromiseRef = useRef<Promise<any> | null>(null);

    const fetchProject = useCallback(async (id: string) => {
        // If we're already showing this project, don't refetch
        if (currentProject && currentProject.id === id) {
            return;
        }

        // If there's already a request in progress for this ID, return its promise
        if (apiRequestPromiseRef.current && projectId === id) {
            return apiRequestPromiseRef.current;
        }

        setLoading(true);
        setError(null);
        setProjectId(id);

        // Create new promise and store in ref
        apiRequestPromiseRef.current = apiRequest<{ success: boolean; project: Project }>(
            API_ENDPOINTS.projects.get(id)
        ).then(response => {
            if (response.status === STATUS.SUCCESS && 'data' in response) {
                setCurrentProject(response.data.project);
            } else {
                setError("Failed to fetch project details");
            }
            return response;
        }).catch(error => {
            console.error("Error fetching project:", error);
            setError("An error occurred while fetching project data");
            throw error;
        }).finally(() => {
            setLoading(false);
            apiRequestPromiseRef.current = null;
        });

        return apiRequestPromiseRef.current;
    }, [currentProject, projectId]);

    // Clear project data
    const clearProject = useCallback(() => {
        setCurrentProject(null);
        setProjectId(null);
    }, []);

    return (
        <ProjectContext.Provider
            value={{
                currentProject,
                loading,
                error,
                fetchProject,
                clearProject,
                projectId
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}

// Hook for using the context
export function useProject() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
} 