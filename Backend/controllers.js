
const bcrypt = require("bcryptjs");
const supabase = require("./db");

const {
  createToken,
  normalizeEmail,
  validPassword,
} = require("./helpers");

// Common error response
function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message,
  });
}

// Handle asynchronous controller errors
function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Email validation
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ========================= AUTH ========================= */

// Patient registration
const register = asyncRoute(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (
    !name ||
    name.length > 100 ||
    !email ||
    email.length > 150 ||
    !validPassword(password)
  ) {
    return sendError(
      res,
      400,
      "Name, valid email and password (8-128 characters) are required."
    );
  }

  if (!validEmail(email)) {
    return sendError(res, 400, "Please enter a valid email address.");
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
});

// User login
const login = asyncRoute(async (req, res) => {
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

  if (
    !user ||
    !user.password_hash ||
    !(await bcrypt.compare(password, user.password_hash))
  ) {
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
});

// Create first administrator
const setupAdmin = asyncRoute(async (req, res) => {
  const setupKey = process.env.ADMIN_SETUP_KEY;

  if (!setupKey) {
    return sendError(res, 404, "Admin setup is disabled.");
  }

  if (
    typeof req.body.setupKey !== "string" ||
    req.body.setupKey !== setupKey
  ) {
    return sendError(res, 403, "Invalid setup key.");
  }

  const name = String(req.body.name || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (
    !name ||
    name.length > 100 ||
    !email ||
    email.length > 150 ||
    !validPassword(password)
  ) {
    return sendError(
      res,
      400,
      "Name, valid email and password (8-128 characters) are required."
    );
  }

  if (!validEmail(email)) {
    return sendError(res, 400, "Please enter a valid email address.");
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
    message:
      "Administrator account created. Remove ADMIN_SETUP_KEY from .env now.",
    user: data,
  });
});

// Get logged-in user
const getMe = asyncRoute(async (req, res) => {
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
});

// Logout and revoke session
const logout = asyncRoute(async (req, res) => {
  const { error } = await supabase
    .from("revoked_tokens")
    .upsert(
      {
        jti: req.auth.jti,
        user_id: req.auth.sub,
        expires_at: new Date(req.auth.exp * 1000).toISOString(),
      },
      {
        onConflict: "jti",
        ignoreDuplicates: true,
      }
    );

  if (error) throw error;

  return res.json({
    success: true,
    message: "Logout successful. Session revoked.",
  });
});

// Update patient profile
const updateProfile = asyncRoute(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = normalizeEmail(req.body.email);
  const mobileNumber = String(req.body.mobile_number || "").trim();

  if (!name || !email) {
    return sendError(res, 400, "Name and email are required.");
  }

  if (
    name.length > 100 ||
    email.length > 150 ||
    mobileNumber.length > 20
  ) {
    return sendError(res, 400, "Profile information is too long.");
  }

  if (!validEmail(email)) {
    return sendError(res, 400, "Please enter a valid email address.");
  }

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
});

/* ======================== SERVICES ====================== */

// Get active services
const getServices = asyncRoute(async (_req, res) => {
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
});

// Update service
const updateService = asyncRoute(async (req, res) => {
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
});

/* ========================== QUEUE ======================= */

// Get live queue
const getLiveQueue = asyncRoute(async (_req, res) => {
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
});

/* ========================== TOKENS ====================== */

// Issue patient token
const createPatientToken = asyncRoute(async (req, res) => {
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
});

// Get patient's tokens
const getMyTokens = asyncRoute(async (req, res) => {
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
});

// Cancel patient token
const cancelPatientToken = asyncRoute(async (req, res) => {
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
    .eq("user_id", req.auth.sub)
    .eq("status", "waiting")
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return sendError(
      res,
      409,
      "Token could not be cancelled. Please refresh and try again."
    );
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
});

/* ========================= COUNTERS ===================== */

// Create counter
const createCounter = asyncRoute(async (req, res) => {
  const name = String(req.body.name || "").trim();

  const serviceId =
    req.body.service_id === undefined ||
    req.body.service_id === null ||
    req.body.service_id === ""
      ? null
      : Number(req.body.service_id);

  if (!name || name.length > 100) {
    return sendError(res, 400, "Valid counter name is required.");
  }

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
});

// Get counters
const getCounters = asyncRoute(async (_req, res) => {
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
});

// Update counter
const updateCounter = asyncRoute(async (req, res) => {
  const counterId = Number(req.params.id);

  if (!Number.isInteger(counterId) || counterId < 1) {
    return sendError(res, 400, "Invalid counter ID.");
  }

  const updates = {};

  if (req.body.name !== undefined) {
    const name = String(req.body.name).trim();

    if (!name || name.length > 100) {
      return sendError(res, 400, "Invalid counter name.");
    }

    updates.name = name;
  }

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
});

// Delete counter
const deleteCounter = asyncRoute(async (req, res) => {
  const counterId = Number(req.params.id);

  if (!Number.isInteger(counterId) || counterId < 1) {
    return sendError(res, 400, "Invalid counter ID.");
  }

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
});

/* ======================= ADMIN QUEUE ==================== */

// Get all tokens
const getAdminTokens = asyncRoute(async (req, res) => {
  let query = supabase
    .from("tokens")
    .select(
      "id, token_number, user_id, service_id, status, queue_position, counter_id, issued_at, called_at, completed_at, users(name, email), services(name), counters(name)"
    )
    .order("issued_at", { ascending: false })
    .limit(200);

  if (req.query.status) {
    const allowedStatuses = [
      "waiting",
      "serving",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(req.query.status)) {
      return sendError(res, 400, "Invalid token status filter.");
    }

    query = query.eq("status", req.query.status);
  }

  if (req.query.serviceId) {
    const serviceId = Number(req.query.serviceId);

    if (!Number.isInteger(serviceId) || serviceId < 1) {
      return sendError(res, 400, "Invalid service ID.");
    }

    query = query.eq("service_id", serviceId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return res.json({
    success: true,
    tokens: data,
  });
});

// Update token status
const updateTokenStatus = asyncRoute(async (req, res) => {
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

    const { data: counter, error: counterError } = await supabase
      .from("counters")
      .select("id, is_active")
      .eq("id", counterId)
      .maybeSingle();

    if (counterError) throw counterError;

    if (!counter || !counter.is_active) {
      return sendError(res, 404, "Active counter not found.");
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
});

// Admin dashboard
const getDashboard = asyncRoute(async (_req, res) => {
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
});

/* ====================== NOTIFICATIONS =================== */

// Get user notifications
const getNotifications = asyncRoute(async (req, res) => {
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
});

// Mark notification as read
const markNotificationRead = asyncRoute(async (req, res) => {
  const notificationId = Number(req.params.id);

  if (!Number.isInteger(notificationId) || notificationId < 1) {
    return sendError(res, 400, "Invalid notification ID.");
  }

  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", req.auth.sub)
    .select("id, title, message, is_read, created_at")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return sendError(res, 404, "Notification not found.");
  }

  return res.json({
    success: true,
    message: "Notification marked as read.",
    notification: data,
  });
});

/* ========================= EXPORTS ====================== */

module.exports = {
  asyncRoute,

  register,
  login,
  setupAdmin,
  getMe,
  logout,
  updateProfile,

  getServices,
  updateService,

  getLiveQueue,

  createPatientToken,
  getMyTokens,
  cancelPatientToken,

  createCounter,
  getCounters,
  updateCounter,
  deleteCounter,

  getAdminTokens,
  updateTokenStatus,
  getDashboard,

  getNotifications,
  markNotificationRead,
};
