
-- =====================================================
-- OptiQueue Smart Hospital Queue Management System
-- Main Database Setup
-- =====================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    estimated_wait_minutes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. COUNTERS TABLE
CREATE TABLE IF NOT EXISTS public.counters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    service_id BIGINT REFERENCES public.services(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TOKENS TABLE
CREATE TABLE IF NOT EXISTS public.tokens (
    id BIGSERIAL PRIMARY KEY,
    token_number VARCHAR(20) UNIQUE NOT NULL,
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

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. QUEUE HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.queue_history (
    id BIGSERIAL PRIMARY KEY,
    token_id BIGINT NOT NULL REFERENCES public.tokens(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.analytics (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT REFERENCES public.services(id),
    total_tokens INTEGER DEFAULT 0,
    completed_tokens INTEGER DEFAULT 0,
    average_wait_minutes DECIMAL(10, 2) DEFAULT 0,
    recorded_date DATE DEFAULT CURRENT_DATE
);

-- 8. DEFAULT SERVICES
INSERT INTO public.services
    (name, description, estimated_wait_minutes)
VALUES
    ('General Consultation', 'General doctor consultation', 18),
    ('Specialist Consultation', 'Specialist doctor consultation', 32),
    ('Diagnostic / Laboratory', 'Diagnostic and laboratory services', 14),
    ('Pharmacy Service', 'Medicine and pharmacy service', 8)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    estimated_wait_minutes = EXCLUDED.estimated_wait_minutes;

-- 9. DATABASE INDEXES
CREATE INDEX IF NOT EXISTS idx_tokens_service_status_issued
ON public.tokens(service_id, status, issued_at);

CREATE INDEX IF NOT EXISTS idx_tokens_user_issued
ON public.tokens(user_id, issued_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created
ON public.notifications(user_id, created_at DESC);

-- 10. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- 11. TOKEN ISSUE FUNCTION (FIXED)
CREATE OR REPLACE FUNCTION public.issue_token(
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
    SELECT s.name INTO v_service_name
    FROM public.services AS s
    WHERE s.id = p_service_id
      AND s.is_active = TRUE;

    IF v_service_name IS NULL THEN
        RAISE EXCEPTION 'SERVICE_NOT_FOUND';
    END IF;

    v_prefix := CASE v_service_name
        WHEN 'General Consultation' THEN 'A'
        WHEN 'Specialist Consultation' THEN 'B'
        WHEN 'Diagnostic / Laboratory' THEN 'C'
        WHEN 'Pharmacy Service' THEN 'D'
        ELSE 'X'
    END;

    PERFORM pg_advisory_xact_lock(p_service_id);

    SELECT COUNT(*) + 1 INTO v_next_number
    FROM public.tokens AS t
    WHERE t.service_id = p_service_id
      AND t.issued_at::date = CURRENT_DATE;

    SELECT COUNT(*) + 1 INTO v_position
    FROM public.tokens AS t
    WHERE t.service_id = p_service_id
      AND t.status IN ('waiting', 'serving')
      AND t.issued_at::date = CURRENT_DATE;

    v_token_number := v_prefix || '-' ||
        LPAD(v_next_number::TEXT, 3, '0');

    RETURN QUERY
    INSERT INTO public.tokens AS t (
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
        t.id,
        t.token_number,
        t.service_id,
        t.status,
        t.queue_position,
        t.issued_at;
END;
$$;

-- 12. FUNCTION PERMISSION
GRANT EXECUTE ON FUNCTION public.issue_token(BIGINT, BIGINT)
TO service_role;

-- =====================================================
-- DATABASE SETUP COMPLETED
-- =====================================================
