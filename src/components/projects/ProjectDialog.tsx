import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { type Project, type ProjectFormData } from "@/hooks/projects/use-projects";
import { AlertCircle } from "lucide-react";

interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (formData: ProjectFormData) => void;
    project?: Project | null;
    isEditMode?: boolean;
}

export function ProjectDialog({
    open,
    onOpenChange,
    onSubmit,
    project = null,
    isEditMode = false
}: ProjectDialogProps) {
    const [formData, setFormData] = useState<ProjectFormData>({
        name: "",
        description: "",
        settings: {
            retentionPeriod: 30,
            notificationsEnabled: true,
        }
    });

    const [errors, setErrors] = useState<{
        name?: string;
        retentionPeriod?: string;
    }>({});

    useEffect(() => {
        if (project && isEditMode) {
            setFormData({
                name: project.name,
                description: project.description,
                settings: {
                    retentionPeriod: project.settings.retentionPeriod,
                    notificationsEnabled: project.settings.notificationsEnabled,
                }
            });
        } else {
            setFormData({
                name: "",
                description: "",
                settings: {
                    retentionPeriod: 30,
                    notificationsEnabled: true,
                }
            });
        }
        setErrors({});
    }, [project, isEditMode, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'name' && errors.name) {
            setErrors({ ...errors, name: undefined });
        }
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData({
            ...formData,
            settings: {
                ...formData.settings,
                notificationsEnabled: checked
            }
        });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const numValue = parseInt(value) || 0;

        setFormData({
            ...formData,
            settings: {
                ...formData.settings,
                retentionPeriod: numValue
            }
        });

        if (numValue <= 0) {
            setErrors({ ...errors, retentionPeriod: "Must be greater than 0" });
        } else {
            setErrors({ ...errors, retentionPeriod: undefined });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { name?: string; retentionPeriod?: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Project name is required";
        }

        if (formData.settings.retentionPeriod <= 0) {
            newErrors.retentionPeriod = "Must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Project" : "Create Project"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Update your project details below."
                            : "Fill in the details to create a new project."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-1">
                            Project Name
                            {errors.name && (
                                <span className="text-destructive flex items-center text-xs">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.name}
                                </span>
                            )}
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter project name"
                            className={errors.name ? "border-destructive" : ""}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter project description"
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                        <h3 className="text-sm font-medium">Project Settings</h3>

                        <div className="space-y-2">
                            <Label htmlFor="retentionPeriod" className="flex items-center gap-1">
                                Retention Period (days)
                                {errors.retentionPeriod && (
                                    <span className="text-destructive flex items-center text-xs">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.retentionPeriod}
                                    </span>
                                )}
                            </Label>
                            <Input
                                id="retentionPeriod"
                                name="retentionPeriod"
                                type="number"
                                min="1"
                                value={formData.settings.retentionPeriod}
                                onChange={handleNumberChange}
                                className={errors.retentionPeriod ? "border-destructive" : ""}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="notificationsEnabled" className="cursor-pointer">
                                Enable Notifications
                            </Label>
                            <Switch
                                id="notificationsEnabled"
                                checked={formData.settings.notificationsEnabled}
                                onCheckedChange={handleSwitchChange}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {isEditMode ? "Update" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 