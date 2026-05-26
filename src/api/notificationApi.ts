import { apiFetch } from './apiClient';

export interface NotificationRecord {
  id: number;
  userEmail: string;
  recipientEmail?: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  readNotifications: number;
  latestAlert: string;
}

export interface CreateNotificationPayload {
  userEmail: string;
  title: string;
  message: string;
  type?: string;
}

export function getNotifications(email: string) {
  return apiFetch<NotificationRecord[]>('/notifications/user', {
    query: { email },
  });
}

export function getUnreadNotifications(email: string) {
  return apiFetch<NotificationRecord[]>('/notifications/unread', {
    query: { email },
  });
}

export function getNotificationStats(email: string) {
  return apiFetch<NotificationStats>('/notifications/stats', {
    query: { email },
  });
}

export function markNotificationAsRead(id: number, email: string) {
  return apiFetch<NotificationRecord>(`/notifications/read/${id}`, {
    method: 'PUT',
    query: { email },
  });
}

export function markAllNotificationsAsRead(email: string) {
  return apiFetch<number>('/notifications/read-all', {
    method: 'PUT',
    query: { email },
  });
}

export function createNotification(data: CreateNotificationPayload) {
  return apiFetch<NotificationRecord>('/notifications/create', {
    method: 'POST',
    body: data,
  });
}
