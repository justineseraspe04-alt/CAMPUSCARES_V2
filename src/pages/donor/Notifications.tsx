import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { donorMenuItems, donorUser } from '../../components/dashboard/donorConfig';
import { NotificationPageContent } from '../../components/notifications/NotificationPageContent';

export function Notifications() {
  return (
    <DashboardLayout sidebarItems={donorMenuItems} sidebarLabel="Donor Menu" user={donorUser}>
      <NotificationPageContent user={donorUser} accent="emerald" />
    </DashboardLayout>
  );
}
