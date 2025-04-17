import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { memo } from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

// Dashboard metrics data
const dashboardData = {
    totalTests: {
        count: 2347,
        change: '+4%',
        comparedTo: 'last week'
    },
    passedTests: {
        count: 2225,
        percentage: 94.8,
        change: '+1.2%',
        comparedTo: 'last week'
    },
    failedTests: {
        count: 112,
        percentage: 5.2,
        change: '+18%',
        comparedTo: 'last week'
    },
    totalDuration: {
        time: '2h 14m',
        change: '+25m',
        comparedTo: 'last week'
    }
};

const failureCategories = [
    {
        type: 'Flaky Tests',
        testCount: 47,
        percentage: 38.5,
        change: '+4%',
        comparedTo: 'last week',
        avgPassRate: '67%',
        mostAffected: 'Checkout',
        resolutionTime: '4.2 Days',
        priority: 'Medium'
    },
    {
        type: 'Actual Bugs',
        testCount: 58,
        percentage: 38.5,
        change: '+4%',
        comparedTo: 'last week',
        critical: '12 tests',
        mostAffected: 'Payment',
        avgFixTime: '2.8 Days',
        priority: 'High'
    },
    {
        type: 'UI Changes',
        testCount: 17,
        percentage: 38.5,
        change: '+4%',
        comparedTo: 'last week',
        selectors: '67%',
        mostAffected: 'Profile',
        resolutionTime: '1.2 Days',
        priority: 'Low'
    }
];

const aiInsights = [
    {
        issue: 'Payment Gateway Integration Failure Pattern',
        priority: 'High Priority',
        icon: 'alert'
    },
    {
        issue: 'Rising Test Flakiness in Profile Module',
        priority: 'Medium Priority',
        icon: 'trend'
    },
    {
        issue: 'Payment Gateway Integration Failure Pattern',
        priority: 'Low Priority',
        icon: 'alert'
    },
    {
        issue: 'Rising Test Flakiness in Profile Module',
        priority: 'Medium Priority',
        icon: 'trend'
    }
];

const crossEnvironmentData = {
    passRate: [
        { env: 'Development', rate: 96.8 },
        { env: 'Staging', rate: 94.8 },
        { env: 'Production', rate: 80.8 }
    ],
    responseTime: [
        { env: 'Development', time: '1.2s' },
        { env: 'Staging', time: '1.8s' },
        { env: 'Production', time: '0.8s' }
    ],
    flakyTestPercentage: [
        { env: 'Development', percentage: 8.2 },
        { env: 'Staging', percentage: 12.8 },
        { env: 'Production', percentage: 3.8 }
    ],
    executionTime: [
        { env: 'Development', time: '1h 48m' },
        { env: 'Staging', time: '2h 14m' },
        { env: 'Production', time: '1h 36m' }
    ]
};

const events = [
    { id: 1, event: 'Member Race Challenge - GT', date: '13 Aug 2024 to 15 Aug 2024', time: '09:30 to 14:00' },
    { id: 2, event: 'Exchange Benefits', date: '13 Aug 2024 to 15 Aug 2024', time: '09:30 to 14:00' }
];

// Chart data
const metricsChartData = [
    { date: '1', value: 5 },
    { date: '2', value: 7 },
    { date: '3', value: 4 },
    { date: '4', value: 8 },
    { date: '5', value: 6 },
    { date: '6', value: 9 },
    { date: '7', value: 7 }
];

// Component interfaces
interface MetricCardProps {
    title: string;
    value: string | number;
    change: string;
    percentage?: number;
    color: string;
    comparedTo: string;
}

interface FailureCategoryProps {
    category: {
        type: string;
        testCount: number;
        percentage: number;
        change: string;
        comparedTo: string;
        avgPassRate?: string;
        mostAffected: string;
        resolutionTime?: string;
        priority: string;
        critical?: string;
        avgFixTime?: string;
        selectors?: string;
    };
}

interface EnvMetricItemProps {
    item: {
        env: string;
        rate?: number;
        time?: string;
        percentage?: number;
    };
    label: string;
    getBarColor: (item: {
        env: string;
        rate?: number;
        time?: string;
        percentage?: number;
    }) => string;
    getBarWidth: (item: {
        env: string;
        rate?: number;
        time?: string;
        percentage?: number;
    }) => string;
}

const MetricCard = memo<MetricCardProps>(({ title, value, change, percentage, color, comparedTo }) => (
    <Card>
        <CardContent className="p-3">
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{title}</p>
                <div className="flex items-baseline justify-between">
                    <h3 className="text-3xl font-bold">{value}</h3>
                    {percentage && (
                        <span className={`flex items-center text-xs ${color}`}>
                            ({percentage}%)
                        </span>
                    )}
                </div>
                <div className={`flex items-center text-sm ${color}`}>
                    <TrendingUp className="mr-1 h-4 w-4" />
                    {change}
                </div>
                <div className="h-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metricsChartData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={color === "text-red-500" ? "#EF4444" : "#10B981"}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground">compared to {comparedTo}</p>
            </div>
        </CardContent>
    </Card>
));
MetricCard.displayName = 'MetricCard';

const FailureCategoryCard = memo<FailureCategoryProps>(({ category }) => (
    <Card className="border border-gray-200">
        <CardContent className="p-4">
            <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium">{category.type}</h4>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        {category.testCount} Tests
                    </Badge>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-2xl font-semibold">{category.percentage}%</p>
                        <p className="text-xs text-green-500">
                            {category.change} from {category.comparedTo}
                        </p>
                    </div>
                </div>

                {/* Category specific metrics */}
                <div className="space-y-1 text-sm">
                    {category.type === 'Flaky Tests' && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Pass Rate</span>
                                <span>{category.avgPassRate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Most Affected</span>
                                <span>{category.mostAffected}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Resolution Time</span>
                                <span>{category.resolutionTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Priority</span>
                                <span>{category.priority}</span>
                            </div>
                        </>
                    )}

                    {category.type === 'Actual Bugs' && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Critical</span>
                                <span>{category.critical}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Most Affected</span>
                                <span>{category.mostAffected}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Fix Time</span>
                                <span>{category.avgFixTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Priority</span>
                                <span>{category.priority}</span>
                            </div>
                        </>
                    )}

                    {category.type === 'UI Changes' && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Selectors</span>
                                <span>{category.selectors}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Most Affected</span>
                                <span>{category.mostAffected}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Resolution Time</span>
                                <span>{category.resolutionTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Priority</span>
                                <span>{category.priority}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
));
FailureCategoryCard.displayName = 'FailureCategoryCard';

const EnvMetricItem = memo<EnvMetricItemProps>(({ item, label, getBarColor, getBarWidth }) => (
    <div className="flex flex-col">
        <div className="flex justify-between items-center">
            <span className="text-sm">{item.env}</span>
            <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
            <div
                className={`h-2 rounded-full ${getBarColor(item)}`}
                style={{ width: getBarWidth(item) }}
            ></div>
        </div>
    </div>
));
EnvMetricItem.displayName = 'EnvMetricItem';

const Overview = () => {
    return (
        <div className="space-y-6 p-4">
            {/* Top metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Tests"
                    value={dashboardData.totalTests.count}
                    change={dashboardData.totalTests.change}
                    color="text-green-500"
                    comparedTo={dashboardData.totalTests.comparedTo}
                />
                <MetricCard
                    title="Passed Tests"
                    value={dashboardData.passedTests.count}
                    percentage={dashboardData.passedTests.percentage}
                    change={dashboardData.passedTests.change}
                    color="text-green-500"
                    comparedTo={dashboardData.passedTests.comparedTo}
                />
                <MetricCard
                    title="Failed Tests"
                    value={dashboardData.failedTests.count}
                    percentage={dashboardData.failedTests.percentage}
                    change={dashboardData.failedTests.change}
                    color="text-red-500"
                    comparedTo={dashboardData.failedTests.comparedTo}
                />
                <MetricCard
                    title="Total duration"
                    value={dashboardData.totalDuration.time}
                    change={dashboardData.totalDuration.change}
                    color="text-green-500"
                    comparedTo={dashboardData.totalDuration.comparedTo}
                />
            </div>

            {/* Test Failure Categories and AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Test Failure Categories */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Test Failure Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {failureCategories.map((category, index) => (
                                <FailureCategoryCard key={index} category={category} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Insights */}
                <Card>
                    <CardHeader className="pb-2 flex justify-between">
                        <CardTitle>
                            <div className="flex items-center">
                                <span className="text-purple-500 mr-1">•</span>
                                AI Insights
                            </div>
                        </CardTitle>
                        <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
                            See all
                        </a>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {aiInsights.map((insight, index) => (
                                <div key={index} className="flex items-start gap-2 pb-3 border-b last:border-0 last:pb-0">
                                    {insight.icon === 'alert' ? (
                                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                    ) : (
                                        <Zap className="h-5 w-5 text-amber-500 mt-0.5" />
                                    )}
                                    <div>
                                        <p className="font-medium">{insight.issue}</p>
                                        <p className={`text-sm ${insight.priority.includes('High')
                                            ? 'text-red-500'
                                            : insight.priority.includes('Medium')
                                                ? 'text-amber-500'
                                                : 'text-green-500'
                                            }`}>
                                            {insight.priority}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cross-Environment Test Performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Cross-Environment Test Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                        <div className="space-y-4">
                            <h4 className="font-medium text-center">Pass Rate</h4>
                            {crossEnvironmentData.passRate.map((item, index) => (
                                <EnvMetricItem
                                    key={index}
                                    item={item}
                                    label={`${item.rate}%`}
                                    getBarColor={() => "bg-green-500"}
                                    getBarWidth={(item) => `${item.rate}%`}
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-medium text-center">Response Time</h4>
                            {crossEnvironmentData.responseTime.map((item, index) => (
                                <EnvMetricItem
                                    key={index}
                                    item={item}
                                    label={item.time}
                                    getBarColor={(item) => item.env === 'Development' ? 'bg-green-500' :
                                        item.env === 'Staging' ? 'bg-amber-500' : 'bg-red-500'}
                                    getBarWidth={(item) => item.env === 'Development' ? '40%' :
                                        item.env === 'Staging' ? '60%' : '20%'}
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-medium text-center">Flaky Test %</h4>
                            {crossEnvironmentData.flakyTestPercentage.map((item, index) => (
                                <EnvMetricItem
                                    key={index}
                                    item={item}
                                    label={`${item.percentage}%`}
                                    getBarColor={(item) => item.percentage ? (item.percentage < 5 ? 'bg-green-500' :
                                        item.percentage < 10 ? 'bg-amber-500' : 'bg-red-500') : 'bg-gray-500'}
                                    getBarWidth={(item) => item.percentage ? `${item.percentage * 3}%` : '0%'}
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-medium text-center">Execution Time</h4>
                            {crossEnvironmentData.executionTime.map((item, index) => (
                                <EnvMetricItem
                                    key={index}
                                    item={item}
                                    label={item.time}
                                    getBarColor={(item) => item.env === 'Development' ? 'bg-green-500' :
                                        item.env === 'Staging' ? 'bg-amber-500' : 'bg-red-500'}
                                    getBarWidth={(item) => item.env === 'Development' ? '70%' :
                                        item.env === 'Staging' ? '90%' : '65%'}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <Tabs defaultValue="overview">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="test-suite">Test suite</TabsTrigger>
                                <TabsTrigger value="feature">Feature</TabsTrigger>
                                <TabsTrigger value="module">Module</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            {/* Events Table */}
            <Card>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4 font-medium text-sm">ID</th>
                                <th className="text-left p-4 font-medium text-sm">Event</th>
                                <th className="text-left p-4 font-medium text-sm">Date</th>
                                <th className="text-left p-4 font-medium text-sm">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className="border-b last:border-0">
                                    <td className="p-4">{event.id}</td>
                                    <td className="p-4">{event.event}</td>
                                    <td className="p-4">{event.date}</td>
                                    <td className="p-4">{event.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Overview;
