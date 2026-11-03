
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET;

// Check JWT secret before starting the server
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET must be set in Backend/.env and contain at least 32 characters."
  );
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((item) => item.trim())
    : true,
}));

app.use(express.json({ limit: "1mb" }));

// Send error response
function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message,
  });
}

// Handle async route errors
function asyncRoute(handler) {
  return (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);
}

// Create JWT token
function createToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

// Authentication middleware
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : null;

  if (!token) {
    return sendError(res, 401, "Authentication token is required.");
  }

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return sendError(res, 401, "Invalid or expired authentication token.");
  }
}

// Role checking middleware
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return sendError(
        res,
        403,
        "You do not have permission to perform this action."
      );
    }

    return next();
  };
}

// Normalize email
function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

// Validate password
function validPassword(value) {
  return typeof value === "string" && value.length >= 8;
}

// Root route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "OptiQueue Backend is running",
    version: "1.0.0",
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "OK",
    message: "OptiQueue API is healthy",
    timestamp: new Date().toISOString(),
  });
});

/* ------------------------- AUTH ------------------------- */

// Patient registration
app.post("/api/auth/register", asyncRoute(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (!name || !email || !validPassword(password)) {
    return sendError(
      res,
      400,
      "Name, valid email and password (minimum 8 characters) are required."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password_hash: passwordHash,
      role: "patient",
    })
    .select("id, name, email, mobile_number, role, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return sendError(res, 409, "This email is already registered.");
    }

    throw error;
  }

  return res.status(201).json({
    success: true,
    message: "Patient account created.",
    user: data,
    token: createToken(data),
  });
}));

// User login
app.post("/api/auth/login", asyncRoute(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (!email || typeof password !== "string") {
    return sendError(res, 400, "Email and password are required.");
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, mobile_number, role, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return sendError(res, 401, "Email or password is incorrect.");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile_number: user.mobile_number,
    role: user.role,
  };

  return res.json({
    success: true,
    message: "Login successful.",
    user: safeUser,
    token: createToken(safeUser),
  });
}));

// Create first administrator
// Remove ADMIN_SETUP_KEY from .env after setup
app.post("/api/auth/setup-admin", asyncRoute(async (req, res) => {
  const setupKey = process.env.ADMIN_SETUP_KEY;

  if (!setupKey) {
    return sendError(res, 404, "Admin setup is disabled.");
  }

  if (req.body.setupKey !== setupKey) {
    return sendError(res, 403, "Invalid setup key.");
  }

  const name = String(req.body.name || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (!name || !email || !validPassword(password)) {
    return sendError(
      res,
      400,
      "Name, valid email and password (minimum 8 characters) are required."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password_hash: passwordHash,
      role: "admin",
    })
    .select("id, name, email, role, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return sendError(res, 409, "This email is already registered.");
    }

    throw error;
  }

  return res.status(201).json({
    success: true,
    message: "Administrator account created. Remove ADMIN_SETUP_KEY from .env now.",
    user: data,
  });
}));

// Get logged-in user information
app.get("/api/auth/me", requireAuth, asyncRoute(async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, mobile_number, role, created_at, updated_at")
    .eq("id", req.auth.sub)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return sendError(res, 404, "User not found.");
  }

  return res.json({
    success: true,
    user: data,
  });
}));

// Update logged-in patient's profile
app.patch(
  "/api/auth/profile",
  requireAuth,
  requireRole("patient"),
  asyncRoute(async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const mobileNumber = String(req.body.mobile_number || "").trim();

    // Validate profile information
    if (!name || !email) {
      return sendError(res, 400, "Name and email are required.");
    }

    if (name.length > 100 || email.length > 150 || mobileNumber.length > 20) {
      return sendError(res, 400, "Profile information is too long.");
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return sendError(res, 400, "Please enter a valid email address.");
    }

    // Update only the authenticated patient's record
    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        email,
        mobile_number: mobileNumber || null,
      })
      .eq("id", req.auth.sub)
      .eq("role", "patient")
      .select("id, name, email, mobile_number, role, created_at, updated_at")
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return sendError(res, 409, "This email is already registered.");
      }

      throw error;
    }

    if (!data) {
      return sendError(res, 404, "Patient account not found.");
    }

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user: data,
    });
  })
);

/* ------------------------ SERVICES ---------------------- */

// Get all active services
app.get("/api/services", asyncRoute(async (_req, res) => {
  const { data, error } = await supabase
    .from("services")
    .select("id, name, description, estimated_wait_minutes, is_active")
    .eq("is_active", true)
    .order("id");

  if (error) throw error;

  return res.json({
    success: true,
    services: data,
  });
}));

// Update service (Admin only)
app.patch(
  "/api/admin/services/:id",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    const serviceId = Number(req.params.id);

    if (!Number.isInteger(serviceId) || serviceId < 1) {
      return sendError(res, 400, "Invalid service ID.");
    }

    const updates = {};

    if (typeof req.body.description === "string") {
      updates.description = req.body.description;
    }

    if (
      Number.isInteger(req.body.estimated_wait_minutes) &&
      req.body.estimated_wait_minutes >= 0
    ) {
      updates.estimated_wait_minutes = req.body.estimated_wait_minutes;
    }

    if (typeof req.body.is_active === "boolean") {
      updates.is_active = req.body.is_active;
    }

    if (Object.keys(updates).length === 0) {
      return sendError(res, 400, "No valid service fields were supplied.");
    }

    const { data, error } = await supabase
      .from("services")
      .update(updates)
      .eq("id", serviceId)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return sendError(res, 404, "Service not found.");
    }

    return res.json({
      success: true,
      service: data,
    });
  })
);

/* -------------------------- QUEUE ------------------------ */

// Get live queue
app.get("/api/queue/live", asyncRoute(async (_req, res) => {
  const { data, error } = await supabase
    .from("tokens")
    .select(
      "id, token_number, service_id, status, queue_position, issued_at, called_at, services(name), counters(name)"
    )
    .in("status", ["waiting", "serving"])
    .order("issued_at", { ascending: true });

  if (error) throw error;

  const services = {};

  for (const row of data || []) {
    const serviceName = row.services?.name || "Unknown service";

    if (!services[row.service_id]) {
      services[row.service_id] = {
        serviceId: row.service_id,
        service: serviceName,
        nowServing: null,
        waiting: [],
      };
    }

    const item = {
      id: row.id,
      token: row.token_number,
      status: row.status,
      queuePosition: row.queue_position,
      counter: row.counters?.name || null,
      issuedAt: row.issued_at,
      calledAt: row.called_at,
    };

    if (row.status === "serving") {
      services[row.service_id].nowServing = item;
    } else {
      services[row.service_id].waiting.push(item);
    }
  }

  return res.json({
    success: true,
    updatedAt: new Date().toISOString(),
    queues: Object.values(services),
  });
}));

/* -------------------------- TOKENS ----------------------- */

// Issue a new patient token
app.post(
  "/api/tokens",
  requireAuth,
  requireRole("patient"),
  asyncRoute(async (req, res) => {
    const serviceId = Number(req.body.serviceId);

    if (!Number.isInteger(serviceId) || serviceId < 1) {
      return sendError(res, 400, "A valid serviceId is required.");
    }

    const { data, error } = await supabase.rpc("issue_token", {
      p_user_id: Number(req.auth.sub),
      p_service_id: serviceId,
    });

    if (error) {
      if (error.message?.includes("SERVICE_NOT_FOUND")) {
        return sendError(res, 404, "Service not found or inactive.");
      }

      throw error;
    }

    const token = Array.isArray(data) ? data[0] : data;

    return res.status(201).json({
      success: true,
      message: "Digital token issued.",
      token,
    });
  })
);

// Get patient's tokens
app.get(
  "/api/tokens/my",
  requireAuth,
  requireRole("patient"),
  asyncRoute(async (req, res) => {
    const { data, error } = await supabase
      .from("tokens")
      .select(
        "id, token_number, service_id, status, queue_position, issued_at, called_at, completed_at, services(name)"
      )
      .eq("user_id", req.auth.sub)
      .order("issued_at", { ascending: false })
      .limit(30);

    if (error) throw error;

    return res.json({
      success: true,
      tokens: data,
    });
  })
);

// Cancel patient token
app.patch(
  "/api/tokens/:id/cancel",
  requireAuth,
  requireRole("patient"),
  asyncRoute(async (req, res) => {
    const tokenId = Number(req.params.id);

    if (!Number.isInteger(tokenId) || tokenId < 1) {
      return sendError(res, 400, "Invalid token ID.");
    }

    const { data: current, error: readError } = await supabase
      .from("tokens")
      .select("id, status, user_id")
      .eq("id", tokenId)
      .maybeSingle();

    if (readError) throw readError;

    if (!current) {
      return sendError(res, 404, "Token not found.");
    }

    if (String(current.user_id) !== String(req.auth.sub)) {
      return sendError(res, 403, "This token does not belong to your account.");
    }

    if (current.status !== "waiting") {
      return sendError(res, 409, "Only waiting tokens can be cancelled.");
    }

    const { data, error } = await supabase
      .from("tokens")
      .update({ status: "cancelled" })
      .eq("id", tokenId)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return sendError(res, 404, "Token not found.");
    }

    const { error: historyError } = await supabase
      .from("queue_history")
      .insert({
        token_id: data.id,
        old_status: "waiting",
        new_status: "cancelled",
      });

    if (historyError) throw historyError;

    return res.json({
      success: true,
      token: data,
    });
  })
);

/* ------------------- COUNTER MANAGEMENT ------------------ */

// Create a new counter (Admin only)
app.post(
  "/api/admin/counters",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    const name = String(req.body.name || "").trim();
    const serviceId =
      req.body.service_id === undefined ||
      req.body.service_id === null ||
      req.body.service_id === ""
        ? null
        : Number(req.body.service_id);

    if (!name) {
      return sendError(res, 400, "Counter name is required.");
    }

    if (
      serviceId !== null &&
      (!Number.isInteger(serviceId) || serviceId < 1)
    ) {
      return sendError(res, 400, "Invalid service ID.");
    }

    // Check whether the selected service exists
    if (serviceId !== null) {
      const { data: service, error: serviceError } = await supabase
        .from("services")
        .select("id")
        .eq("id", serviceId)
        .maybeSingle();

      if (serviceError) throw serviceError;

      if (!service) {
        return sendError(res, 404, "Service not found.");
      }
    }

    const { data, error } = await supabase
      .from("counters")
      .insert({
        name,
        service_id: serviceId,
        is_active: true,
      })
      .select("id, name, service_id, is_active, created_at")
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Counter created successfully.",
      counter: data,
    });
  })
);

// Get all counters (Admin only)
app.get(
  "/api/admin/counters",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (_req, res) => {
    const { data, error } = await supabase
      .from("counters")
      .select("id, name, service_id, is_active, created_at")
      .order("id", { ascending: true });

    if (error) throw error;

    return res.json({
      success: true,
      total: data.length,
      counters: data,
    });
  })
);

// Update a counter (Admin only)
app.patch(
  "/api/admin/counters/:id",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    const counterId = Number(req.params.id);

    if (!Number.isInteger(counterId) || counterId < 1) {
      return sendError(res, 400, "Invalid counter ID.");
    }

    const updates = {};

    // Update counter name
    if (req.body.name !== undefined) {
      const name = String(req.body.name).trim();

      if (!name) {
        return sendError(res, 400, "Counter name cannot be empty.");
      }

      updates.name = name;
    }

    // Update assigned service
    if (req.body.service_id !== undefined) {
      const serviceId =
        req.body.service_id === null || req.body.service_id === ""
          ? null
          : Number(req.body.service_id);

      if (
        serviceId !== null &&
        (!Number.isInteger(serviceId) || serviceId < 1)
      ) {
        return sendError(res, 400, "Invalid service ID.");
      }

      if (serviceId !== null) {
        const { data: service, error: serviceError } = await supabase
          .from("services")
          .select("id")
          .eq("id", serviceId)
          .maybeSingle();

        if (serviceError) throw serviceError;

        if (!service) {
          return sendError(res, 404, "Service not found.");
        }
      }

      updates.service_id = serviceId;
    }

    // Activate or deactivate counter
    if (typeof req.body.is_active === "boolean") {
      updates.is_active = req.body.is_active;
    }

    if (Object.keys(updates).length === 0) {
      return sendError(res, 400, "No valid counter fields were supplied.");
    }

    const { data, error } = await supabase
      .from("counters")
      .update(updates)
      .eq("id", counterId)
      .select("id, name, service_id, is_active, created_at")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return sendError(res, 404, "Counter not found.");
    }

    return res.json({
      success: true,
      message: "Counter updated successfully.",
      counter: data,
    });
  })
);

// Delete a counter (Admin only)
app.delete(
  "/api/admin/counters/:id",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    const counterId = Number(req.params.id);

    if (!Number.isInteger(counterId) || counterId < 1) {
      return sendError(res, 400, "Invalid counter ID.");
    }

    // Check whether any token is assigned to this counter
    const { data: assignedToken, error: tokenError } = await supabase
      .from("tokens")
      .select("id")
      .eq("counter_id", counterId)
      .limit(1)
      .maybeSingle();

    if (tokenError) throw tokenError;

    if (assignedToken) {
      return sendError(
        res,
        409,
        "This counter is linked to a token. Deactivate it instead of deleting."
      );
    }

    const { data, error } = await supabase
      .from("counters")
      .delete()
      .eq("id", counterId)
      .select("id, name")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return sendError(res, 404, "Counter not found.");
    }

    return res.json({
      success: true,
      message: "Counter deleted successfully.",
      counter: data,
    });
  })
);

/* ---------------------- ADMIN QUEUE --------------------- */

// Get all tokens (Admin only)
app.get(
  "/api/admin/tokens",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    let query = supabase
      .from("tokens")
      .select(
        "id, token_number, user_id, service_id, status, queue_position, counter_id, issued_at, called_at, completed_at, users(name, email), services(name), counters(name)"
      )
      .order("issued_at", { ascending: false })
      .limit(200);

    if (req.query.status) {
      query = query.eq("status", req.query.status);
    }

    if (req.query.serviceId) {
      query = query.eq("service_id", Number(req.query.serviceId));
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json({
      success: true,
      tokens: data,
    });
  })
);

// Update token status (Admin only)
app.patch(
  "/api/admin/tokens/:id/status",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    const tokenId = Number(req.params.id);
    const allowed = ["waiting", "serving", "completed", "cancelled"];
    const newStatus = req.body.status;

    if (!Number.isInteger(tokenId) || tokenId < 1) {
      return sendError(res, 400, "Invalid token ID.");
    }

    if (!allowed.includes(newStatus)) {
      return sendError(res, 400, "Invalid token status.");
    }

    const { data: current, error: readError } = await supabase
      .from("tokens")
      .select("id, status, service_id, counter_id")
      .eq("id", tokenId)
      .maybeSingle();

    if (readError) throw readError;

    if (!current) {
      return sendError(res, 404, "Token not found.");
    }

    const updates = {
      status: newStatus,
    };

    if (newStatus === "serving") {
      updates.called_at = new Date().toISOString();
    }

    if (newStatus === "completed") {
      updates.completed_at = new Date().toISOString();
    }

    if (req.body.counterId !== undefined) {
      const counterId = Number(req.body.counterId);

      if (!Number.isInteger(counterId) || counterId < 1) {
        return sendError(res, 400, "Invalid counter ID.");
      }

      updates.counter_id = counterId;
    }

    const { data, error } = await supabase
      .from("tokens")
      .update(updates)
      .eq("id", tokenId)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return sendError(res, 404, "Token not found.");
    }

    const { error: historyError } = await supabase
      .from("queue_history")
      .insert({
        token_id: data.id,
        old_status: current.status,
        new_status: newStatus,
      });

    if (historyError) throw historyError;

    return res.json({
      success: true,
      token: data,
    });
  })
);

// Admin dashboard
app.get(
  "/api/admin/dashboard",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (_req, res) => {
    const { data: tokens, error: tokenError } = await supabase
      .from("tokens")
      .select("id, status, issued_at, called_at, completed_at, service_id");

    if (tokenError) throw tokenError;

    const today = new Date().toISOString().slice(0, 10);

    const todayTokens = (tokens || []).filter(
      (item) => item.issued_at?.slice(0, 10) === today
    );

    const waiting = todayTokens.filter(
      (item) => item.status === "waiting"
    ).length;

    const serving = todayTokens.filter(
      (item) => item.status === "serving"
    ).length;

    const completed = todayTokens.filter(
      (item) => item.status === "completed"
    ).length;

    return res.json({
      success: true,
      date: today,
      totalTokens: todayTokens.length,
      waiting,
      serving,
      completed,
      cancelled: todayTokens.filter(
        (item) => item.status === "cancelled"
      ).length,
    });
  })
);

/* ---------------------- NOTIFICATIONS ------------------- */

// Get logged-in user's notifications
app.get(
  "/api/notifications",
  requireAuth,
  asyncRoute(async (req, res) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("id, title, message, is_read, created_at")
      .eq("user_id", req.auth.sub)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return res.json({
      success: true,
      notifications: data,
    });
  })
);

// Mark notification as read
app.patch(
  "/api/notifications/:id/read",
  requireAuth,
  asyncRoute(async (req, res) => {
    const notificationId = Number(req.params.id);

    // Validate notification ID
    if (!Number.isInteger(notificationId) || notificationId < 1) {
      return sendError(res, 400, "Invalid notification ID.");
    }

    // Update only the logged-in user's notification
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", req.auth.sub)
      .select("id, title, message, is_read, created_at")
      .maybeSingle();

    if (error) throw error;

    // Return 404 if notification does not exist
    if (!data) {
      return sendError(res, 404, "Notification not found.");
    }

    return res.json({
      success: true,
      message: "Notification marked as read.",
      notification: data,
    });
  })
);

/* ---------------------- ERROR HANDLER ------------------- */

// Handle unexpected server errors
app.use((err, _req, res, _next) => {
  console.error("OptiQueue API error:", err.message || err);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

// Start backend server
app.listen(PORT, () => {
  console.log(`OptiQueue Backend running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
