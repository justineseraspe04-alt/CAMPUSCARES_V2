import {
  LayoutDashboardIcon,
  BoxesIcon,
  HandHeartIcon,
  ClockIcon,
  SparklesIcon,
  BellIcon,
  HomeIcon } from
'lucide-react';
import { SidebarItem } from './DashboardLayout';

export const recipientMenuItems: SidebarItem[] = [
{
  name: 'Dashboard',
  href: '/recipient/dashboard',
  icon: LayoutDashboardIcon
},
{ name: 'Available Items', href: '/recipient/inventory', icon: BoxesIcon },
{ name: 'Request Item', href: '/recipient/request', icon: HandHeartIcon },
{ name: 'Request History', href: '/recipient/history', icon: ClockIcon },
{
  name: 'AI Recommendations',
  href: '/recipient/recommendations',
  icon: SparklesIcon,
},
{ name: 'Notifications', href: '/recipient/notifications', icon: BellIcon },
{ name: 'Home', href: '/', icon: HomeIcon }];