import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Code, Filter, Lightbulb, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

// Types for insights
interface Insight {
    id: string;
    issue: string;
    description: string;
    priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
    icon: 'alert' | 'trend' | 'code' | 'performance';
    category: 'Failure Patterns' | 'Test Flakiness' | 'Performance Issues' | 'Code Quality';
    detectedAt: string;
    affectedModules: string[];
    impact: string;
    suggestedAction: string;
    status: 'New' | 'Acknowledged' | 'In Progress' | 'Resolved';
}

// Mock data for now - would be replaced with API data in production
const mockInsights: Insight[] = [
    {
        id: '1',
        issue: 'Payment Gateway Integration Failure Pattern',
        description: 'Recurring test failures detected in the payment gateway integration. Failures follow a pattern of timeouts during high traffic periods.',
        priority: 'High Priority',
        icon: 'alert',
        category: 'Failure Patterns',
        detectedAt: '2024-08-10',
        affectedModules: ['Payment', 'Checkout'],
        impact: 'Customer payment flows affected during peak hours',
        suggestedAction: 'Implement retry mechanism with exponential backoff',
        status: 'New'
    },
    {
        id: '2',
        issue: 'Rising Test Flakiness in Profile Module',
        description: 'Tests in the Profile module are showing increasing flakiness over the past 2 weeks, especially in the user preference settings tests.',
        priority: 'Medium Priority',
        icon: 'trend',
        category: 'Test Flakiness',
        detectedAt: '2024-08-08',
        affectedModules: ['Profile', 'User Settings'],
        impact: 'Unreliable test results leading to false positives in CI pipeline',
        suggestedAction: 'Review async operations and implement proper waiting mechanisms',
        status: 'Acknowledged'
    },
    {
        id: '3',
        issue: 'Database Query Performance Degradation',
        description: 'Query execution time has increased by 45% in the past week for product catalog searches.',
        priority: 'High Priority',
        icon: 'performance',
        category: 'Performance Issues',
        detectedAt: '2024-08-12',
        affectedModules: ['Product Catalog', 'Search'],
        impact: 'Slow search results for customers, higher bounce rate',
        suggestedAction: 'Optimize query and consider adding index on frequently searched fields',
        status: 'In Progress'
    },
    {
        id: '4',
        issue: 'Authentication Flow Regression',
        description: 'Recent changes to the authentication flow have caused intermittent failures in the login process.',
        priority: 'High Priority',
        icon: 'alert',
        category: 'Failure Patterns',
        detectedAt: '2024-08-11',
        affectedModules: ['Authentication', 'Security'],
        impact: 'Users unable to log in occasionally',
        suggestedAction: 'Review recent changes and add comprehensive tests for edge cases',
        status: 'New'
    },
    {
        id: '5',
        issue: 'CSS Selector Brittleness in E2E Tests',
        description: 'E2E tests frequently break due to changing CSS selectors in the UI components.',
        priority: 'Medium Priority',
        icon: 'code',
        category: 'Code Quality',
        detectedAt: '2024-08-09',
        affectedModules: ['E2E Tests', 'UI Components'],
        impact: 'Frequent maintenance required for test suite',
        suggestedAction: 'Implement data-testid attributes for stable test selectors',
        status: 'Acknowledged'
    },
    {
        id: '6',
        issue: 'Memory Leak in Real-time Dashboard',
        description: "The real-time dashboard component doesn't properly clean up resources, leading to memory leaks in long sessions.",
        priority: 'Medium Priority',
        icon: 'performance',
        category: 'Performance Issues',
        detectedAt: '2024-08-07',
        affectedModules: ['Dashboard', 'Real-time Updates'],
        impact: 'Browser performance degradation over time',
        suggestedAction: 'Proper cleanup in useEffect hooks and event listener removal',
        status: 'New'
    },
    {
        id: '7',
        issue: 'API Response Handling Inconsistencies',
        description: 'Multiple components handle API errors differently, leading to inconsistent user experience.',
        priority: 'Low Priority',
        icon: 'code',
        category: 'Code Quality',
        detectedAt: '2024-08-06',
        affectedModules: ['API Client', 'Error Handling'],
        impact: 'Inconsistent error messages and recovery flows',
        suggestedAction: 'Implement centralized error handling strategy',
        status: 'Resolved'
    },
    {
        id: '8',
        issue: 'Test Coverage Gaps in Checkout Flow',
        description: 'Analysis shows significant test coverage gaps in the checkout flow, particularly around promo code application.',
        priority: 'Low Priority',
        icon: 'code',
        category: 'Code Quality',
        detectedAt: '2024-08-05',
        affectedModules: ['Checkout', 'Promotions'],
        impact: 'Higher risk of regressions in promo code functionality',
        suggestedAction: 'Add targeted tests for promo code application scenarios',
        status: 'New'
    }
];

// Helper function to get the icon component
const getInsightIcon = (icon: string) => {
    switch (icon) {
        case 'alert':
            return <AlertCircle className="h-5 w-5 text-red-500" />;
        case 'trend':
            return <TrendingUp className="h-5 w-5 text-amber-500" />;
        case 'code':
            return <Code className="h-5 w-5 text-blue-500" />;
        case 'performance':
            return <Zap className="h-5 w-5 text-purple-500" />;
        default:
            return <Lightbulb className="h-5 w-5 text-green-500" />;
    }
};

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
    if (priority.includes('High')) return 'text-red-500';
    if (priority.includes('Medium')) return 'text-amber-500';
    return 'text-green-500';
};

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'New':
            return 'default';
        case 'Acknowledged':
            return 'secondary';
        case 'In Progress':
            return 'outline';
        case 'Resolved':
            return 'destructive';
        default:
            return 'outline';
    }
};

// Component for a single insight card (detailed view)
const InsightCard = ({ insight }: { insight: Insight }) => {
    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        {getInsightIcon(insight.icon)}
                        <CardTitle className="text-lg">{insight.issue}</CardTitle>
                    </div>
                    <Badge variant={getStatusBadgeVariant(insight.status)}>{insight.status}</Badge>
                </div>
                <div className={`text-sm ${getPriorityColor(insight.priority)}`}>
                    {insight.priority}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <p className="text-sm text-gray-700">{insight.description}</p>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Category:</span> {insight.category}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Detected:</span> {insight.detectedAt}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Affected Modules:</span> {insight.affectedModules.join(', ')}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Impact:</span> {insight.impact}
                        </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Suggested Action:</h4>
                        <p className="text-sm">{insight.suggestedAction}</p>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                        <Button variant="outline" size="sm">Take Action</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Component for a compact insight item in a list
const InsightListItem = ({ insight }: { insight: Insight }) => {
    return (
        <div className="flex items-start gap-3 py-3 border-b last:border-0">
            {getInsightIcon(insight.icon)}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{insight.issue}</h3>
                    <Badge variant={getStatusBadgeVariant(insight.status)} className="ml-2 shrink-0">
                        {insight.status}
                    </Badge>
                </div>
                <p className="text-sm text-gray-600 truncate">{insight.description}</p>
                <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs ${getPriorityColor(insight.priority)}`}>
                        {insight.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                        {insight.detectedAt}
                    </span>
                </div>
            </div>
        </div>
    );
};

export function InsightsContent({ projectId }: { projectId: string }) {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [activeView, setActiveView] = useState<"all" | "high" | "new">("all");

    // Fetch insights data on component mount
    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            try {
                // In a real implementation, this would call the API
                // const response = await apiRequest<{ success: boolean, insights: Insight[] }>(
                //     API_ENDPOINTS.insights.getByProjectId(projectId),
                //     { method: "GET" }
                // );
                
                // if (response.status !== STATUS.SUCCESS || !response.data.success) {
                //     throw new Error(response.error?.message || 'Failed to fetch insights');
                // }
                
                // setInsights(response.data.insights);
                
                // Mock data loading with a timeout for now
                setTimeout(() => {
                    setInsights(mockInsights);
                    setLoading(false);
                }, 500);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch insights');
                setLoading(false);
            }
        };
        
        fetchInsights();
    }, [projectId]);

    // Filter insights based on active filters
    const filteredInsights = insights.filter(insight => {
        // For the category filter dropdown
        if (activeFilters.length > 0 && !activeFilters.includes(insight.category)) {
            return false;
        }
        
        // For the priority filter dropdown
        if (priorityFilter.length > 0 && !priorityFilter.includes(insight.priority)) {
            return false;
        }
        
        // For the status filter dropdown
        if (statusFilter.length > 0 && !statusFilter.includes(insight.status)) {
            return false;
        }
        
        // For the tab selection
        if (activeView === "high" && !insight.priority.includes("High")) {
            return false;
        }
        
        if (activeView === "new" && insight.status !== "New") {
            return false;
        }
        
        return true;
    });

    // Get all available categories
    const categories = Array.from(new Set(insights.map(insight => insight.category)));
    const priorities = Array.from(new Set(insights.map(insight => insight.priority)));
    const statuses = Array.from(new Set(insights.map(insight => insight.status)));

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader />
                <span className="ml-3 text-gray-600">Loading insights...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Failed to load insights</h3>
                    <p className="text-gray-600 text-center">{error}</p>
                    <Button variant="outline" className="mt-4">Retry</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                        AI Insights
                    </CardTitle>
                    <div className="flex gap-2">
                        {/* Category Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8">
                                    <Filter className="h-4 w-4 mr-1" /> Category
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {categories.map(category => (
                                    <DropdownMenuCheckboxItem
                                        key={category}
                                        checked={activeFilters.includes(category)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setActiveFilters(prev => [...prev, category]);
                                            } else {
                                                setActiveFilters(prev => prev.filter(c => c !== category));
                                            }
                                        }}
                                    >
                                        {category}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {/* Priority Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8">
                                    <Filter className="h-4 w-4 mr-1" /> Priority
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {priorities.map(priority => (
                                    <DropdownMenuCheckboxItem
                                        key={priority}
                                        checked={priorityFilter.includes(priority)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setPriorityFilter(prev => [...prev, priority]);
                                            } else {
                                                setPriorityFilter(prev => prev.filter(p => p !== priority));
                                            }
                                        }}
                                    >
                                        {priority}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {/* Status Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8">
                                    <Filter className="h-4 w-4 mr-1" /> Status
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {statuses.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={statusFilter.includes(status)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setStatusFilter(prev => [...prev, status]);
                                            } else {
                                                setStatusFilter(prev => prev.filter(s => s !== status));
                                            }
                                        }}
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setActiveView(value as any)}>
                    <TabsList>
                        <TabsTrigger value="all">All Insights</TabsTrigger>
                        <TabsTrigger value="high">High Priority</TabsTrigger>
                        <TabsTrigger value="new">New</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-4">
                        {filteredInsights.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No insights match your current filters
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filteredInsights.map(insight => (
                                    <InsightCard key={insight.id} insight={insight} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="high" className="mt-4">
                        {filteredInsights.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No high priority insights found
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filteredInsights.map(insight => (
                                    <InsightCard key={insight.id} insight={insight} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="new" className="mt-4">
                        {filteredInsights.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No new insights found
                            </div>
                        ) : (
                            <div>
                                {filteredInsights.map(insight => (
                                    <InsightListItem key={insight.id} insight={insight} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}