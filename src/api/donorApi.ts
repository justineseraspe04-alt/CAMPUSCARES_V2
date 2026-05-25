import { apiFetch, ApiResponse } from './apiClient';

export interface DonationPayload {
  donorName: string;
  donorEmail: string;
  itemName: string;
  category: string;
  itemCondition: string;
  quantity: number;
  description: string;
  size?: string;
  subjectOrCourse?: string;
}

export function submitDonation(payload: DonationPayload) {
  return apiFetch<any>('/donations/submit', {
    method: 'POST',
    query: { role: 'DONOR' },
    body: payload,
  });
}
  
export function getDonationHistory(donorEmail: string) {
  return apiFetch<any[]>('/donations/by-donor', {
    query: { donorEmail },
  });
}
