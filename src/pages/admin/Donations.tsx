import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import {
  SearchIcon,
  FilterIcon,
  PackagePlusIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  CheckIcon,
  XIcon,
} from 'lucide-react';
import {
  DonationAdmin,
  getAllDonations,
  approveDonation,
  rejectDonation,
} from '../../api/adminApi';
import { useAdminMenuItems } from '../../hooks/useAdminMenuItems';
import { useAdminActions } from '../../hooks/useAdminActions';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { kpiIconClasses } from '../../utils/tailwindClassMaps';

const CATEGORY_FILTER_OPTIONS = [
  { label: 'All Categories', value: '' },
  { label: 'Books', value: 'BOOKS' },
  { label: 'Clothing', value: 'CLOTHING' },
  { label: 'School Supplies', value: 'SCHOOL_SUPPLIES' },
  { label: 'Essentials', value: 'ESSENTIALS' },
  { label: 'Other', value: 'OTHER' },
];

const statusBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-100 text-rose-700 border-rose-200'
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadgeStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>
);

type ConfirmState = { type: 'approve' | 'reject'; donation: DonationAdmin } | null;

export function Donations() {
  const menuItems = useAdminMenuItems();
  const { isBusy, error, success, runAction, clearMessages } = useAdminActions();

  const [donations, setDonations] = useState<DonationAdmin[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const loadDonations = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await getAllDonations();
      setDonations(response.data ?? []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load donations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const handleConfirm = async () => {
    if (!confirm) return;
    const { type, donation } = confirm;
    const ok = await runAction(
      `${type}-donation-${donation.id}`,
      async () => {
        if (type === 'approve') await approveDonation(donation.id);
        else await rejectDonation(donation.id);
        await loadDonations();
      },
      type === 'approve' ? 'Donation approved.' : 'Donation rejected.'
    );
    if (ok) setConfirm(null);
  };

  const filteredDonations = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return donations.filter((item) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        item.donorName.toLowerCase().includes(searchTerm) ||
        item.itemName.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === 'All Status' ||
        item.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesCategory =
        !categoryFilter || item.category.toUpperCase() === categoryFilter.toUpperCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, donations, search, statusFilter]);

  const summaryCards = useMemo(
    () => [
      {
        title: 'Total Donations',
        value: donations.length.toString(),
        icon: PackagePlusIcon,
        color: 'slate'
      },
      {
        title: 'Approved',
        value: donations.filter((item) => item.status === 'APPROVED').length.toString(),
        icon: CheckCircle2Icon,
        color: 'emerald'
      },
      {
        title: 'Pending',
        value: donations.filter((item) => item.status === 'PENDING').length.toString(),
        icon: ClockIcon,
        color: 'amber'
      },
      {
        title: 'Rejected',
        value: donations.filter((item) => item.status === 'REJECTED').length.toString(),
        icon: XCircleIcon,
        color: 'rose'
      }
    ],
    [donations]
  );

  return (
    <PlaceholderPage
      title="All Donations"
      description="Review and manage every donation submitted to CampusCares."
      sidebarItems={menuItems}
      sidebarLabel="Admin Menu"
    >
      {(loadError || error || success) && (
        <div className="space-y-3 mb-6">
          {loadError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {loadError}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
              <button type="button" onClick={clearMessages} className="ml-2 underline">
                Dismiss
              </button>
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                kpiIconClasses[card.color]?.bg ?? 'bg-slate-50'
              } ${kpiIconClasses[card.color]?.text ?? 'text-slate-600'}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{loading ? '…' : card.value}</p>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search donations..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-700"
            >
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-700"
            >
              {CATEGORY_FILTER_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">Loading donations...</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Donation ID</th>
                <th className="px-6 py-4">Donor Name</th>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-500">DON-{item.id}</td>
                  <td className="px-6 py-4 text-slate-800">{item.donorName}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.itemName}</td>
                  <td className="px-6 py-4 text-slate-600">{item.category}</td>
                  <td className="px-6 py-4 text-slate-600">{item.itemCondition}</td>
                  <td className="px-6 py-4 text-slate-600">{item.quantity}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(item.dateSubmitted).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setConfirm({ type: 'approve', donation: item })}
                          className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setConfirm({ type: 'reject', donation: item })}
                          className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg disabled:opacity-50"
                          title="Reject"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDonations.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                    No donations match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </motion.div>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.type === 'approve' ? 'Approve donation?' : 'Reject donation?'}
        message={
          confirm
            ? `${confirm.type === 'approve' ? 'Approve' : 'Reject'} "${confirm.donation.itemName}" from ${confirm.donation.donorName}?`
            : ''
        }
        confirmLabel={confirm?.type === 'approve' ? 'Approve' : 'Reject'}
        variant={confirm?.type === 'reject' ? 'danger' : 'primary'}
        loading={isBusy}
        onCancel={() => !isBusy && setConfirm(null)}
        onConfirm={handleConfirm}
      />
    </PlaceholderPage>
  );
}
