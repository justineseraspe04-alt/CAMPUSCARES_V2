import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { adminMenuItems, adminUser } from '../../components/dashboard/adminConfig';
import { NotificationPageContent } from '../../components/notifications/NotificationPageContent';

export function Notifications() {
  return (
    <DashboardLayout sidebarItems={adminMenuItems} sidebarLabel="Admin Menu" user={adminUser}>
      <NotificationPageContent user={adminUser} accent="sky" />
    </DashboardLayout>
  );
}
