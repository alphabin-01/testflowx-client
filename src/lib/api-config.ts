/**
 * Environment configuration for API endpoints
 */

// Environment variables
const ENV = {
    DEV: 'development',
    STAGING: 'staging',
    PROD: 'production'
};

// Current environment (can be set from .env file or any other source)
// Default to development for safety
const CURRENT_ENV = process.env.NEXT_PUBLIC_API_ENV || ENV.DEV;

// Base API URLs for different environments
const API_URLS = {
    [ENV.DEV]: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    [ENV.STAGING]: process.env.NEXT_PUBLIC_STAGING_API_URL || 'https://staging-api.example.com/api',
    [ENV.PROD]: process.env.NEXT_PUBLIC_PROD_API_URL || 'https://api.example.com/api'
};

const getBaseUrl = () => API_URLS[CURRENT_ENV];

const getApiUrl = (endpoint: string) => {
    const baseUrl = getBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${baseUrl}/${cleanEndpoint}`;
};

// Default API request timeout in milliseconds
const DEFAULT_TIMEOUT = 30000;

export {
    ENV,
    CURRENT_ENV,
    getBaseUrl,
    getApiUrl,
    DEFAULT_TIMEOUT
};