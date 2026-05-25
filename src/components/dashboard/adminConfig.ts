import {
  LayoutDashboardIcon,
  PackagePlusIcon,
  ClockIcon,
  BoxesIcon,
  HandHeartIcon,
  CheckSquareIcon,
  ListIcon,
  BellIcon,
  PaletteIcon,
  HomeIcon } from
'lucide-react';
import { SidebarItem, UserProfile } from './DashboardLayout';

export const adminMenuItems: SidebarItem[] = [
{ name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboardIcon },
{ name: 'Donations', href: '/admin/donations', icon: PackagePlusIcon },
{
  name: 'Pending Donations',
  href: '/admin/donations/pending',
  icon: ClockIcon,
  badge: 12
},
{ name: 'Inventory', href: '/admin/inventory', icon: BoxesIcon },
{
  name: 'Student Requests',
  href: '/admin/requests',
  icon: HandHeartIcon,
  badge: 5
},
{
  name: 'Distributions',
  href: '/admin/distributions',
  icon: CheckSquareIcon
},
{ name: 'Transaction Logs', href: '/admin/logs', icon: ListIcon },
{ name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
{ name: 'Design System', href: '/admin/design-system', icon: PaletteIcon },
{ name: 'Home', href: '/', icon: HomeIcon }];


export const adminUser: UserProfile = {
  name: 'System Admin',
  email: 'admin@campuscares.com',
  initials: 'SA',
  roleLabel: 'Administrator',
  accentColor: 'sky'
};