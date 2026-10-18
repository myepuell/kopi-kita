// Tabel catatan login admin yang gagal (lib/login-rate-limit.ts). Dipakai juga oleh server/db/migrate.ts.
export const LOGIN_FAILURES_DDL = `
  CREATE TABLE IF NOT EXISTS login_failures (
    id BIGSERIAL PRIMARY KEY,
    ip TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS login_failures_ip_created ON login_failures (ip, created_at);
`;
