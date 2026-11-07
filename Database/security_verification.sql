-- ==========================================
-- OptiQueue: Sequence Permission Verification
-- Read-only security check
-- ==========================================

SELECT
    s.schemaname,
    s.sequencename,

    has_sequence_privilege(
        'anon',
        s.schemaname || '.' || s.sequencename,
        'USAGE'
    ) AS anon_usage,

    has_sequence_privilege(
        'anon',
        s.schemaname || '.' || s.sequencename,
        'SELECT'
    ) AS anon_select,

    has_sequence_privilege(
        'authenticated',
        s.schemaname || '.' || s.sequencename,
        'USAGE'
    ) AS authenticated_usage,

    has_sequence_privilege(
        'authenticated',
        s.schemaname || '.' || s.sequencename,
        'SELECT'
    ) AS authenticated_select,

    has_sequence_privilege(
        'service_role',
        s.schemaname || '.' || s.sequencename,
        'USAGE'
    ) AS service_role_usage

FROM pg_sequences s
WHERE s.schemaname = 'public'
ORDER BY s.sequencename;


-- ==========================================
-- OptiQueue: Default Sequence Privileges
-- Read-only verification
-- ==========================================

SELECT
    COALESCE(r.rolname, 'PUBLIC') AS grantee,
    d.defaclrole::regrole AS object_owner,
    d.defaclnamespace::regnamespace AS schema_name,
    x.privilege_type,
    x.is_grantable
FROM pg_default_acl d
CROSS JOIN LATERAL aclexplode(d.defaclacl) AS x
LEFT JOIN pg_roles r
    ON r.oid = x.grantee
WHERE d.defaclnamespace = 'public'::regnamespace
  AND d.defaclobjtype = 'S'
ORDER BY grantee, privilege_type;


-- ==========================================
-- OptiQueue: Secure Future Sequence Defaults
-- ==========================================

-- Remove default sequence privileges for postgres.
ALTER DEFAULT PRIVILEGES
FOR ROLE postgres
IN SCHEMA public
REVOKE ALL ON SEQUENCES FROM anon, authenticated;

-- Remove default sequence privileges for supabase_admin.
ALTER DEFAULT PRIVILEGES
FOR ROLE supabase_admin
IN SCHEMA public
REVOKE ALL ON SEQUENCES FROM anon, authenticated;