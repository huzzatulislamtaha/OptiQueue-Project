-- ==========================================
-- OptiQueue: Secure Sequence Permissions
-- ==========================================

-- Remove sequence permissions from public client roles.
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public
FROM anon, authenticated;