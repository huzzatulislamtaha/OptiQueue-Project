
// API base URL for OptiQueue Backend
export const API_BASE_URL = "http://192.168.0.213:5000/api";

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",

  // Services and Live Queue
  SERVICES: "/services",
  LIVE_QUEUE: "/queue/live",

  // Token Management
  CREATE_TOKEN: "/tokens",
  MY_TOKENS: "/tokens/my",

  // Notifications
  NOTIFICATIONS: "/notifications",
};
