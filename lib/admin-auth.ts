export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

// Relative paths on the same origin as required by Module 4 integration
export const API_BASE = '';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function getAuthUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: AdminUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', JSON.stringify(user));
  document.cookie = `admin_token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  document.cookie = 'admin_token=; path=/; max-age=0';
}
