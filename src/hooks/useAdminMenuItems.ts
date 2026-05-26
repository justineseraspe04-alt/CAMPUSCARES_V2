import { useEffect, useState } from 'react';
import { adminMenuItems } from '../components/dashboard/adminConfig';
import { SidebarItem } from '../components/dashboard/DashboardLayout';
import { getPendingDonations, getPendingRequests } from '../api/adminApi';

export function useAdminMenuItems(): SidebarItem[] {
  const [items, setItems] = useState<SidebarItem[]>(adminMenuItems);

  useEffect(() => {
    let cancelled = false;

    const loadBadges = async () => {
      try {
        const [donationsResp, requestsResp] = await Promise.all([
          getPendingDonations(),
          getPendingRequests(),
        ]);
        if (cancelled) return;

        const pendingDonations = donationsResp.data?.length ?? 0;
        const pendingRequests = requestsResp.data?.length ?? 0;

        setItems(
          adminMenuItems.map((item) => {
            if (item.href === '/admin/donations/pending' && pendingDonations > 0) {
              return { ...item, badge: pendingDonations };
            }
            if (item.href === '/admin/requests' && pendingRequests > 0) {
              return { ...item, badge: pendingRequests };
            }
            return item;
          })
        );
      } catch {
        if (!cancelled) {
          setItems(adminMenuItems);
        }
      }
    };

    loadBadges();
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}
