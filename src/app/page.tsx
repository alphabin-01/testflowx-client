"use client";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects, type Project, type ProjectFormData } from "@/hooks/projects/use-projects";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProjectsPage() {
  const router = useRouter();
  const {
    projects,
    loading,
    currentProject,
    setCurrentProject,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchProjects();
      fetchedRef.current = true;
    }
  }, [fetchProjects]);

  const handleOpenCreateDialog = () => {
    setIsEditMode(false);
    setCurrentProject(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (project: Project) => {
    setIsEditMode(true);
    setCurrentProject(project);
    setIsDialogOpen(true);
  };

  const handleSubmitProject = async (formData: ProjectFormData) => {
    if (isEditMode && currentProject) {
      const success = await updateProject(currentProject.id, formData);
      if (success) setIsDialogOpen(false);
    } else {
      const success = await createProject(formData);
      if (success) setIsDialogOpen(false);
    }
  };

  const navigateToProjectDetails = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="grid mx-auto py-8 px-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm">Manage your test projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchProjects} size="sm" className="h-9">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleOpenCreateDialog} size="sm" className="h-9 bg-black text-white hover:bg-gray-800">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 shadow-sm">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-16 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-9 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : !projects || projects.length === 0 ? (
        <Card className="border-dashed border-2 p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <h3 className="text-xl font-semibold">No projects found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You haven&apos;t created any projects yet. Create your first project to get started.
            </p>
            <Button onClick={handleOpenCreateDialog} className="mt-4 bg-black text-white hover:bg-gray-800">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        </Card>
      ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={navigateToProjectDetails}
              onEdit={handleOpenEditDialog}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitProject}
        project={currentProject}
        isEditMode={isEditMode}
      />
    </div>
  );
}