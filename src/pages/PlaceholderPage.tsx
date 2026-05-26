import React from 'react';
import { DashboardLayout, SidebarItem } from '../components/dashboard/DashboardLayout';
import { useDashboardProfile } from '../hooks/useDashboardProfile';

interface PlaceholderPageProps {
  title: string;
  description: string;
  sidebarItems: SidebarItem[];
  sidebarLabel: string;
  children?: React.ReactNode;
}

export function PlaceholderPage({
  title,
  description,
  sidebarItems,
  sidebarLabel,
  children,
}: PlaceholderPageProps) {
  const user = useDashboardProfile();

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
