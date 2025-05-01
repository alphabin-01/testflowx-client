export const API_ENDPOINTS = {
    projects: {
        list: '/projects',
        create: '/projects',
        get: (id: string) => `/projects/${id}`,
        update: (id: string) => `/projects/${id}`,
        delete: (id: string) => `/projects/${id}`,
    },
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        resetPassword: '/auth/reset-password',
        verifyEmail: '/auth/verify-email',
    },
    apiKeys: {
        list: '/api-keys',
        create: '/api-keys',
        get: (id: string) => `/api-keys/${id}`,
        revoke: (apiKeyId: string) => `/api-keys/${apiKeyId}/revoke`,
        rotate: (id: string) => `/api-keys/${id}/rotate`,
        getByProject: (projectId: string) => `/api-keys?projectId=${projectId}`,
    },
    testMetrics: {
        getMetricsById: (projectId: string, timeframe: 'weekly' | 'monthly' | 'yearly' = 'daily') => `/projects/${projectId}/metrics?timeframe=${timeframe}&page=1&limit=10`,
    },
    testSuites: {
        getTestRunById: (testRunId: string) => `test-suites?testRun=${testRunId}`,
    },
    testCases: {
        getTestcaseDetails: (testCaseId: string) => `/test-cases/${testCaseId}`,
        getTestCasesBySuiteId: (suiteId: string) => `/test-cases?testSuite=${suiteId}`,
    },
    testRuns: {
        getTestRunById: (testRunId: string) => `/test-runs/${testRunId}`,
        getByProjectId: (projectId: string) => `/projects/${projectId}/test-runs`,
    },
    insights: {
        getByProjectId: (projectId: string) => `/projects/${projectId}/insights`,
        getInsightDetails: (insightId: string) => `/insights/${insightId}`,
        updateInsightStatus: (insightId: string) => `/insights/${insightId}/status`,
    }
}