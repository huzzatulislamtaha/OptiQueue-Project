-- =========================================================
-- OPTIQUEUE SMART HOSPITAL QUEUE MANAGEMENT SYSTEM
-- Complete Supabase Database Setup
-- Supports new and existing databases
-- Daily token numbers are unique per service and date
-- =========================================================

BEGIN;

-- =========================================================
-- 1. USERS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mobile_number VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('patient', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(20);

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


-- =========================================================
-- 2. SERVICES TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    estimated_wait_minutes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. COUNTERS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS public.counters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    service_id BIGINT REFERENCES public.services(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 4. TOKENS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS public.tokens (
    id BIGSERIAL PRIMARY KEY,
    token_number VARCHAR(20) NOT NULL,
    user_id BIGINT REFERENCES public.users(id),
    service_id BIGINT NOT NULL REFERENCES public.services(id),
    status VARCHAR(20) NOT NULL DEFAULT 'waiting'
        CHECK (status IN ('waiting', 'serving', 'completed', 'cancelled')),
    queue_position INTEGER,
    counter_id BIGINT REFERENCES public.counters(id),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP,
    completed_at TIMESTAMP
);


-- =========================================================
-- 5. NOTIFICATIONS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 6. QUEUE HISTORY TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS public.queue_history (
    id BIGSERIAL PRIMARY KEY,
    token_id BIGINT NOT NULL REFERENCES public.tokens(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 7. ANALYTICS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS public.analytics (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT REFERENCES public.services(id),
    total_tokens INTEGER DEFAULT 0,
    completed_tokens INTEGER DEFAULT 0,
    average_wait_minutes DECIMAL(10, 2) DEFAULT 0,
    recorded_date DATE DEFAULT CURRENT_DATE
);


-- =========================================================
-- 8. REVOKED TOKENS TABLE
-- Server-side JWT logout and session revocation
-- =========================================================

CREATE TABLE IF NOT EXISTS public.revoked_tokens (
    jti TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES public.users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires_at
    ON public.revoked_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_revoked_tokens_user_id
    ON public.revoked_tokens(user_id);


-- =========================================================
-- 9. UPDATED_AT AUTOMATIC TRIGGER
-- Automatically updates users.updated_at
-- =========================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_updated_at_trigger
    ON public.users;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();


-- =========================================================
-- 10. DEFAULT SERVICES
-- =========================================================

INSERT INTO public.services (
    name,
    description,
    estimated_wait_minutes,
    is_active
)
VALUES
    (
        'General Consultation',
        'General doctor consultation',
        18,
        TRUE
    ),
    (
        'Specialist Consultation',
        'Specialist doctor consultation',
        32,
        TRUE
    ),
    (
        'Diagnostic / Laboratory',
        'Diagnostic and laboratory services',
        14,
        TRUE
    ),
    (
        'Pharmacy Service',
        'Medicine and pharmacy service',
        8,
        TRUE
    )
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    estimated_wait_minutes = EXCLUDED.estimated_wait_minutes;


-- =========================================================
-- 11. DATABASE INDEXES
-- Improve common query performance
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_tokens_service_status_issued
    ON public.tokens(service_id, status, issued_at);

CREATE INDEX IF NOT EXISTS idx_tokens_user_issued
    ON public.tokens(user_id, issued_at DESC);

CREATE INDEX IF NOT EXISTS idx_tokens_counter_id
    ON public.tokens(counter_id);

-- Token numbers are unique per service per calendar day.
-- Remove the old global UNIQUE constraint if it exists.

ALTER TABLE public.tokens
    DROP CONSTRAINT IF EXISTS tokens_token_number_key;

CREATE UNIQUE INDEX IF NOT EXISTS tokens_daily_unique_idx
    ON public.tokens (service_id, (issued_at::date), token_number);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created
    ON public.notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_queue_history_token_id
    ON public.queue_history(token_id);

CREATE INDEX IF NOT EXISTS idx_analytics_service_date
    ON public.analytics(service_id, recorded_date);


-- =========================================================
-- 12. ENABLE ROW LEVEL SECURITY
-- No public table access policies are created.
-- Backend must use the Supabase service-role key.
-- =========================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revoked_tokens ENABLE ROW LEVEL SECURITY;


-- =========================================================
-- 13. SECURE ATOMIC TOKEN ISSUANCE FUNCTION
-- Prevents duplicate token numbers during concurrent requests.
-- Validates patient account and active service.
-- =========================================================

DROP FUNCTION IF EXISTS public.issue_token(BIGINT, BIGINT);

CREATE FUNCTION public.issue_token(
    p_user_id BIGINT,
    p_service_id BIGINT
)
RETURNS TABLE (
    id BIGINT,
    token_number VARCHAR(20),
    service_id BIGINT,
    status VARCHAR(20),
    queue_position INTEGER,
    issued_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_service_name VARCHAR(100);
    v_prefix VARCHAR(1);
    v_next_number INTEGER;
    v_position INTEGER;
    v_token_number VARCHAR(20);
BEGIN
    -- Validate the requested patient ID.
    IF p_user_id IS NULL OR p_user_id < 1 THEN
        RAISE EXCEPTION 'INVALID_USER';
    END IF;

    -- Validate the requested service ID.
    IF p_service_id IS NULL OR p_service_id < 1 THEN
        RAISE EXCEPTION 'INVALID_SERVICE';
    END IF;

    -- Only existing patient accounts may receive tokens.
    PERFORM 1
    FROM public.users AS u
    WHERE u.id = p_user_id
      AND u.role = 'patient';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'PATIENT_NOT_FOUND';
    END IF;

    -- The service must exist and be active.
    SELECT s.name
    INTO v_service_name
    FROM public.services AS s
    WHERE s.id = p_service_id
      AND s.is_active = TRUE;

    IF v_service_name IS NULL THEN
        RAISE EXCEPTION 'SERVICE_NOT_FOUND';
    END IF;

    -- Assign a prefix based on the service name.
    v_prefix := CASE v_service_name
        WHEN 'General Consultation' THEN 'A'
        WHEN 'Specialist Consultation' THEN 'B'
        WHEN 'Diagnostic / Laboratory' THEN 'C'
        WHEN 'Pharmacy Service' THEN 'D'
        ELSE 'X'
    END;

    -- Serialize token generation for this service.
    PERFORM pg_advisory_xact_lock(p_service_id);

    -- Find the next number for this service today.
    -- Ignore malformed suffixes rather than raising a cast error.
    SELECT COALESCE(
        MAX(SUBSTRING(t.token_number FROM 3)::INTEGER),
        0
    ) + 1
    INTO v_next_number
    FROM public.tokens AS t
    WHERE t.service_id = p_service_id
      AND t.issued_at::date = CURRENT_DATE
      AND t.token_number LIKE v_prefix || '-%'
      AND SUBSTRING(t.token_number FROM 3) ~ '^[0-9]+$';

    -- Calculate the current waiting/serving queue position.
    SELECT COUNT(*) + 1
    INTO v_position
    FROM public.tokens AS t
    WHERE t.service_id = p_service_id
      AND t.status IN ('waiting', 'serving')
      AND t.issued_at::date = CURRENT_DATE;

    -- Build the token number, e.g. A-001.
    v_token_number := v_prefix || '-' ||
        LPAD(v_next_number::TEXT, 3, '0');

    -- Insert the token and return its details.
    RETURN QUERY
    INSERT INTO public.tokens AS inserted_token (
        token_number,
        user_id,
        service_id,
        status,
        queue_position
    )
    VALUES (
        v_token_number,
        p_user_id,
        p_service_id,
        'waiting',
        v_position
    )
    RETURNING
        inserted_token.id,
        inserted_token.token_number,
        inserted_token.service_id,
        inserted_token.status,
        inserted_token.queue_position,
        inserted_token.issued_at;
END;
$$;


-- =========================================================
-- 14. RESTRICT FUNCTION EXECUTION PERMISSIONS
-- Only the backend service_role can issue tokens using RPC.
-- =========================================================

REVOKE ALL ON FUNCTION public.issue_token(BIGINT, BIGINT)
    FROM PUBLIC;

REVOKE ALL ON FUNCTION public.issue_token(BIGINT, BIGINT)
    FROM anon;

REVOKE ALL ON FUNCTION public.issue_token(BIGINT, BIGINT)
    FROM authenticated;

GRANT EXECUTE ON FUNCTION public.issue_token(BIGINT, BIGINT)
    TO service_role;


-- =========================================================
-- 15. CLEANUP FUNCTION FOR EXPIRED REVOKED TOKENS
-- Run periodically from a trusted backend or scheduled job.
-- =========================================================

CREATE OR REPLACE FUNCTION public.cleanup_expired_revoked_tokens()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.revoked_tokens
    WHERE expires_at < NOW();

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    RETURN deleted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_expired_revoked_tokens()
    FROM PUBLIC;

REVOKE ALL ON FUNCTION public.cleanup_expired_revoked_tokens()
    FROM anon;

REVOKE ALL ON FUNCTION public.cleanup_expired_revoked_tokens()
    FROM authenticated;

GRANT EXECUTE ON FUNCTION public.cleanup_expired_revoked_tokens()
    TO service_role;


-- =========================================================
-- 16. BACKEND SERVICE ROLE PERMISSIONS
-- =========================================================

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public
    TO service_role;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public
    TO service_role;


COMMIT;


-- =========================================================
-- 17. DATABASE VERIFICATION
-- Run these queries separately if you want to inspect setup.
-- =========================================================

-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;

-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name = 'users'
-- ORDER BY ordinal_position;

-- SELECT id, name, email, role
-- FROM public.users;

-- SELECT id, name, is_active
-- FROM public.services
-- ORDER BY id;