import { apiFetch } from './apiClient';

export interface NotificationRecord {
  id: number;
  recipientEmail: string;
  message: string;
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
  recipientEmail: string;
  message: string;
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

export function markNotificationAsRead(id: number) {
  return apiFetch<NotificationRecord>(`/notifications/read/${id}`, {
    method: 'PUT',
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
