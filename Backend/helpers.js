
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Create JWT token for logged-in users
function createToken(user) {
  const payload = {
    sub: String(user.id),
    role: user.role,
    email: user.email,
    jti: crypto.randomUUID(),
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  return token;
}

// Convert email to lowercase and remove extra spaces
function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

// Check password length
function validPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    password.length <= 128
  );
}

// Export helper functions
module.exports = {
  createToken,
  normalizeEmail,
  validPassword,
};
