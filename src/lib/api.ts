export const API_ENDPOINTS = {
    projects: {
        list: '/projects',
        create: '/projects',
        get: (id: string) => `/projects/${id}`,
        update: (id: string) => `/projects/${id}`,
        delete: (id: string) => `/projects/${id}`,
    },
    users: {
        list: '/users',
        create: '/users',
        get: (id: string) => `/users/${id}`,
        update: (id: string) => `/users/${id}`,
        delete: (id: string) => `/users/${id}`,
    },
    reports: {
        list: '/reports',
        create: '/reports',
        get: (id: string) => `/reports/${id}`,
        update: (id: string) => `/reports/${id}`,
        delete: (id: string) => `/reports/${id}`,
    },
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        resetPassword: '/auth/reset-password',
        verifyEmail: '/auth/verify-email',
    },
    settings: {
        get: '/settings',
        update: '/settings',
    },
    profile: {
        update: '/profile',
        uploadAvatar: '/profile/avatar',
    },
    notifications: {
        get: '/notifications',
        update: '/notifications',
    },
    apiKeys: {
        list: '/api-keys',
        create: '/api-keys',
        get: (id: string) => `/api-keys/${id}`,
        revoke: (apiKeyId: string) => `/api-keys/${apiKeyId}/revoke`,
        rotate: (id: string) => `/api-keys/${id}/rotate`,
        getByProject: (projectId: string) => `/api-keys?projectId=${projectId}`,
    },
}