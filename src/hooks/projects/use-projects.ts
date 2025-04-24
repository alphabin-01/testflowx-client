import { API_ENDPOINTS } from "@/lib/api";
import { apiRequest, STATUS } from "@/lib/api-client";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ProjectSettings {
    retentionPeriod: number;
    notificationsEnabled: boolean;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    settings: ProjectSettings;
    createdAt?: string;
}

interface ProjectFormData {
    name: string;
    description: string;
    settings: {
        retentionPeriod: number;
        notificationsEnabled: boolean;
    };
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiRequest(API_ENDPOINTS.projects.list, {
                method: "GET",
            });

            if (response.status !== STATUS.SUCCESS) {
                toast.error(response.error.message);
                return;
            }

            const data = response.data as { projects: Project[] };
            setProjects(data.projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = useCallback(async (formData: ProjectFormData) => {
        try {

            const response = await apiRequest(API_ENDPOINTS.projects.create, {
                method: "POST",
                body: formData,
            });

            if (response.status !== STATUS.SUCCESS) {
                throw new Error(response.error.message);
            }

            toast("Project has been created.");
            await fetchProjects();
            return true;
        } catch (error) {
            return false;
        }
    }, [fetchProjects]);


    const updateProject = useCallback(async (projectId: string, formData: ProjectFormData) => {
        try {
            const response = await apiRequest(API_ENDPOINTS.projects.update(projectId), {
                method: "PUT",
                body: formData,
            });

            if (response.status !== STATUS.SUCCESS) {
                toast.error(response.error.message || "Failed to update project");
                return false;
            }

            toast.success("Project has been updated.");
            await fetchProjects();
            return true;
        } catch (error) {
            console.error("Error updating project:", error);
            toast("Failed to update project. Please try again.");
            return false;
        }
    }, [fetchProjects]);

    const deleteProject = useCallback(async (projectId: string) => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            return false;
        }

        try {
            const response = await apiRequest(API_ENDPOINTS.projects.delete(projectId), {
                method: "DELETE",
            });

            if (response.status !== STATUS.SUCCESS) {
                toast.error(response.error.message || "Failed to delete project");
                return false;
            }

            toast.success("Project deleted successfully");
            await fetchProjects();
            return true;
        } catch (error) {
            console.error("Error deleting project:", error);
            toast("Failed to delete project. Please try again.");
            return false;
        }
    }, [fetchProjects]);

    return {
        projects,
        loading,
        currentProject,
        setCurrentProject,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
    };
}

export type { ProjectFormData };
