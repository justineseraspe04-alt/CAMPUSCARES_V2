import { mapCategoryToApi } from './donationDisplay';
import { formatCategoryLabel, formatConditionLabel } from './donationDisplay';

export { mapCategoryToApi, formatCategoryLabel, formatConditionLabel };

/** Map API category enum to form select label. */
export function apiCategoryToFormLabel(category: string): string {
  const upper = (category ?? '').trim().toUpperCase();
  switch (upper) {
    case 'CLOTHING':
      return 'Clothing';
    case 'BOOKS':
      return 'Books';
    case 'SCHOOL_SUPPLIES':
      return 'School Supplies';
    case 'ESSENTIALS':
      return 'Essentials';
    case 'OTHER':
    case 'OTHERS':
      return 'Others';
    default:
      return formatCategoryLabel(category);
  }
}

export function formatRequestStatusLabel(status: string): string {
  const upper = (status ?? '').toUpperCase();
  if (upper === 'PENDING') return 'Pending';
  if (upper === 'APPROVED') return 'Approved';
  if (upper === 'RELEASED') return 'Released';
  if (upper === 'REJECTED') return 'Declined';
  return status;
}

export function formatRequestStatusFilter(status: string): string {
  const label = formatRequestStatusLabel(status);
  if (label === 'Released' || label === 'Approved') return 'Fulfilled';
  return label;
}

export function formatRequestDate(createdAt?: string): string {
  if (!createdAt || createdAt === '-') return '-';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;
  return date.toLocaleString();
}
