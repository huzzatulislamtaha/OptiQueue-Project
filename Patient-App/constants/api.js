
// ========================================
// OptiQueue Backend API Configuration
// ========================================

// Backend Base URL
// This local IP works only when the device
// and computer are connected to the same network.
//
// For public access from any device, replace this
// with your deployed HTTPS backend URL.

export const API_BASE_URL = "http://192.168.0.213:5000/api";

// ========================================
// API Endpoints
// ========================================

export const API_ENDPOINTS = {

  // Authentication
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  LOGOUT: "/auth/logout",

  // Services and Live Queue
  SERVICES: "/services",
  LIVE_QUEUE: "/queue/live",

  // Token Management
  CREATE_TOKEN: "/tokens",
  MY_TOKENS: "/tokens/my",

  // Notifications
  NOTIFICATIONS: "/notifications",

};
