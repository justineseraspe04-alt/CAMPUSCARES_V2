import {
  LayoutDashboardIcon,
  BoxesIcon,
  HandHeartIcon,
  ClockIcon,
  SparklesIcon,
  BellIcon,
  HomeIcon } from
'lucide-react';
import { SidebarItem, UserProfile } from './DashboardLayout';

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
  badge: 4
},
{ name: 'Notifications', href: '/recipient/notifications', icon: BellIcon },
{ name: 'Home', href: '/', icon: HomeIcon }];


export const recipientUser: UserProfile = {
  name: 'Alex Rivera',
  email: 'student@campuscares.com',
  initials: 'AR',
  roleLabel: 'Recipient',
  accentColor: 'cyan'
};