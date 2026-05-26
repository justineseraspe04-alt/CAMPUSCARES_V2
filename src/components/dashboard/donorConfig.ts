import {
  LayoutDashboardIcon,
  PackagePlusIcon,
  ClockIcon,
  BellIcon,
} from 'lucide-react';
import { SidebarItem } from './DashboardLayout';

export const donorMenuItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/donor/dashboard', icon: LayoutDashboardIcon },
  { name: 'Submit Donation', href: '/donor/donate', icon: PackagePlusIcon },
  { name: 'Donation History', href: '/donor/history', icon: ClockIcon },
  { name: 'Notifications', href: '/donor/notifications', icon: BellIcon },
];