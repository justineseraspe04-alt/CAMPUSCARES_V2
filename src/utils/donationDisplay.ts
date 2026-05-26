/** Display helpers for donation API values (categories/conditions/status). */

export function mapCategoryToApi(label: string): string {
  if (!label) return 'OTHER';
  const normalized = label.trim().replace(/[- ]/g, '_').toUpperCase();
  if (normalized === 'OTHERS') return 'OTHER';
  return normalized;
}

export function mapConditionToApi(label: string): string {
  if (!label) return 'WORN';
  const normalized = label.trim().toUpperCase();
  if (normalized === 'NEW') return 'NEW';
  if (normalized.includes('SLIGHT') || normalized.includes('LIKE') || normalized === 'GOOD') {
    return 'SLIGHTLY_USED';
  }
  if (normalized === 'USED' || normalized === 'WORN') return 'WORN';
  return 'WORN';
}

export function formatCategoryLabel(category: string): string {
  if (!category) return '—';
  return category
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatConditionLabel(condition: string): string {
  if (!condition) return '—';
  const upper = condition.toUpperCase();
  if (upper === 'NEW') return 'New';
  if (upper === 'SLIGHTLY_USED') return 'Slightly Used';
  if (upper === 'WORN') return 'Worn';
  return formatCategoryLabel(condition);
}

export function formatStatusLabel(status: string): string {
  if (!status) return 'Pending';
  const upper = status.toUpperCase();
  if (upper === 'PENDING') return 'Pending';
  if (upper === 'APPROVED') return 'Approved';
  if (upper === 'REJECTED') return 'Rejected';
  return status.charAt(0) + status.slice(1).toLowerCase();
}
