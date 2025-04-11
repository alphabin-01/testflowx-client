import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { type Project } from "@/hooks/use-projects";

interface ProjectCardProps {
    project: Project;
    onView: (projectId: string) => void;
    onEdit: (project: Project) => void;
    onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onView, onEdit, onDelete }: ProjectCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-start justify-between">
                    <span className="truncate">{project.name}</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    {project.createdAt && new Date(project.createdAt).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description || "No description provided"}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => onView(project.id)}>
                    View Details
                </Button>
                <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(project.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
} 