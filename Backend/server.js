
// ========================================
// OptiQueue Backend Server
// ========================================

// Load environment variables first
require("dotenv").config();

// Import required packages
const express = require("express");

// Import project modules
const corsMiddleware = require("./cors");
const routes = require("./routes");

// Create Express application
const app = express();

// Server port
const PORT = process.env.PORT || 5000;


// ========================================
// Environment Validation
// ========================================

// JWT secret is required for authentication
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env file");
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}


// ========================================
// Middleware Configuration
// ========================================

// Enable CORS
app.use(corsMiddleware);

// Parse JSON request bodies
app.use(express.json({ limit: "1mb" }));

// Basic security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");

  next();
});


// ========================================
// Basic Server Routes
// ========================================

// Backend home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "OptiQueue Backend is running",
    version: "1.0.0",
  });
});

// Backend health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    message: "OptiQueue Backend is healthy",
  });
});


// ========================================
// API Routes
// ========================================

// Connect all API endpoints
app.use("/api", routes);


// ========================================
// 404 Handler
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});


// ========================================
// Global Error Handler
// ========================================

app.use((error, req, res, next) => {
  console.error("Backend Error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.status || 500).json({
    success: false,
    message:
      error.status && error.status < 500
        ? error.message
        : "Internal server error",
  });
});


// ========================================
// Start Backend Server
// ========================================

app.listen(PORT, () => {
  console.log("-----------------------------------");
  console.log("OptiQueue Backend Started");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log("-----------------------------------");
});
