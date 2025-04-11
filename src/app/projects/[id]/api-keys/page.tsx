import DashboardLayout from "@/app/dashboard-layout";
import { ApiKeyList } from "@/components/api-keys/api-key-list";

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const projectId = id;

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 p-8">
                <div className="flex flex-col space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight">API Keys</h2>
                    <p className="text-muted-foreground">
                        Manage your API keys for this project
                    </p>
                </div>
                <ApiKeyList projectId={projectId} />
            </div>
        </DashboardLayout>
    );
}
