import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAdminMenuItems } from '../../hooks/useAdminMenuItems';
import { NotificationPageContent } from '../../components/notifications/NotificationPageContent';
import { useDashboardProfile } from '../../hooks/useDashboardProfile';

export function Notifications() {
  const profile = useDashboardProfile();
  const menuItems = useAdminMenuItems();

  return (
    <DashboardLayout sidebarItems={menuItems} sidebarLabel="Admin Menu" user={profile}>
      <NotificationPageContent user={profile} accent="sky" />
    </DashboardLayout>
  );
}
