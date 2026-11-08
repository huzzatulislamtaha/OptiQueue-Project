
const cors = require("cors");

// Default frontend origins
const defaultOrigins = [
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:8083",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:8082",
  "http://127.0.0.1:8083",
];

// Read additional origins from .env
const envOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((item) => item.trim())
  .filter((item) => item && item !== "*");

// Combine allowed origins
const allowedOrigins = [
  ...new Set([...defaultOrigins, ...envOrigins]),
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow mobile apps and requests without Origin
    if (!origin) {
      return callback(null, true);
    }

    // Check allowed frontend origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("Blocked CORS origin:", origin);

    return callback(new Error("Origin not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// Export CORS middleware
module.exports = cors(corsOptions);
