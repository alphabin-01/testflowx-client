import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  BarChart2,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Server,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

// Types for Salesforce environment data
interface EnvironmentCard {
  name: string;
  testsRun: number;
  passRate: number;
  flakyTests: number;
  aiScore: number;
  refreshDate: string;
  dataVolume: string;
}

interface ModuleHealth {
  module: string;
  totalTests: number;
  failures: number;
  flakyTests: number;
  confidenceScore: number;
  status: "Stable" | "Needs Monitoring" | "Unstable" | "Critical";
}

interface CrossEnvironmentIssue {
  title: string;
  description: string;
  impact: string;
  environments: string[];
}

interface AIInsight {
  title: string;
  description: string;
}

interface SummaryStats {
  environmentsMonitored: number;
  crossEnvIssues: number;
  passRate: number;
}

interface EnvironmentData {
  environmentCard: EnvironmentCard;
  moduleHealthData: ModuleHealth[];
  crossEnvironmentIssues: CrossEnvironmentIssue[];
  aiInsights: AIInsight[];
  summaryStats: SummaryStats;
}

// Mock data for production
const productionData: EnvironmentData = {
  "environmentCard": {
    "name": "Production",
    "testsRun": 3,
    "passRate": 85.15,
    "flakyTests": 2,
    "aiScore": 80,
    "refreshDate": "Last updated 2 minutes ago",
    "dataVolume": "Live Production Data"
  },
  "moduleHealthData": [
    {
      "module": "Mark all as completed",
      "totalTests": 10,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Item",
      "totalTests": 6,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Editing",
      "totalTests": 14,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Counter",
      "totalTests": 2,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Clear completed button",
      "totalTests": 6,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Persistence",
      "totalTests": 2,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Routing",
      "totalTests": 10,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "example.spec.js",
      "totalTests": 7,
      "failures": 3,
      "flakyTests": 2,
      "confidenceScore": 97,
      "status": "Stable"
    }
  ],
  "crossEnvironmentIssues": [],
  "aiInsights": [
    {
      "title": "Performance Improvements",
      "description": "Pass rate has improved significantly, with fewer flaky tests."
    },
    {
      "title": "CI Pipeline Impact",
      "description": "Recent CI improvements have led to higher test consistency."
    }
  ],
  "summaryStats": {
    "environmentsMonitored": 1,
    "crossEnvIssues": 0,
    "passRate": 85.15
  }
}

// Mock data for sandbox
const sandboxData: EnvironmentData = {
  "environmentCard": {
    "name": "Sandbox",
    "testsRun": 3,
    "passRate": 85.15,
    "flakyTests": 2,
    "aiScore": 68,
    "refreshDate": "Last updated 6 days ago",
    "dataVolume": "Full Production Copy"
  },
  "moduleHealthData": [
    {
      "module": "Mark all as completed",
      "totalTests": 10,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Item",
      "totalTests": 6,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Editing",
      "totalTests": 14,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Counter",
      "totalTests": 2,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Clear completed button",
      "totalTests": 6,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Persistence",
      "totalTests": 2,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "Routing",
      "totalTests": 10,
      "failures": 0,
      "flakyTests": 0,
      "confidenceScore": 100,
      "status": "Stable"
    },
    {
      "module": "example.spec.js",
      "totalTests": 7,
      "failures": 3,
      "flakyTests": 2,
      "confidenceScore": 97,
      "status": "Stable"
    }
  ],
  "crossEnvironmentIssues": [
    {
      "title": "API Changes Between Production and Sandbox",
      "description": "Detected configuration differences impacting test results across environments.",
      "impact": "High",
      "environments": ["Sandbox"]
    },
    {
      "title": "Database Query Issues in Sandbox",
      "description": "Database issues are more frequent in Sandbox, affecting test execution times.",
      "impact": "Medium",
      "environments": ["Sandbox"]
    }
  ],
  "aiInsights": [
    {
      "title": "Flaky Tests in Checkout Process",
      "description": "Flaky tests are prominent in the Checkout Process module."
    },
    {
      "title": "AI detected missing credentials in Payment Gateway",
      "description": "The Payment Gateway tests are unstable in Sandbox due to missing API credentials."
    }
  ],
  "summaryStats": {
    "environmentsMonitored": 1,
    "crossEnvIssues": 2,
    "passRate": 85.15
  }
}

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case "Stable":
      return "default";
    case "Needs Monitoring":
      return "secondary";
    case "Unstable":
      return "outline";
    case "Critical":
      return "destructive";
    default:
      return "outline";
  }
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "Stable":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Needs Monitoring":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case "Unstable":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case "Critical":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

// Helper function to get impact badge variant
const getImpactBadgeVariant = (impact: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (impact) {
    case "High":
      return "destructive";
    case "Medium":
      return "secondary";
    case "Low":
      return "outline";
    case "Critical":
      return "destructive";
    default:
      return "outline";
  }
};

// Environment Card Component
const EnvironmentOverviewCard = ({ data }: { data: EnvironmentCard }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Server className="h-5 w-5 mr-2 text-blue-500" />
            {data.name} Environment
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {data.aiScore}/100 AI Health Score
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Tests Run</span>
              <Database className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{data.testsRun}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Pass Rate</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{data.passRate}%</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Flaky Tests</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold">{data.flakyTests}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Last Refresh</span>
              <Calendar className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-sm font-semibold mt-1">{data.refreshDate}</p>
          </div>
        </div>

        <div className="text-sm text-gray-600 flex items-center mt-2">
          <Database className="h-4 w-4 mr-1" />
          <span>Data Volume: <span className="font-medium">{data.dataVolume}</span></span>
        </div>
      </CardContent>
    </Card>
  );
};

// Module Health Table Component
const ModuleHealthTable = ({ modules }: { modules: ModuleHealth[] }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
          Module Health
        </CardTitle>
        <CardDescription>
          Test stability across Salesforce modules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Tests</TableHead>
              <TableHead>Failures</TableHead>
              <TableHead>Flaky</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{module.module}</TableCell>
                <TableCell>{module.totalTests}</TableCell>
                <TableCell>
                  {module.failures > 0 ? (
                    <span className="text-red-500 font-medium">{module.failures}</span>
                  ) : (
                    module.failures
                  )}
                </TableCell>
                <TableCell>
                  {module.flakyTests > 0 ? (
                    <span className="text-amber-500 font-medium">{module.flakyTests}</span>
                  ) : (
                    module.flakyTests
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={module.confidenceScore}
                      className={cn(
                        "h-2 w-16",
                        module.confidenceScore >= 90 ? "[&>div]:bg-green-500" :
                          module.confidenceScore >= 75 ? "[&>div]:bg-blue-500" :
                            module.confidenceScore >= 60 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"
                      )}
                    />
                    <span className="text-sm">{module.confidenceScore}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(module.status)}
                    className="flex items-center gap-1"
                  >
                    {getStatusIcon(module.status)}
                    {module.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Module Health Chart
const ModuleHealthChart = ({ modules }: { modules: ModuleHealth[] }) => {
  // Prepare data for charts
  const confidenceData = modules.map(module => ({
    name: module.module.length > 15 ? module.module.substring(0, 15) + "..." : module.module,
    score: module.confidenceScore,
    failures: module.failures,
    flakyTests: module.flakyTests,
    status: module.status
  }));

  const statusData = [
    { name: "Stable", value: modules.filter(m => m.status === "Stable").length },
    { name: "Needs Monitoring", value: modules.filter(m => m.status === "Needs Monitoring").length },
    { name: "Unstable", value: modules.filter(m => m.status === "Unstable").length },
    { name: "Critical", value: modules.filter(m => m.status === "Critical").length }
  ].filter(item => item.value > 0);

  const COLORS = ["#10b981", "#f59e0b", "#f97316", "#ef4444"];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
          Module Health Visualization
        </CardTitle>
        <CardDescription>
          Visual representation of test health across modules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Confidence Score by Module</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={confidenceData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    formatter={(value: any, name: any) => [`${value}%`, 'Confidence Score']}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border shadow-sm text-sm">
                            <p className="font-medium">{data.name}</p>
                            <p>Confidence: <span className="font-medium">{data.score}%</span></p>
                            <p>Failures: <span className="font-medium">{data.failures}</span></p>
                            <p>Flaky Tests: <span className="font-medium">{data.flakyTests}</span></p>
                            <p>Status: <span className="font-medium">{data.status}</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[0, 4, 4, 0]}
                  >
                    {confidenceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.score >= 90 ? "#10b981" :
                            entry.score >= 75 ? "#3b82f6" :
                              entry.score >= 60 ? "#f59e0b" :
                                "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Module Status Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip formatter={(value: any) => [value, 'Modules']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {statusData.map((status, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm">{status.name}: {status.value} modules</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Cross Environment Issues Component
const CrossEnvironmentIssues = ({ issues }: { issues: CrossEnvironmentIssue[] }) => {
  if (issues.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Server className="h-5 w-5 mr-2 text-blue-500" />
            Cross-Environment Issues
          </CardTitle>
          <CardDescription>
            Issues that appear differently across environments
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <p className="text-lg font-medium text-gray-700">No Cross-Environment Issues</p>
          <p className="text-sm text-gray-500">All tests are behaving consistently across environments</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Server className="h-5 w-5 mr-2 text-blue-500" />
          Cross-Environment Issues
        </CardTitle>
        <CardDescription>
          Issues that appear differently across environments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div key={index} className="p-4 border rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{issue.title}</h3>
                <Badge variant={getImpactBadgeVariant(issue.impact)}>
                  {issue.impact} Impact
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Affected:</span>
                {issue.environments.map((env, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {env}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// AI Insights Component
const AIInsights = ({ insights }: { insights: AIInsight[] }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-500" />
          AI Insights
        </CardTitle>
        <CardDescription>
          AI-generated insights to help improve test quality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 border-l-4 border-purple-400 bg-purple-50 rounded-md">
              <h3 className="font-medium flex items-center mb-1">
                <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                {insight.title}
              </h3>
              <p className="text-sm text-gray-700">{insight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Summary Stats Component
const SummaryStats = ({ stats }: { stats: SummaryStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-600">Environments</p>
              <p className="text-2xl font-bold">{stats.environmentsMonitored}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Server className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={stats.crossEnvIssues > 0 ? "bg-amber-50" : "bg-green-50"}>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Cross-Env Issues</p>
              <p className="text-2xl font-bold">{stats.crossEnvIssues}</p>
            </div>
            <div className={`${stats.crossEnvIssues > 0 ? "bg-amber-100" : "bg-green-100"} p-3 rounded-full`}>
              {stats.crossEnvIssues > 0 ? (
                <AlertCircle className="h-6 w-6 text-amber-500" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={stats.passRate >= 95 ? "bg-green-50" : stats.passRate >= 80 ? "bg-amber-50" : "bg-red-50"}>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Pass Rate</p>
              <p className="text-2xl font-bold">{stats.passRate}%</p>
            </div>
            <div className={`
              ${stats.passRate >= 95 ? "bg-green-100" :
                stats.passRate >= 80 ? "bg-amber-100" : "bg-red-100"} 
              p-3 rounded-full
            `}>
              {stats.passRate >= 95 ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : stats.passRate >= 80 ? (
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Component
export function SalesforceEnvironmentInsights() {
  const [activeEnvironment, setActiveEnvironment] = useState<"production" | "sandbox">("production");
  const currentData = activeEnvironment === "production" ? productionData : sandboxData;

  return (
    <div className="">
      {/* Environment Selector */}
      <Tabs value={activeEnvironment} className="w-full" onValueChange={(value) => setActiveEnvironment(value as "production" | "sandbox")}>
        <TabsList className="mb-6 w-full max-w-md">
          <TabsTrigger value="production" className="flex-1">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span>Production</span>
              <Badge variant="default" className="ml-1 bg-green-500">
                {productionData.environmentCard.passRate}%
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="sandbox" className="flex-1">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span>Sandbox</span>
              <Badge variant={sandboxData.environmentCard.passRate >= 90 ? "default" : "secondary"}
                className={`ml-1 ${sandboxData.environmentCard.passRate >= 90 ? "bg-green-500" : "bg-amber-500"}`}>
                {sandboxData.environmentCard.passRate}%
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="production">
          <SummaryStats stats={productionData.summaryStats} />
          <EnvironmentOverviewCard data={productionData.environmentCard} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ModuleHealthTable modules={productionData.moduleHealthData} />
            </div>
            <div>
              <AIInsights insights={productionData.aiInsights} />
            </div>
          </div>
          <ModuleHealthChart modules={productionData.moduleHealthData} />
          <CrossEnvironmentIssues issues={productionData.crossEnvironmentIssues} />
        </TabsContent>

        <TabsContent value="sandbox">
          <SummaryStats stats={sandboxData.summaryStats} />
          <EnvironmentOverviewCard data={sandboxData.environmentCard} />
          <div className="grid grid-cols-1 gap-6">
            <ModuleHealthTable modules={sandboxData.moduleHealthData} />
            <ModuleHealthChart modules={sandboxData.moduleHealthData} />
            <CrossEnvironmentIssues issues={sandboxData.crossEnvironmentIssues} />
            <AIInsights insights={sandboxData.aiInsights} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SalesforceEnvironmentInsights;