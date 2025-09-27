-- Down: eliminar los usuarios insertados en el Up
DELETE FROM users
WHERE email IN (
    'alice@example.com',
    'bob@example.com',
    'charlie@example.com',
    'admin@example.com'
);
