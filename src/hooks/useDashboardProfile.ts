import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { authUserToProfile } from '../utils/authUtils';
import { UserProfile } from '../components/dashboard/DashboardLayout';

/**
 * Maps the authenticated user from AuthContext to the dashboard header/profile shape.
 */
export function useDashboardProfile(): UserProfile {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) {
      return {
        name: 'Guest',
        email: '',
        initials: '?',
        roleLabel: 'Guest',
        accentColor: 'sky',
      };
    }
    return authUserToProfile(user);
  }, [user]);
}
