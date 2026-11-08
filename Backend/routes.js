
const express = require("express");

const router = express.Router();

const {
  requireAuth,
  requireRole,
} = require("./middleware");

const controllers = require("./controllers");

// ========================================
// Authentication Routes
// ========================================

// Register a new patient
router.post(
  "/auth/register",
  controllers.asyncRoute(controllers.register)
);

// Login
router.post(
  "/auth/login",
  controllers.asyncRoute(controllers.login)
);

// Create the initial admin account
router.post(
  "/auth/setup-admin",
  controllers.asyncRoute(controllers.setupAdmin)
);

// Get logged-in user information
router.get(
  "/auth/me",
  requireAuth,
  controllers.asyncRoute(controllers.getMe)
);

// Logout and revoke current token
router.post(
  "/auth/logout",
  requireAuth,
  controllers.asyncRoute(controllers.logout)
);

// Update patient profile
router.patch(
  "/auth/profile",
  requireAuth,
  requireRole("patient"),
  controllers.asyncRoute(controllers.updateProfile)
);


// ========================================
// Service Routes
// ========================================

// Get all available services
router.get(
  "/services",
  controllers.asyncRoute(controllers.getServices)
);

// Update service settings (Admin only)
router.patch(
  "/admin/services/:id",
  requireAuth,
  requireRole("admin"),
  controllers.asyncRoute(controllers.updateService)
);


// ========================================
// Live Queue Routes
// ========================================

// Get live queue information
router.get(
  "/queue/live",
  controllers.asyncRoute(controllers.getLiveQueue)
);


// ========================================
// Patient Token Routes
// ========================================

// Create a new token
router.post(
  "/tokens",
  requireAuth,
  requireRole("patient"),
  controllers.asyncRoute(controllers.createPatientToken)
);

// Get logged-in patient's tokens
router.get(
  "/tokens/my",
  requireAuth,
  requireRole("patient"),
  controllers.asyncRoute(controllers.getMyTokens)
);

// Cancel a patient token
router.patch(
  "/tokens/:id/cancel",
  requireAuth,
  requireRole("patient"),
  controllers.asyncRoute(controllers.cancelPatientToken)
);


// ========================================
// Admin Counter Routes
// ========================================

// Create a counter
router.post(
  "/admin/counters",
  requireAuth,
  requireRole("admin"),
  controllers.asyncRoute(controllers.createCounter)
);

// Get all counters
router.get(
  "/admin/counters",
  requireAuth,
  requireRole("admin"),
  controllers.asyncRoute(controllers.getCounters)
);

// Update a counter
router.patch(
  "/admin/counters/:id",
  requireAuth,
  requireRole("admin"),
  controllers.asyncRoute(controllers.updateCounter)
);

// Delete a counter
router.delete(
  "/admin/counters/:id",
  requireAuth,
  requireRole("admin"),
  controllers.asyncRoute(controllers.deleteCounter)
);


// ========================================
// Admin Token Management Routes
// ========================================

// Get all tokens for admin
router.get(
  "/admin/tokens",
  requireAuth,
  requireRole("admin"),
  controllers.asyncRoute(controllers.getAdminTokens)
);

// Update token status
router.patch(
  "/admin/tokens/:id/status",
  requireAuth,
  requireRole("admin"),
  controllers.asyncRoute(controllers.updateTokenStatus)
);


// ========================================
// Admin Dashboard Route
// ========================================

// Get dashboard information
router.get(
  "/admin/dashboard",
  requireAuth,
  requireRole("admin"),
  controllers.asyncRoute(controllers.getDashboard)
);


// ========================================
// Notification Routes
// ========================================

// Get logged-in user's notifications
router.get(
  "/notifications",
  requireAuth,
  controllers.asyncRoute(controllers.getNotifications)
);

// Mark a notification as read
router.patch(
  "/notifications/:id/read",
  requireAuth,
  controllers.asyncRoute(controllers.markNotificationRead)
);


// ========================================
// Export Router
// ========================================

module.exports = router;
