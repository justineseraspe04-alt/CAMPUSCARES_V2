import { AuthUser } from '../context/AuthContext';
import { UserProfile } from '../components/dashboard/DashboardLayout';

export const STORAGE_KEY = 'campuscares_user';

export type AppRole = 'ADMIN' | 'DONOR' | 'RECIPIENT';

export function normalizeRole(role: string | undefined | null): AppRole | null {
  const upper = (role ?? '').trim().toUpperCase();
  if (upper === 'ADMIN' || upper === 'DONOR' || upper === 'RECIPIENT') {
    return upper;
  }
  return null;
}

/** Parse persisted or API payload into a consistent AuthUser shape. */
export function normalizeAuthUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const email = typeof record.email === 'string' ? record.email.trim() : '';
  const role = normalizeRole(
    typeof record.role === 'string' ? record.role : String(record.role ?? '')
  );

  if (!email || !role) {
    return null;
  }

  const userIdRaw = record.userId ?? record.id;
  const userId =
    typeof userIdRaw === 'number'
      ? userIdRaw
      : typeof userIdRaw === 'string'
        ? Number.parseInt(userIdRaw, 10)
        : -1;

  const fullName =
    (typeof record.fullName === 'string' && record.fullName.trim()) ||
    (typeof record.name === 'string' && record.name.trim()) ||
    email;

  return {
    userId: Number.isFinite(userId) ? userId : -1,
    fullName,
    email,
    role,
  };
}

export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getRoleLabel(role: string): string {
  switch (normalizeRole(role)) {
    case 'ADMIN':
      return 'Administrator';
    case 'DONOR':
      return 'Donor';
    case 'RECIPIENT':
      return 'Recipient';
    default:
      return 'User';
  }
}

export function getAccentForRole(role: string): UserProfile['accentColor'] {
  switch (normalizeRole(role)) {
    case 'ADMIN':
      return 'sky';
    case 'DONOR':
      return 'emerald';
    case 'RECIPIENT':
      return 'cyan';
    default:
      return 'sky';
  }
}

export function authUserToProfile(user: AuthUser): UserProfile {
  return {
    name: user.fullName,
    email: user.email,
    initials: getInitials(user.fullName),
    roleLabel: getRoleLabel(user.role),
    accentColor: getAccentForRole(user.role),
  };
}

export function getDashboardPath(role: string): string {
  switch (normalizeRole(role)) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'DONOR':
      return '/donor/dashboard';
    case 'RECIPIENT':
      return '/recipient/dashboard';
    default:
      return '/login';
  }
}
