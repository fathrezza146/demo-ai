INSERT INTO users (email, full_name, role_id, is_active)
SELECT
  seed.email,
  seed.full_name,
  roles.id,
  TRUE
FROM (
  VALUES
    ('employee1@company.com', 'Employee One', 'EMPLOYEE'),
    ('employee2@company.com', 'Employee Two', 'EMPLOYEE'),
    ('admin@company.com', 'System Admin', 'ADMIN')
) AS seed(email, full_name, role_name)
INNER JOIN roles ON roles.role_name = seed.role_name
ON CONFLICT (email) DO UPDATE
SET
  full_name = EXCLUDED.full_name,
  role_id = EXCLUDED.role_id,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
