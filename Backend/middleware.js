const jwt = require("jsonwebtoken");
const supabase = require("./db");

// Send standard API error response
function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message,
  });
}

// Handle errors from asynchronous route handlers
function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Verify user authentication using JWT
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    // Check Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Authentication required");
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return sendError(res, 401, "Invalid authentication token");
    }

    // Verify JWT
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return sendError(res, 401, "Invalid or expired token");
    }

    // Validate token claims
    if (
      !decoded.sub ||
      !decoded.jti ||
      !["patient", "admin"].includes(decoded.role)
    ) {
      return sendError(res, 401, "Invalid authentication token");
    }

    // Check whether the token has been revoked
    const { data: revokedToken, error: revokedError } = await supabase
      .from("revoked_tokens")
      .select("jti")
      .eq("jti", decoded.jti)
      .maybeSingle();

    if (revokedError) {
      return sendError(res, 500, "Authentication verification failed");
    }

    if (revokedToken) {
      return sendError(res, 401, "Session has expired. Please login again.");
    }

    // Get the latest user information from database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", decoded.sub)
      .maybeSingle();

    if (userError) {
      return sendError(res, 500, "Authentication verification failed");
    }

    if (!user) {
      return sendError(res, 401, "User account not found");
    }

    // Verify current database role
    if (user.role !== decoded.role) {
      return sendError(res, 401, "Invalid authentication role");
    }

    // Attach authenticated user information to request
    req.auth = {
      userId: user.id,
      role: user.role,
      email: decoded.email,
      jti: decoded.jti,
    };

    next();
  } catch (error) {
    next(error);
  }
}

// Check whether authenticated user has the required role
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.auth) {
      return sendError(res, 401, "Authentication required");
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return sendError(res, 403, "Access denied");
    }

    next();
  };
}

// Export middleware functions
module.exports = {
  sendError,
  asyncRoute,
  requireAuth,
  requireRole,
};