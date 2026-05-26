import { apiFetch } from './apiClient';

export interface DashboardCategoryCount {
  name: string;
  count: number;
  percent: number;
}

export interface DashboardDayCount {
  name: string;
  donations: number;
}

export interface DashboardLogSummary {
  id: number;
  action: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

export interface DashboardNotificationSummary {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalDonations: number;
  approvedDonations: number;
  pendingDonations: number;
  rejectedDonations: number;
  totalInventoryItems: number;
  lowStockItems: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  releasedRequests: number;
  totalDistributedItems: number;
  beneficiariesHelped: number;
  unreadNotifications: number;
  distributionProgressPercent: number;
  donationActivityByDay: DashboardDayCount[];
  requestCategoryBreakdown: DashboardCategoryCount[];
  donationCategoryBreakdown: DashboardCategoryCount[];
  recentLogs: DashboardLogSummary[];
  recentNotifications: DashboardNotificationSummary[];
  pendingDonationItems: DonationAdmin[];
  pendingRequestItems: StudentRequestAdmin[];
  inventoryPreview: InventoryAdmin[];
}

/** @deprecated Use AdminDashboardStats */
export interface DashboardStats {
  totalDonations: number;
  totalDistributedItems: number;
  pendingRequests: number;
  beneficiaries: number;
}

export interface DonationAdmin {
  id: number;
  donorName: string;
  donorEmail: string;
  itemName: string;
  category: string;
  itemCondition: string;
  status: string;
  quantity: number;
  description: string;
  dateSubmitted: string;
}

export interface StudentRequestAdmin {
  id: number;
  studentName: string;
  studentEmail: string;
  requestedItemName: string;
  category: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface InventoryAdmin {
  id: number;
  itemName: string;
  category: string;
  itemCondition: string;
  quantityAvailable: number;
  qrCode: string;
  size?: string;
  subjectOrCourse?: string;
}

export interface InventoryStats {
  totalItems: number;
  availableItems: number;
  lowStockItems: number;
  qrTrackedItems: number;
}

export interface DistributionAdmin {
  id: number;
  recipientName: string;
  recipientEmail: string;
  itemName: string;
  quantityReleased: number;
  remarks?: string;
  releasedAt: string;
}

export interface DistributionStats {
  totalDistributed: number;
  beneficiariesHelped: number;
  releasedThisWeek: number;
  pendingReleases: number;
}

export interface TransactionLogAdmin {
  id: number;
  action: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

export interface ReleaseDistributionPayload {
  recipientName: string;
  recipientEmail: string;
  itemName: string;
  quantityReleased: number;
  remarks?: string;
  requestId?: number;
}

export function getAdminDashboardStats() {
  return apiFetch<AdminDashboardStats>('/dashboard/admin', {
    query: { role: 'ADMIN' },
  });
}

export function getDashboardStats() {
  return getAdminDashboardStats();
}

export function getAllDonations() {
  return apiFetch<DonationAdmin[]>('/donations/all');
}

export function getPendingDonations() {
  return apiFetch<DonationAdmin[]>('/donations/pending', {
    query: { role: 'ADMIN' },
  });
}

export function approveDonation(id: number) {
  return apiFetch<any>(`/donations/approve/${id}`, {
    method: 'PUT',
    query: { role: 'ADMIN' },
  });
}

export function rejectDonation(id: number) {
  return apiFetch<any>(`/donations/reject/${id}`, {
    method: 'PUT',
    query: { role: 'ADMIN' },
  });
}

export function getAllRequests() {
  return apiFetch<StudentRequestAdmin[]>('/requests/all');
}

export function getPendingRequests() {
  return apiFetch<StudentRequestAdmin[]>('/requests/pending');
}

export function approveRequest(id: number) {
  return apiFetch<any>(`/requests/approve/${id}`, {
    method: 'PUT',
    query: { role: 'ADMIN' },
  });
}

export function rejectRequest(id: number) {
  return apiFetch<any>(`/requests/reject/${id}`, {
    method: 'PUT',
    query: { role: 'ADMIN' },
  });
}

export function getInventory() {
  return apiFetch<InventoryAdmin[]>('/inventory/all');
}

export function getInventoryStats() {
  return apiFetch<InventoryStats>('/inventory/stats');
}

export function searchInventory(keyword: string) {
  return apiFetch<InventoryAdmin[]>('/inventory/search', {
    query: { keyword },
  });
}

export function getInventoryByCategory(category: string) {
  return apiFetch<InventoryAdmin[]>(`/inventory/category/${encodeURIComponent(category)}`);
}

export function getDistributions() {
  return apiFetch<DistributionAdmin[]>('/distributions/all');
}

export function getDistributionStats() {
  return apiFetch<DistributionStats>('/distributions/stats');
}

export function searchDistributions(keyword: string) {
  return apiFetch<DistributionAdmin[]>('/distributions/search', {
    query: { keyword },
  });
}

export function releaseDistribution(payload: ReleaseDistributionPayload) {
  return apiFetch<DistributionAdmin>('/distributions/release', {
    method: 'POST',
    query: { role: 'ADMIN' },
    body: payload,
  });
}

export function getLogs() {
  return apiFetch<TransactionLogAdmin[]>('/logs');
}

export {
  getNotifications,
  getUnreadNotifications,
  getNotificationStats,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
} from './notificationApi';

export type { NotificationRecord as NotificationAdmin, NotificationStats } from './notificationApi';
