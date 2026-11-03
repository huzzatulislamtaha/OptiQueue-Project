
CREATE OR REPLACE FUNCTION public.issue_token(
    p_user_id bigint,
    p_service_id bigint
)
RETURNS TABLE(
    id bigint,
    token_number character varying,
    service_id bigint,
    status character varying,
    queue_position integer,
    issued_at timestamp without time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_service_name VARCHAR(100);
    v_prefix VARCHAR(1);
    v_next_number INTEGER;
    v_position INTEGER;
    v_token_number VARCHAR(20);
BEGIN
    -- Check whether the requested service is active
    SELECT s.name
    INTO v_service_name
    FROM public.services AS s
    WHERE s.id = p_service_id
      AND s.is_active = TRUE;

    IF v_service_name IS NULL THEN
        RAISE EXCEPTION 'SERVICE_NOT_FOUND';
    END IF;

    -- Generate token prefix based on service name
    v_prefix := CASE v_service_name
        WHEN 'General Consultation' THEN 'A'
        WHEN 'Specialist Consultation' THEN 'B'
        WHEN 'Diagnostic / Laboratory' THEN 'C'
        WHEN 'Pharmacy Service' THEN 'D'
        ELSE 'X'
    END;

    -- Prevent simultaneous token number generation
    PERFORM pg_advisory_xact_lock(p_service_id);

    -- Get the next token number for today
    SELECT COUNT(*) + 1
    INTO v_next_number
    FROM public.tokens AS t
    WHERE t.service_id = p_service_id
      AND t.issued_at::date = CURRENT_DATE;

    -- Calculate the current queue position
    SELECT COUNT(*) + 1
    INTO v_position
    FROM public.tokens AS t
    WHERE t.service_id = p_service_id
      AND t.status IN ('waiting', 'serving')
      AND t.issued_at::date = CURRENT_DATE;

    -- Create token number
    v_token_number := v_prefix || '-' ||
        LPAD(v_next_number::TEXT, 3, '0');

    -- Insert new token and return its details
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
$function$;
