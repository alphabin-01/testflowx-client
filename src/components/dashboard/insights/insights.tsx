import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Loader } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, AlertTriangle, Bug, CheckCircle2, Clock, Code, ExternalLink, Filter, Info, Layout, Sparkles, TrendingUp, XCircle, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis, YAxis
} from 'recharts';

// Types for test insights remain the same
interface InsightCard {
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    category: 'Test Flakiness' | 'Failure Patterns' | 'Performance Issues' | 'Code Quality';
    detectedDate: string;
    affectedModules?: string[];
    impact: string;
    description: string;
    suggestedAction: string;
    rootCause: string;
    trend: string;
    blockingTests?: string[];
    "blocking other tests"?: string;
    blocker?: boolean;
}

interface TopFailure {
    description: string;
    businessImpact: string;
    frequency: number;
    isBlocking?: boolean;
    "blocking other tests"?: string;
    blocker?: boolean;
    component: string;
    rootCause: string;
}

interface CriticalFailure {
    description: string;
    businessImpact: string;
    frequency: number;
    rootCause: string;
    recommendations: string;
}

interface FlakyTests {
    percentage: number;
    affectedModules?: string[];
    impact: string;
    priority?: string;
    stabilizationStrategies: string[];
}

interface RankingSystem {
    parameters: string[];
    algorithm: {
        type: string;
        weights: Record<string, number>;
    };
    rankedFailures: {
        title: string;
        score: number;
    }[];
}

interface BugsVsUIChanges {
    bugs: {
        count: number;
        modules: string[];
        description: string;
    };
    uiChanges: {
        count: number;
        modules: string[];
        description: string;
    };
    impact?: string;
}

interface TestInsightsData {
    insightCards: InsightCard[];
    topFailures: TopFailure[];
    criticalFailures: CriticalFailure[];
    flakyTests: FlakyTests;
    rankingSystem: RankingSystem;
    bugsVsUIChanges: BugsVsUIChanges;
}

// Mock data (unchanged)
const mockTestInsights: TestInsightsData = {
    "insightCards": [
        {
            "title": "Authentication Test Flakiness",
            "priority": "High",
            "category": "Test Flakiness",
            "detectedDate": "2023-03-01",
            "impact": "Delays user login",
            "description": "Intermittent failure in authentication tests due to timeout",
            "suggestedAction": "Add explicit waits",
            "rootCause": "Infra Instability",
            "trend": "Intermittent",
            "blocker": true
        },
        {
            "title": "Payment Gateway Failure",
            "priority": "High",
            "category": "Failure Patterns",
            "detectedDate": "2023-02-20",
            "impact": "Affects revenue",
            "description": "Consistent failure in payment processing tests",
            "suggestedAction": "Verify API integration",
            "rootCause": "Third-Party Dependency",
            "trend": "Rising",
            "blocker": true
        },
        {
            "title": "UI Test Instability",
            "priority": "Medium",
            "category": "Test Flakiness",
            "detectedDate": "2023-02-15",
            "impact": "Reduces test reliability",
            "description": "Flaky UI tests due to DOM changes",
            "suggestedAction": "Update test selectors",
            "rootCause": "UI Change",
            "trend": "Falling",
            "blocker": false
        }
    ],
    "topFailures": [
        {
            "description": "Authentication failure",
            "businessImpact": "High",
            "frequency": 0.3,
            "blocker": true,
            "component": "Login Module",
            "rootCause": "Infra Instability",
            "isBlocking": true
        },
        {
            "description": "Payment processing error",
            "businessImpact": "High",
            "frequency": 0.25,
            "blocker": true,
            "component": "Payment Gateway",
            "rootCause": "Third-Party Dependency",
            "isBlocking": true
        }
    ],
    "criticalFailures": [
        {
            "description": "Critical authentication failure",
            "businessImpact": "High",
            "frequency": 10,
            "rootCause": "Infra Issue",
            "recommendations": "Improve infra stability"
        }
    ],
    "flakyTests": {
        "percentage": 0.2,
        "priority": "Medium",
        "impact": "Affects test reliability",
        "stabilizationStrategies": [
            "Add explicit waits",
            "Avoid async timing"
        ]
    },
    "rankingSystem": {
        "parameters": [
            "businessImpact",
            "frequency",
            "isBlocking",
            "recency",
            "testFlakiness"
        ],
        "algorithm": {
            "type": "weightedScore",
            "weights": {
                "businessImpact": 0.4,
                "frequency": 0.3,
                "isBlocking": 0.2,
                "recency": 0.1
            }
        },
        "rankedFailures": [
            {
                "title": "Authentication Test Flakiness",
                "score": 0.85
            },
            {
                "title": "Payment Gateway Failure",
                "score": 0.8
            }
        ]
    },
    "bugsVsUIChanges": {
        "bugs": {
            "count": 15,
            "modules": [
                "Login Module",
                "Payment Gateway"
            ],
            "description": "Caused by code issues"
        },
        "uiChanges": {
            "count": 8,
            "modules": [
                "UI Components"
            ],
            "description": "Due to UI DOM changes"
        }
    }
};

// Enhanced Dashboard Summary Component
const DashboardSummary = ({ data }: { data: TestInsightsData }) => {
    const highPriorityCount = data.insightCards.filter(card => card.priority === 'High').length;
    const blockingIssuesCount = data.insightCards.filter(card => card.blocker === true).length;
    const flakyPercentage = data.flakyTests.percentage * 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-red-50">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-red-600">High Priority</p>
                            <p className="text-2xl font-bold">{highPriorityCount}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-amber-50">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-amber-600">Blocking Issues</p>
                            <p className="text-2xl font-bold">{blockingIssuesCount}</p>
                        </div>
                        <div className="bg-amber-100 p-3 rounded-full">
                            <XCircle className="h-6 w-6 text-amber-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-blue-600">Flaky Tests</p>
                            <p className="text-2xl font-bold">{flakyPercentage.toFixed(0)}%</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Clock className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-purple-50">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-purple-600">Total Insights</p>
                            <p className="text-2xl font-bold">{data.insightCards.length}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Sparkles className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Enhanced helper functions
const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'Test Flakiness':
            return <Clock className="h-5 w-5 text-amber-500" />;
        case 'Failure Patterns':
            return <AlertCircle className="h-5 w-5 text-red-500" />;
        case 'Performance Issues':
            return <Zap className="h-5 w-5 text-purple-500" />;
        case 'Code Quality':
            return <Code className="h-5 w-5 text-blue-500" />;
        default:
            return <Info className="h-5 w-5 text-gray-500" />;
    }
};

const getRootCauseIcon = (rootCause: string) => {
    switch (rootCause) {
        case 'UI Change':
            return <Layout className="h-5 w-5 text-indigo-500" />;
        case 'Code Bug':
            return <Bug className="h-5 w-5 text-red-500" />;
        case 'Infra Instability':
            return <AlertTriangle className="h-5 w-5 text-amber-500" />;
        case 'Third-Party Dependency':
            return <ExternalLink className="h-5 w-5 text-blue-500" />;
        default:
            return <Info className="h-5 w-5 text-gray-500" />;
    }
};

const getTrendIcon = (trend: string) => {
    switch (trend) {
        case 'Rising':
            return <TrendingUp className="h-4 w-4 text-red-500" />;
        case 'Falling':
            return <TrendingUp className="h-4 w-4 rotate-180 text-green-500" />;
        case 'Stable':
            return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
        case 'Intermittent':
            return <Clock className="h-4 w-4 text-amber-500" />;
        default:
            return <Info className="h-4 w-4 text-gray-500" />;
    }
};

const getPriorityBadgeVariant = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
        case 'High':
            return 'destructive';
        case 'Medium':
            return 'secondary';
        case 'Low':
            return 'outline';
        default:
            return 'outline';
    }
};

// Enhanced Insight Card Component
const TestInsightCard = ({ insight }: { insight: InsightCard }) => {
    return (
        <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        {getCategoryIcon(insight.category)}
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <Badge variant={getPriorityBadgeVariant(insight.priority)}>
                        {insight.priority} Priority
                    </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(insight.trend)}
                    <span className="text-sm">{insight.trend}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <p className="text-sm text-gray-700">{insight.description}</p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="flex items-center font-medium text-gray-700">
                                            Category:
                                            <Info className="h-3 w-3 text-gray-400 ml-1" />
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Type of test quality issue</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <span className="ml-1">{insight.category}</span>
                        </div>

                        <div>
                            <span className="font-medium text-gray-700">Detected: </span>
                            {insight.detectedDate}
                        </div>

                        <div className="flex items-center">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="flex items-center font-medium text-gray-700">
                                            Root Cause:
                                            <Info className="h-3 w-3 text-gray-400 ml-1" />
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The primary reason for the failure</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <span className="ml-1 flex items-center">
                                {insight.rootCause}
                                {getRootCauseIcon(insight.rootCause)}
                            </span>
                        </div>

                        <div>
                            <span className="font-medium text-gray-700">Impact: </span>
                            {insight.impact}
                        </div>

                        {insight.affectedModules && (
                            <div className="col-span-2">
                                <span className="font-medium text-gray-700">Affected Modules: </span>
                                {insight.affectedModules.join(', ')}
                            </div>
                        )}

                        {(insight.blocker === true || insight["blocking other tests"] === "true") && (
                            <div className="col-span-2">
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Blocking
                                </Badge>
                                <span className="text-xs ml-2 text-gray-500">
                                    This issue is blocking other tests from running successfully
                                </span>
                            </div>
                        )}
                    </div>

                    {insight.blockingTests && insight.blockingTests.length > 0 && (
                        <div>
                            <span className="font-medium text-gray-700">Blocking Tests:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {insight.blockingTests.map(test => (
                                    <Badge key={test} variant="outline">{test}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-2 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Suggested Action:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-blue-400">
                            {insight.suggestedAction}
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm">Investigate</Button>
                        <Button variant="default" size="sm">Fix Issue</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Enhanced Top Failures Component
const TopFailuresSection = ({ failures }: { failures: TopFailure[] }) => {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    Top Failures
                </CardTitle>
                <CardDescription>
                    Most frequent test failures ordered by business impact
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {failures.map((failure, index) => (
                        <div key={index} className="p-4 border rounded-md bg-gray-50 hover:shadow-sm transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium flex items-center">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 mr-2">
                                        {index + 1}
                                    </span>
                                    {failure.description}
                                </h3>
                                <Badge variant="destructive">{failure.businessImpact} Impact</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                                <div>
                                    <span className="font-medium text-gray-700">Component: </span>
                                    <Badge variant="outline" className="ml-1 bg-white">
                                        {failure.component}
                                    </Badge>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Root Cause: </span>
                                    <span className="inline-flex items-center">
                                        {failure.rootCause}
                                        {getRootCauseIcon(failure.rootCause)}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <span className="font-medium text-gray-700">Frequency: </span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Progress value={failure.frequency * 100} className="h-2" />
                                        <span className="text-xs font-medium">{(failure.frequency * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                {(failure.isBlocking || failure["blocking other tests"] === "true" || failure.blocker) && (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Blocking
                                    </Badge>
                                )}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">View Logs</Button>
                                    <Button variant="default" size="sm">Fix Issue</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Enhanced Critical Failures Component
const CriticalFailuresSection = ({ failures }: { failures: CriticalFailure[] }) => {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    Critical Failures
                </CardTitle>
                <CardDescription>
                    Issues that critically impact your application's functionality
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {failures.map((failure, index) => (
                        <div key={index} className="p-4 border-l-4 border-amber-500 rounded-md bg-amber-50">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium flex items-center">
                                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                                    {failure.description}
                                </h3>
                                <Badge variant="destructive">{failure.businessImpact} Impact</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                                <div>
                                    <span className="font-medium text-gray-700">Root Cause: </span>
                                    {failure.rootCause}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Frequency: </span>
                                    {(failure.frequency * 100).toFixed(0)}%
                                </div>
                            </div>
                            <div className="pt-2 border-t border-amber-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Action Plan:</h4>
                                <p className="text-sm bg-white p-2 rounded">
                                    {failure.recommendations}
                                </p>
                            </div>
                            <div className="flex justify-end gap-2 pt-3">
                                <Button variant="default" size="sm" className="bg-amber-600 hover:bg-amber-700">
                                    Prioritize Fix
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Enhanced Flaky Tests Component
const FlakyTestsSection = ({ flakyTests }: { flakyTests: FlakyTests }) => {
    // Create trend data for flaky tests over time (mock data)
    const trendData = [
        { date: 'Apr 14', percentage: 25 },
        { date: 'Apr 15', percentage: 28 },
        { date: 'Apr 16', percentage: 22 },
        { date: 'Apr 17', percentage: 19 },
        { date: 'Apr 18', percentage: 24 },
        { date: 'Apr 19', percentage: 20 },
        { date: 'Apr 20', percentage: flakyTests.percentage * 100 },
    ];

    return (
        <Card className="mb-6">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-lg flex items-center">
                            <Clock className="h-5 w-5 text-amber-500 mr-2" />
                            Flaky Tests Overview
                        </CardTitle>
                        <CardDescription>
                            Tests with inconsistent results that need stabilization
                        </CardDescription>
                    </div>
                    {flakyTests.priority && (
                        <Badge variant={getPriorityBadgeVariant(flakyTests.priority)}>
                            {flakyTests.priority} Priority
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <div className="absolute inset-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Flaky', value: flakyTests.percentage * 100 },
                                                    { name: 'Stable', value: (1 - flakyTests.percentage) * 100 }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={55}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                            >
                                                <Cell fill="#f59e0b" />
                                                <Cell fill="#10b981" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold">{(flakyTests.percentage * 100).toFixed(0)}%</div>
                                    <div className="text-xs text-gray-500">Flaky Tests</div>
                                </div>
                            </div>
                            <div className="text-sm">
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div>
                                    <span>Flaky: {(flakyTests.percentage * 100).toFixed(0)}%</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                    <span>Stable: {((1 - flakyTests.percentage) * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium mb-2">7-Day Trend:</h3>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis domain={[0, 40]} tickFormatter={(value) => `${value}%`} />
                                            <RechartsTooltip formatter={(value) => [`${value}%`, 'Flaky Tests']} />
                                            <Line
                                                type="monotone"
                                                dataKey="percentage"
                                                stroke="#f59e0b"
                                                strokeWidth={2}
                                                dot={{ fill: '#f59e0b', r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 border rounded-md bg-amber-50">
                            <h3 className="text-sm font-medium mb-2">Impact Analysis:</h3>
                            <p className="text-sm">{flakyTests.impact}</p>
                        </div>

                        {flakyTests.affectedModules && flakyTests.affectedModules.length > 0 && (
                            <div className="p-4 border rounded-md">
                                <h3 className="text-sm font-medium mb-2">Affected Modules:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {flakyTests.affectedModules.map(module => (
                                        <Badge key={module} variant="outline">{module}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-4 border rounded-md">
                            <h3 className="text-sm font-medium mb-2">Stabilization Strategies:</h3>
                            <ul className="space-y-2">
                                {flakyTests.stabilizationStrategies.map((strategy, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                        <span className="text-sm">{strategy}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">View All Flaky Tests</Button>
                            <Button variant="default" size="sm">Stabilize Tests</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Enhanced Ranking System Component
const RankingSystemSection = ({ ranking }: { ranking: RankingSystem }) => {
    // Create data for the bar chart
    const scoreData = ranking.rankedFailures.map(failure => ({
        name: failure.title,
        score: failure.score * 100
    }));

    // Create data for the weight distribution chart
    const weightData = Object.entries(ranking.algorithm.weights).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
        value: value * 100
    }));

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                    Test Failure Ranking System
                </CardTitle>
                <CardDescription>
                    Algorithm that prioritizes test failures based on multiple factors
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                            <Sparkles className="h-4 w-4 text-blue-500 mr-1" />
                            Highest Ranked Failures
                        </h3>
                        <div className="p-4 border rounded-md bg-gray-50">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={scoreData}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" domain={[0, 100]} unit="%" />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={150}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <RechartsTooltip formatter={(value) => [`${value}%`, 'Score']} />
                                        <Bar
                                            dataKey="score"
                                            fill="#3b82f6"
                                            radius={[0, 4, 4, 0]}
                                            label={{
                                                position: 'right',
                                                formatter: (value: number) => `${value.toFixed(0)}%`,
                                                fill: '#1e3a8a',
                                                fontSize: 12
                                            }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                            <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                            Algorithm Weight Distribution
                        </h3>
                        <div className="p-4 border rounded-md bg-gray-50">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={weightData}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis unit="%" domain={[0, 50]} />
                                        <RechartsTooltip formatter={(value) => [`${value}%`, 'Weight']} />
                                        <Bar
                                            dataKey="value"
                                            fill="#8884d8"
                                            radius={[4, 4, 0, 0]}
                                            label={{
                                                position: 'top',
                                                formatter: (value: number) => `${value.toFixed(0)}%`,
                                                fill: '#6b21a8',
                                                fontSize: 12
                                            }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Algorithm Type:</h3>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {ranking.algorithm.type.charAt(0).toUpperCase() + ranking.algorithm.type.slice(1)}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-2">
                            A weighted score system that considers multiple factors to rank test failures by importance
                        </p>
                    </div>
                    <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Ranking Parameters:</h3>
                        <div className="flex flex-wrap gap-2">
                            {ranking.parameters.map(param => (
                                <TooltipProvider key={param}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge variant="outline" className="bg-gray-50 cursor-help">
                                                {param.charAt(0).toUpperCase() + param.slice(1)}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Weight: {(ranking.algorithm.weights[param] || 0) * 100}%</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Enhanced Bugs vs UI Changes Component
const BugsVsUIChangesSection = ({ data }: { data: BugsVsUIChanges }) => {
    const pieChartData = [
        { name: 'Bugs', value: data.bugs.count },
        { name: 'UI Changes', value: data.uiChanges.count }
    ];

    const COLORS = ['#ef4444', '#8b5cf6'];
    const totalIssues = data.bugs.count + data.uiChanges.count;

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <Bug className="h-5 w-5 text-red-500 mr-2" />
                    Root Cause Analysis: Bugs vs UI Changes
                </CardTitle>
                <CardDescription>
                    Distribution of test failures between code bugs and UI changes
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3">
                        <h3 className="text-sm font-medium mb-3 text-center">Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value) => [value, 'Count']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center text-sm font-medium mt-2">
                            Total Issues: {totalIssues}
                        </div>
                    </div>
                    <div className="w-full md:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 border rounded-md bg-red-50 hover:shadow-sm transition-shadow duration-200">
                                <h3 className="font-medium flex items-center">
                                    <Bug className="h-4 w-4 text-red-500 mr-1" />
                                    Code Bugs ({data.bugs.count})
                                </h3>
                                <div className="flex items-center mt-2">
                                    <Progress value={(data.bugs.count / totalIssues) * 100} className="h-2" />
                                    <span className="text-xs ml-2 font-medium">
                                        {((data.bugs.count / totalIssues) * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <p className="text-sm mt-3">{data.bugs.description}</p>
                                <div className="mt-3">
                                    <h4 className="text-xs font-medium mb-1">Top Affected Modules:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {data.bugs.modules.map(module => (
                                            <Badge key={module} variant="outline" className="bg-white">
                                                {module}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border rounded-md bg-purple-50 hover:shadow-sm transition-shadow duration-200">
                                <h3 className="font-medium flex items-center">
                                    <Layout className="h-4 w-4 text-purple-500 mr-1" />
                                    UI Changes ({data.uiChanges.count})
                                </h3>
                                <div className="flex items-center mt-2">
                                    <Progress value={(data.uiChanges.count / totalIssues) * 100} className="h-2" />
                                    <span className="text-xs ml-2 font-medium">
                                        {((data.uiChanges.count / totalIssues) * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <p className="text-sm mt-3">{data.uiChanges.description}</p>
                                <div className="mt-3">
                                    <h4 className="text-xs font-medium mb-1">Top Affected Modules:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {data.uiChanges.modules.map(module => (
                                            <Badge key={module} variant="outline" className="bg-white">
                                                {module}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-4 border rounded-md">
                            <h3 className="text-sm font-medium mb-1 flex items-center">
                                <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                                Impact Analysis:
                            </h3>
                            <p className="text-sm">{data.impact || "Test failures are primarily driven by code bugs rather than UI changes, suggesting focus should be on code stability."}</p>
                            <div className="flex justify-end mt-4">
                                <Button variant="outline" size="sm">
                                    View Detailed Report
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Main Component
export function TestInsightsDashboard({ projectId = "project-123" }) {
    const [testInsights, setTestInsights] = useState<TestInsightsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [filterPriority, setFilterPriority] = useState<string[]>([]);

    // Fetch insights data on component mount
    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            try {
                // In a real implementation, this would call the API
                // const response = await apiRequest<{ success: boolean, data: TestInsightsData }>(
                //     API_ENDPOINTS.insights.getTestInsights(projectId),
                //     { method: "GET" }
                // );

                // Mock data loading with a timeout
                setTimeout(() => {
                    setTestInsights(mockTestInsights);
                    setLoading(false);
                }, 500);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch insights');
                setLoading(false);
            }
        };

        fetchInsights();
    }, [projectId]);

    // Filter insights by priority
    const filteredInsights = testInsights?.insightCards.filter(
        card => filterPriority.length === 0 || filterPriority.includes(card.priority)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <Loader />
                    <span className="mt-4 block text-gray-600">Loading test insights...</span>
                </div>
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

    if (!testInsights) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No insights available</h3>
                    <p className="text-gray-600 text-center">There are no test insights available for this project.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="flex justify-end items-center">
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center">
                                <Filter className="h-4 w-4 mr-1" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuCheckboxItem
                                checked={filterPriority.includes('High')}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setFilterPriority([...filterPriority, 'High']);
                                    } else {
                                        setFilterPriority(filterPriority.filter(p => p !== 'High'));
                                    }
                                }}
                            >
                                High Priority
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={filterPriority.includes('Medium')}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setFilterPriority([...filterPriority, 'Medium']);
                                    } else {
                                        setFilterPriority(filterPriority.filter(p => p !== 'Medium'));
                                    }
                                }}
                            >
                                Medium Priority
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={filterPriority.includes('Low')}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setFilterPriority([...filterPriority, 'Low']);
                                    } else {
                                        setFilterPriority(filterPriority.filter(p => p !== 'Low'));
                                    }
                                }}
                            >
                                Low Priority
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm">
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Dashboard Summary */}
            <DashboardSummary data={testInsights} />

            <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-6 w-full justify-start">
                    <TabsTrigger value="overview" className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="failures" className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Failures
                    </TabsTrigger>
                    <TabsTrigger value="flakiness" className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Flakiness
                    </TabsTrigger>
                    <TabsTrigger value="ranking" className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Ranking
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredInsights?.map(insight => (
                                <TestInsightCard key={insight.title} insight={insight} />
                            ))}
                        </div>
                        <BugsVsUIChangesSection data={testInsights.bugsVsUIChanges} />
                    </div>
                </TabsContent>

                <TabsContent value="failures" className="mt-4">
                    <div className="space-y-6">
                        <TopFailuresSection failures={testInsights.topFailures} />
                        <CriticalFailuresSection failures={testInsights.criticalFailures} />
                    </div>
                </TabsContent>

                <TabsContent value="flakiness" className="mt-4">
                    <FlakyTestsSection flakyTests={testInsights.flakyTests} />
                </TabsContent>

                <TabsContent value="ranking" className="mt-4">
                    <RankingSystemSection ranking={testInsights.rankingSystem} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default TestInsightsDashboard;