import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { recipientMenuItems } from '../../components/dashboard/recipientConfig';
import { NotificationPageContent } from '../../components/notifications/NotificationPageContent';
import { useDashboardProfile } from '../../hooks/useDashboardProfile';

export function Notifications() {
  const profile = useDashboardProfile();

  return (
    <DashboardLayout sidebarItems={recipientMenuItems} sidebarLabel="Recipient Menu" user={profile}>
      <NotificationPageContent user={profile} accent="cyan" />
    </DashboardLayout>
  );
}
