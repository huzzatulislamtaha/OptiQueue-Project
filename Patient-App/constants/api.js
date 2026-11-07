// OptiQueue Backend API Configuration

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.213:5000/api";

export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  LOGOUT: "/auth/logout",
  SERVICES: "/services",
  LIVE_QUEUE: "/queue/live",
  CREATE_TOKEN: "/tokens",
  MY_TOKENS: "/tokens/my",
  NOTIFICATIONS: "/notifications",
};