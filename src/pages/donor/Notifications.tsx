import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { donorMenuItems } from '../../components/dashboard/donorConfig';
import { NotificationPageContent } from '../../components/notifications/NotificationPageContent';
import { useDashboardProfile } from '../../hooks/useDashboardProfile';

export function Notifications() {
  const profile = useDashboardProfile();

  return (
    <DashboardLayout sidebarItems={donorMenuItems} sidebarLabel="Donor Menu" user={profile}>
      <NotificationPageContent user={profile} accent="emerald" />
    </DashboardLayout>
  );
}
