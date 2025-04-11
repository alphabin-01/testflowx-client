"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, RefreshCw } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { useProjects, type Project, type ProjectFormData } from "@/hooks/use-projects";

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
      console.log("fetching projects");
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

  const handleSubmitProject = async (formData: any) => {
    const data = {
      name: formData.name,
      description: formData.description,
      settings: {
        retentionPeriod: formData.retentionPeriod,
        notificationsEnabled: formData.notificationsEnabled,
      },
    };
    console.log(`data: ${JSON.stringify(formData)}`);
    if (isEditMode && currentProject) {
      const success = await updateProject(currentProject.id, data);
      if (success) setIsDialogOpen(false);
    } else {
      const success = await createProject(data);
      if (success) setIsDialogOpen(false);
    }
  };

  const navigateToProjectDetails = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your test projects</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchProjects} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleOpenCreateDialog} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden h-[220px]">
              <div className="p-4 pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </div>
              <div className="p-4">
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="p-4 pt-2">
                <Skeleton className="h-9 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-dashed border-2 p-6 md:p-10">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <h3 className="text-xl font-semibold">No projects found</h3>
            <p className="text-muted-foreground">
              You haven&apos;t created any projects yet. Create your first project to get started.
            </p>
            <Button onClick={handleOpenCreateDialog} className="mt-4">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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