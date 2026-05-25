import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { recipientMenuItems, recipientUser } from '../../components/dashboard/recipientConfig';
import { NotificationPageContent } from '../../components/notifications/NotificationPageContent';

export function Notifications() {
  return (
    <DashboardLayout sidebarItems={recipientMenuItems} sidebarLabel="Recipient Menu" user={recipientUser}>
      <NotificationPageContent user={recipientUser} accent="cyan" />
    </DashboardLayout>
  );
}
