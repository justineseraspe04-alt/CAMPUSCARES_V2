import { apiFetch } from './apiClient';

export interface DonationRecord {
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

export interface DonorDashboardStats {
  totalDonations: number;
  approvedDonations: number;
  pendingDonations: number;
  rejectedDonations: number;
  totalQuantityDonated: number;
  studentsHelped: number;
  itemsReused: number;
  unreadNotifications: number;
  lastDonationItemName: string;
  lastDonationDateSubmitted: string;
  mostDonatedCategory: string;
}

/** @deprecated Use DonorDashboardStats */
export type DonationStats = DonorDashboardStats;

export interface DonationPayload {
  donorName: string;
  donorEmail: string;
  itemName: string;
  category: string;
  itemCondition: string;
  quantity: number;
  description?: string;
  size?: string;
  subjectOrCourse?: string;
}

export function submitDonation(payload: DonationPayload) {
  return apiFetch<DonationRecord>('/donations/submit', {
    method: 'POST',
    query: { role: 'DONOR' },
    body: {
      ...payload,
      description: payload.description?.trim() || 'No description provided.',
    },
  });
}

export function getDonationHistory(donorEmail: string) {
  return apiFetch<DonationRecord[]>('/donations/by-donor', {
    query: { donorEmail },
  });
}

export function getDonorDashboardStats(donorEmail: string) {
  return apiFetch<DonorDashboardStats>('/dashboard/donor', {
    query: { donorEmail },
  });
}

export function getDonorStats(donorEmail: string) {
  return getDonorDashboardStats(donorEmail);
}
