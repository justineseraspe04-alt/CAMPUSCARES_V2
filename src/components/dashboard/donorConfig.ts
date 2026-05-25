import {
  LayoutDashboardIcon,
  PackagePlusIcon,
  ClockIcon,
  BellIcon,
  HomeIcon } from
'lucide-react';
import { SidebarItem, UserProfile } from './DashboardLayout';

export const donorMenuItems: SidebarItem[] = [
{ name: 'Dashboard', href: '/donor/dashboard', icon: LayoutDashboardIcon },
{ name: 'Submit Donation', href: '/donor/donate', icon: PackagePlusIcon },
{ name: 'Donation History', href: '/donor/history', icon: ClockIcon },
{ name: 'Notifications', href: '/donor/notifications', icon: BellIcon },
{ name: 'Home', href: '/', icon: HomeIcon }];


export const donorUser: UserProfile = {
  name: 'Jane Doe',
  email: 'donor@campuscares.com',
  initials: 'JD',
  roleLabel: 'Donor',
  accentColor: 'emerald'
};