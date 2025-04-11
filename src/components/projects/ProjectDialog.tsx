import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { type Project, type ProjectFormData } from "@/hooks/use-projects";

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
        retentionPeriod: 30,
        notificationsEnabled: true,
    });

    useEffect(() => {
        if (project && isEditMode) {
            setFormData({
                name: project.name,
                description: project.description,
                retentionPeriod: project.settings.retentionPeriod,
                notificationsEnabled: project.settings.notificationsEnabled,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                retentionPeriod: 30,
                notificationsEnabled: true,
            });
        }
    }, [project, isEditMode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData({ ...formData, notificationsEnabled: checked });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: parseInt(value) || 0 });
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Project" : "Create Project"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Update your project details below."
                            : "Fill in the details to create a new project."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter project name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter project description"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                        <Input
                            id="retentionPeriod"
                            name="retentionPeriod"
                            type="number"
                            min="1"
                            value={formData.retentionPeriod}
                            onChange={handleNumberChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notificationsEnabled">Enable Notifications</Label>
                        <Switch
                            id="notificationsEnabled"
                            checked={formData.notificationsEnabled}
                            onCheckedChange={handleSwitchChange}
                        />
                    </div>
                </div>
                <DialogFooter>
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