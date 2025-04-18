"use client";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects, type Project, type ProjectFormData } from "@/hooks/projects/use-projects";
import { PlusCircle, RefreshCw, LayoutDashboard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/auth-context";

export default function ProjectsPage() {
  const router = useRouter();
  const { logout } = useAuth();
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
    <div className="flex flex-col mx-auto min-h-[calc(100vh-4rem)] bg-background/50">
      {/* Page Header */}
      <div className="w-full bg-card border-b border-border/30 shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-3 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <LayoutDashboard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Manage and monitor your test projects</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">

              <Button
                variant="ghost"
                onClick={() => logout()}
                size="sm"
                className="h-9 text-sm font-medium text-red-500"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto py-8 px-3 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden border border-border/40 bg-card shadow-sm rounded-lg">
                <div className="p-5 space-y-4">
                  <Skeleton className="h-6 w-3/4 mb-1.5" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-20 w-full rounded-md mb-4" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-9 w-28 rounded-md" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : !projects || projects.length === 0 ? (
          <Card className="border border-dashed border-border/60 bg-card/50 rounded-lg shadow-sm">


            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <PlusCircle className="h-8 w-8 text-primary/70" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You haven&apos;t created any projects yet. Create your first project to start setting up test cases and monitoring results.
              </p>
              <Button
                onClick={handleOpenCreateDialog}
                className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 justify-between">
              <p className="text-sm text-muted-foreground">Showing {projects.length} projects</p>
              <Button
                onClick={handleOpenCreateDialog}
                size="sm"
                className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-2" />
                New Project
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
          </div>

        )}
      </div>

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