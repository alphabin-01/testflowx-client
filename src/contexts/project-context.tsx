"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
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
}

// Create the context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
export function ProjectProvider({ children }: { children: ReactNode }) {
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProject = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiRequest<{ success: boolean; project: Project }>(
                API_ENDPOINTS.projects.get(id)
            );

            if (response.status === STATUS.SUCCESS && 'data' in response) {
                setCurrentProject(response.data.project);
            } else {
                setError("Failed to fetch project details");
            }
        } catch (error) {
            console.error("Error fetching project:", error);
            setError("An error occurred while fetching project data");
        } finally {
            setLoading(false);
        }
    };

    const clearProject = () => {
        setCurrentProject(null);
    };

    return (
        <ProjectContext.Provider
            value={{
                currentProject,
                loading,
                error,
                fetchProject,
                clearProject
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