export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  endpoints: {
    prices: '/api/prices',
  },
} as const; 