"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
    AlertCircle,
    BanIcon,
    PlusIcon,
    SearchIcon,
    X,
    CheckIcon,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Context and API
import { useApiKeys } from "@/contexts/api-key-context";
import { useProject } from "@/contexts/project-context";
import { API_ENDPOINTS } from "@/lib/api";
import { apiRequest, STATUS } from "@/lib/api-client";

// Types
type ApiKeyPermissions = {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
};

type Project = {
    _id: string;
    name: string;
};

type ApiKey = {
    id: string;
    name: string;
    key: string;
    project: Project;
    permissions: ApiKeyPermissions;
    isActive: boolean;
    expiresAt: string;
    createdAt: string;
};

type ApiKeyListProps = {
    projectId: string;
};

type ApiKeyResponse = {
    success: boolean;
    message: string;
    apiKey: {
        id: string;
        key: string;
        name: string;
        project: string;
        permissions: ApiKeyPermissions;
        expiresAt: string;
        createdAt: string;
    };
};

// Default values
const DEFAULT_KEY_NAME = "Test Runner Key";
const DEFAULT_PERMISSIONS = {
    canRead: true,
    canWrite: true,
    canDelete: false,
};

export function ApiKeyList({ projectId }: ApiKeyListProps) {
    // API Key List states
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Form states
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [keyName, setKeyName] = useState(DEFAULT_KEY_NAME);
    const [permissions, setPermissions] = useState<ApiKeyPermissions>(DEFAULT_PERMISSIONS);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [keyWasCopied, setKeyWasCopied] = useState(false);

    // Contexts
    const { getProjectApiKeys, refreshApiKeys, isLoading } = useApiKeys();
    const { currentProject } = useProject();

    // Filter API keys based on search query and filters
    const filteredKeys = useMemo(() => {
        if (!apiKeys.length) return [];

        let result = apiKeys;

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(key =>
                key.name.toLowerCase().includes(query) ||
                key.key.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            const isActive = statusFilter === "active";
            result = result.filter(key => key.isActive === isActive);
        }

        return result;
    }, [apiKeys, searchQuery, statusFilter]);

    // Load API keys
    const loadApiKeys = useCallback(async () => {
        try {
            setLoading(true);
            const keys = await getProjectApiKeys(projectId);
            setApiKeys(keys);
        } catch (error) {
            console.error("Error loading API keys:", error);
            setError("Failed to load API keys");
            toast.error("Failed to load API keys");
        } finally {
            setLoading(false);
        }
    }, [projectId, getProjectApiKeys]);

    // Load API keys on component mount and projectId change
    useEffect(() => {
        loadApiKeys();
    }, [loadApiKeys]);

    // Form handlers
    const resetFormState = useCallback(() => {
        setKeyName(DEFAULT_KEY_NAME);
        setPermissions(DEFAULT_PERMISSIONS);
        setIsGenerating(false);
        setGeneratedKey(null);
        setKeyWasCopied(false);
    }, []);

    const toggleCreateForm = useCallback(() => {
        if (showCreateForm) {
            if (!generatedKey || keyWasCopied) {
                setShowCreateForm(false);
                resetFormState();
            } else {
                toast.error("Please copy your API key before closing", {
                    description: "This key will not be shown again."
                });
            }
        } else {
            resetFormState();
            setShowCreateForm(true);
        }
    }, [showCreateForm, generatedKey, keyWasCopied, resetFormState]);

    const handlePermissionChange = useCallback((permission: keyof ApiKeyPermissions) => {
        setPermissions(prev => ({
            ...prev,
            [permission]: !prev[permission],
        }));
    }, []);

    const handleGenerateKey = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!keyName.trim()) {
            toast.error("Please enter a name for your API key");
            return;
        }

        setIsGenerating(true);

        try {
            const response = await apiRequest<ApiKeyResponse>(API_ENDPOINTS.apiKeys.create, {
                method: "POST",
                body: {
                    name: keyName.trim(),
                    projectId,
                    expiresIn: 30,
                    permissions,
                },
            });

            if (response.status === STATUS.SUCCESS && response.data) {
                toast.success("API key created successfully");
                setGeneratedKey(response.data.apiKey.key);

                // Refresh the keys list
                setTimeout(async () => {
                    try {
                        await refreshApiKeys();
                        await loadApiKeys();
                    } catch (err) {
                        console.error("Error refreshing keys:", err);
                    }
                }, 300);
            } else {
                toast.error("Failed to create API key");
            }
        } catch (error) {
            toast.error("An error occurred while creating the API key");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyKey = useCallback(() => {
        if (generatedKey) {
            try {
                navigator.clipboard.writeText(generatedKey);
                setKeyWasCopied(true);
                toast.success("API key copied to clipboard");
            } catch (err) {
                console.error("Failed to copy:", err);
                toast.error("Failed to copy API key. Please select and copy it manually.");
            }
        }
    }, [generatedKey]);

    const handleRevokeApiKey = async (id: string) => {
        if (confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
            try {
                await apiRequest(API_ENDPOINTS.apiKeys.revoke(id), {
                    method: "DELETE",
                });
                toast.success("API key revoked successfully");
                await refreshApiKeys();
                await loadApiKeys();
            } catch (error) {
                toast.error("Failed to revoke API key");
                console.error(error);
            }
        }
    };

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
        setStatusFilter("all");
    }, []);

    // Loading state
    if (loading || isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Loading API keys...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription className="text-red-500">{error}</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // Get the project name from context or use a fallback
    const projectName = currentProject?.name || "Your Project";

    // If no API keys found for this project, show a simplified create view
    if (apiKeys.length === 0) {
        return (
            <Card className="w-full max-w-md mx-auto shadow-md">
                <CardHeader>
                    <CardTitle>Create API Key</CardTitle>
                    <CardDescription>Generate an API key for {projectName}</CardDescription>
                </CardHeader>
                <CardContent>
                    {!generatedKey ? (
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    This API key will allow your test runner to communicate with TestFlowX.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="key-name">API Key Name</Label>
                                <Input
                                    id="key-name"
                                    value={keyName}
                                    onChange={(e) => setKeyName(e.target.value)}
                                    placeholder="Enter a name for this API key"
                                    disabled={isGenerating}
                                />
                            </div>

                            <div className="space-y-4 mt-4">
                                <Label>Permissions</Label>
                                <PermissionCheckboxes
                                    permissions={permissions}
                                    onChange={handlePermissionChange}
                                    disabled={isGenerating}
                                />
                            </div>

                            <Button
                                type="button"
                                className="w-full"
                                onClick={handleGenerateKey}
                                disabled={isGenerating}
                            >
                                {isGenerating ? "Generating..." : "Generate API Key"}
                            </Button>
                        </form>
                    ) : (
                        <GeneratedKeyDisplay
                            generatedKey={generatedKey}
                            keyWasCopied={keyWasCopied}
                            onCopy={handleCopyKey}
                            onComplete={() => window.location.reload()}
                        />
                    )}
                </CardContent>
            </Card>
        );
    }

    // Render the main view with existing API keys
    return (
        <>
            <CardHeader className="flex flex-row items-center justify-between">
                <div></div>
                <Button size="sm" onClick={toggleCreateForm} disabled={showCreateForm}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Key
                </Button>
            </CardHeader>

            {showCreateForm && (
                <Card className="bg-muted/30 mx-5">
                    <CardContent className="py-4">
                        <div className="space-y-4">
                            {!generatedKey ? (
                                <CreateKeyForm
                                    keyName={keyName}
                                    setKeyName={setKeyName}
                                    permissions={permissions}
                                    handlePermissionChange={handlePermissionChange}
                                    isGenerating={isGenerating}
                                    handleGenerateKey={handleGenerateKey}
                                    toggleCreateForm={toggleCreateForm}
                                />
                            ) : (
                                <GeneratedKeyInline
                                    generatedKey={generatedKey}
                                    keyWasCopied={keyWasCopied}
                                    onCopy={handleCopyKey}
                                    onClose={toggleCreateForm}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {!showCreateForm && (
                <Card>
                    <CardContent>
                        <KeysFilterBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            handleClearFilters={handleClearFilters}
                        />

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Name</TableHead>
                                    <TableHead>Key</TableHead>
                                    <TableHead className="w-[200px]">Status</TableHead>
                                    <TableHead className="w-[200px]">Expires</TableHead>
                                    <TableHead className="w-[200px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredKeys.filter(apiKey => apiKey.isActive).length > 0 ? (
                                    filteredKeys
                                        .filter(apiKey => apiKey.isActive)
                                        .map((apiKey) => {
                                            const expiryDate = new Date(apiKey.expiresAt);
                                            const formattedExpiry = expiryDate.toLocaleDateString();

                                            return (
                                                <TableRow key={apiKey.id}>
                                                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                                                    <TableCell className="font-mono text-xs">{apiKey.key}</TableCell>
                                                    <TableCell>
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-1">
                                                            Active
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{formattedExpiry}</TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRevokeApiKey(apiKey.id)}
                                                                title="Revoke API Key"
                                                                className="flex items-center"
                                                            >
                                                                <BanIcon className="h-4 w-4 mr-1 text-red-500" />
                                                                Revoke
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No active API keys match your search criteria
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </>
    );
}

// Extracted components for better organization

// Permission Checkboxes
function PermissionCheckboxes({
    permissions,
    onChange,
    disabled = false,
    inline = false
}: {
    permissions: ApiKeyPermissions;
    onChange: (permission: keyof ApiKeyPermissions) => void;
    disabled?: boolean;
    inline?: boolean;
}) {
    return (
        <div className={inline ? "flex flex-wrap gap-4" : "space-y-4"}>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={inline ? "inline-read" : "read"}
                    checked={permissions.canRead}
                    onCheckedChange={() => onChange("canRead")}
                    disabled={disabled}
                />
                <Label htmlFor={inline ? "inline-read" : "read"}>Read Access</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={inline ? "inline-write" : "write"}
                    checked={permissions.canWrite}
                    onCheckedChange={() => onChange("canWrite")}
                    disabled={disabled}
                />
                <Label htmlFor={inline ? "inline-write" : "write"}>Write Access</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={inline ? "inline-delete" : "delete"}
                    checked={permissions.canDelete}
                    onCheckedChange={() => onChange("canDelete")}
                    disabled={disabled}
                />
                <Label htmlFor={inline ? "inline-delete" : "delete"}>Delete Access</Label>
            </div>
        </div>
    );
}

// Generated Key Display Component
function GeneratedKeyDisplay({
    generatedKey,
    keyWasCopied,
    onCopy,
    onComplete
}: {
    generatedKey: string;
    keyWasCopied: boolean;
    onCopy: () => void;
    onComplete: () => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-start space-x-2 p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                    Your API key has been created. Please copy it now. For security reasons, it won&apos;t be shown again.
                </p>
            </div>

            <div className="p-3 bg-muted rounded-md break-all font-mono text-sm select-all">
                {generatedKey}
            </div>

            <div className="flex flex-col space-y-2">
                <Button
                    variant={keyWasCopied ? "outline" : "default"}
                    onClick={onCopy}
                    className={`w-full ${keyWasCopied ? "" : "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"}`}
                >
                    {keyWasCopied ? "Copied! Click to copy again" : "Copy to Clipboard"}
                </Button>

                <Button
                    onClick={onComplete}
                    className="w-full"
                    disabled={!keyWasCopied}
                >
                    Let&apos;s Go
                </Button>

                {!keyWasCopied && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                        You must copy the API key before continuing
                    </p>
                )}
            </div>
        </div>
    );
}

// Generated Key Inline Component
function GeneratedKeyInline({
    generatedKey,
    keyWasCopied,
    onCopy,
    onClose
}: {
    generatedKey: string;
    keyWasCopied: boolean;
    onCopy: () => void;
    onClose: () => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-500" />
                    <p className="text-sm">
                        Your API key has been created. Please copy it now. For security reasons, it won&apos;t be shown again.
                    </p>
                </div>
                {keyWasCopied && (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onClose}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="p-3 bg-muted rounded-md break-all font-mono text-sm select-all">
                {generatedKey}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant={keyWasCopied ? "outline" : "default"}
                    onClick={onCopy}
                    className={keyWasCopied ? "" : "bg-green-600 hover:bg-green-700"}
                    size="sm"
                >
                    {keyWasCopied ? (
                        <span className="flex items-center">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Copied
                        </span>
                    ) : (
                        "Copy to Clipboard"
                    )}
                </Button>

                {keyWasCopied && (
                    <Button
                        onClick={onClose}
                        variant="outline"
                        size="sm"
                    >
                        Close
                    </Button>
                )}

                {!keyWasCopied && (
                    <p className="text-xs text-muted-foreground">
                        You must copy the API key before closing
                    </p>
                )}
            </div>
        </div>
    );
}

// Create Key Form Component
function CreateKeyForm({
    keyName,
    setKeyName,
    permissions,
    handlePermissionChange,
    isGenerating,
    handleGenerateKey,
    toggleCreateForm
}: {
    keyName: string;
    setKeyName: (value: string) => void;
    permissions: ApiKeyPermissions;
    handlePermissionChange: (permission: keyof ApiKeyPermissions) => void;
    isGenerating: boolean;
    handleGenerateKey: (e: React.MouseEvent<HTMLButtonElement>) => void;
    toggleCreateForm: () => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h3 className="text-lg font-semibold">Create New API Key</h3>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleCreateForm}
                    className="h-8 w-8"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <div className="space-y-3">
                <div>
                    <Label htmlFor="inline-key-name">API Key Name</Label>
                    <Input
                        id="inline-key-name"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        placeholder="Enter a name for this API key"
                        disabled={isGenerating}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label className="mb-2 block">Permissions</Label>
                    <PermissionCheckboxes
                        permissions={permissions}
                        onChange={handlePermissionChange}
                        disabled={isGenerating}
                        inline={true}
                    />
                </div>
                <div className="pt-2">
                    <Button
                        onClick={handleGenerateKey}
                        disabled={isGenerating}
                        className="w-full sm:w-auto"
                    >
                        {isGenerating ? "Generating..." : "Generate API Key"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Keys Filter Bar Component
function KeysFilterBar({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    handleClearFilters,
    hasFilters
}: {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    handleClearFilters: () => void;
    hasFilters: boolean;
}) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-grow min-w-[200px]">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search API keys..."
                        className="pl-8 h-9 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
}