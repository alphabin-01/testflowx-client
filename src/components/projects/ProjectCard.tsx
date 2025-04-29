import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellIcon, Calendar, ChevronRight, Edit, Trash2 } from "lucide-react";
import { type Project } from "@/hooks/projects/use-projects";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
    project: Project;
    onView: (projectId: string) => void;
    onEdit: (project: Project) => void;
    onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onView, onEdit, onDelete }: ProjectCardProps) {
    const formattedDate = project.createdAt
        ? new Date(project.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : "";

    // Truncate description if it's too long
    const truncateDescription = (text: string, maxLength = 100) => {
        if (!text) return "No description provided";
        return text.length > maxLength
            ? `${text.substring(0, maxLength)}...`
            : text;
    };

    return (
        <Card className="group overflow-hidden border border-border/40 bg-card hover:border-primary/20 hover:shadow-md transition-all duration-200 rounded-lg shadow-sm">
            <CardHeader className="">
                <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-semibold text-lg tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-200">{project.name}</h3>
                    {project.settings?.notificationsEnabled && (
                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-0 font-normal flex items-center gap-1">
                            <BellIcon className="h-3 w-3" />
                            <span>Notifications</span>
                        </Badge>
                    )}
                </div>
                {formattedDate && (
                    <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formattedDate}</span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="px-5 py-4">
                <div className="min-h-[40px]">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {truncateDescription(project.description || "")}
                    </p>
                </div>

                {project.settings?.retentionPeriod && (
                    <div className="mt-4 pt-3 border-t border-border/30">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Retention period</span>
                            </div>
                            <span className="font-medium text-primary">{project.settings.retentionPeriod} days</span>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between items-center bg-muted/20 group-hover:bg-muted/30 transition-colors duration-200">
                <Button
                    onClick={() => onView(project.id)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm group-hover:shadow transition-all duration-200"
                    size="sm"
                >
                    <span>View Project</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1.5 opacity-70" />
                </Button>
                <div className="flex gap-1.5">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(project)}
                        className="h-8 w-8 border-border/50 bg-background hover:bg-primary/5 hover:border-primary/30 transition-colors duration-200"
                        title="Edit project"
                    >
                        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(project.id)}
                        className="h-8 w-8 border-border/50 bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors duration-200"
                        title="Delete project"
                    >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}