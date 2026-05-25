import React from 'react';
import { motion } from 'framer-motion';
import {
  DashboardLayout,
  SidebarItem,
  UserProfile } from
'../components/dashboard/DashboardLayout';
interface PlaceholderPageProps {
  title: string;
  description: string;
  sidebarItems: SidebarItem[];
  sidebarLabel: string;
  user: UserProfile;
  children?: React.ReactNode;
}
export function PlaceholderPage({
  title,
  description,
  sidebarItems,
  sidebarLabel,
  user,
  children
}: PlaceholderPageProps) {
  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      sidebarLabel={sidebarLabel}
      user={user}>
      
      <div className="space-y-8 pb-12">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {title}
          </h1>
          <p className="text-slate-600 mt-1">{description}</p>
        </div>

        {children}
      </div>
    </DashboardLayout>);

}