// Cookie sesi admin. Dipasang server (login) dan dihapus server (logout), tidak pernah dibaca JavaScript.
// HttpOnly: tidak bisa dicuri lewat XSS. Secure: hanya lewat HTTPS di production.
// SameSite=Strict: tidak terkirim dari situs lain, jadi API admin tidak bisa dipicu lewat CSRF.
export const ADMIN_COOKIE = 'admin_token';
export const ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 7; // sama dengan masa berlaku JWT (7 hari)

export function adminCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  };
}
