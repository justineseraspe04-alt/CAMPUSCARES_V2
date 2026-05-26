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
import { SidebarItem } from './DashboardLayout';

export const adminMenuItems: SidebarItem[] = [
{ name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboardIcon },
{ name: 'Donations', href: '/admin/donations', icon: PackagePlusIcon },
{
  name: 'Pending Donations',
  href: '/admin/donations/pending',
  icon: ClockIcon,
},
{ name: 'Inventory', href: '/admin/inventory', icon: BoxesIcon },
{
  name: 'Student Requests',
  href: '/admin/requests',
  icon: HandHeartIcon,
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