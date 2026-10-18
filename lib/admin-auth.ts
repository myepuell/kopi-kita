export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

// Relative paths on the same origin as required by Module 4 integration
export const API_BASE = '';

// Sesi admin = cookie HttpOnly `admin_token` yang dipasang server saat login dan ikut terkirim otomatis
// ke /api/* (same-origin). JavaScript tidak memegang token; localStorage hanya menyimpan nama/email untuk tampilan.
const USER_KEY = 'admin_user';
const LEGACY_TOKEN_KEY = 'admin_token'; // versi lama menyimpan token di localStorage

export function getAuthUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuthSession(user: AdminUser): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function logout(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' }).catch(() => undefined);
}
