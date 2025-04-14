import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { type Project } from "@/hooks/projects/use-projects";

interface ProjectCardProps {
    project: Project;
    onView: (projectId: string) => void;
    onEdit: (project: Project) => void;
    onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onView, onEdit, onDelete }: ProjectCardProps) {
    const formattedDate = project.createdAt
        ? new Date(project.createdAt).toLocaleDateString()
        : "";

    return (
        <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="pb-0">
                <h3 className="font-medium">{project.name}</h3>
                {formattedDate && (
                    <p className="text-xs text-muted-foreground">{formattedDate}</p>
                )}
            </CardHeader>
            <CardContent className="pt-2 pb-4">
                <p className="text-sm text-muted-foreground">
                    {project.description || "No description provided"}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-0">
                <Button
                    onClick={() => onView(project.id)}
                    className="bg-black text-white hover:bg-gray-800"
                    size="sm"
                >
                    View Details
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(project)}
                        className="h-8 w-8"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(project.id)}
                        className="h-8 w-8"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}