import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquareIcon,
  UsersIcon,
  PackageIcon,
  ClockIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  XIcon,
  CheckCircle2Icon,
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { adminMenuItems, adminUser } from '../../components/dashboard/adminConfig';
import {
  DistributionAdmin,
  DistributionStats,
  getDistributionStats,
  getDistributions,
  releaseDistribution,
  ReleaseDistributionPayload,
  searchDistributions,
} from '../../api/adminApi';

type DateFilter = 'all' | 'today' | 'week';

const emptyForm: ReleaseDistributionPayload = {
  recipientName: '',
  recipientEmail: '',
  itemName: '',
  quantityReleased: 1,
  remarks: '',
};

export function Distributions() {
  const [distributions, setDistributions] = useState<DistributionAdmin[]>([]);
  const [stats, setStats] = useState<DistributionStats>({
    totalDistributed: 0,
    beneficiariesHelped: 0,
    releasedThisWeek: 0,
    pendingReleases: 0,
  });
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [form, setForm] = useState<ReleaseDistributionPayload>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async (keyword?: string) => {
    setLoading(true);
    setError('');
    try {
      const trimmed = (keyword ?? search).trim();
      const [listResp, statsResp] = await Promise.all([
        trimmed ? searchDistributions(trimmed) : getDistributions(),
        getDistributionStats(),
      ]);
      setDistributions(listResp.data ?? []);
      setStats(statsResp.data);
    } catch (err) {
      setDistributions([]);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load distributions. Please check backend connection.'
      );
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData(search);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search, loadData]);

  const filteredDistributions = useMemo(() => {
    const now = new Date();
    return distributions.filter((item) => {
      if (dateFilter === 'all') return true;
      const releasedAt = new Date(item.releasedAt);
      if (dateFilter === 'today') {
        return (
          releasedAt.getFullYear() === now.getFullYear() &&
          releasedAt.getMonth() === now.getMonth() &&
          releasedAt.getDate() === now.getDate()
        );
      }
      const diff = now.getTime() - releasedAt.getTime();
      return diff <= 7 * 24 * 60 * 60 * 1000;
    });
  }, [dateFilter, distributions]);

  const handleReleaseSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      await releaseDistribution({
        ...form,
        recipientName: form.recipientName.trim(),
        recipientEmail: form.recipientEmail.trim(),
        itemName: form.itemName.trim(),
        remarks: form.remarks?.trim() || '',
      });
      setSuccessMessage('Item released successfully.');
      setShowReleaseModal(false);
      setForm(emptyForm);
      await loadData('');
      setSearch('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to release item.');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  return (
    <DashboardLayout sidebarItems={adminMenuItems} sidebarLabel="Admin Menu" user={adminUser}>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Distribution Tracking</h1>
            <p className="text-slate-600 mt-1">Monitor items released to students and track campus impact.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Search recipient or item..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowFilterMenu((prev) => !prev)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <FilterIcon className="w-4 h-4" />
                {dateFilter === 'all' ? 'All' : dateFilter === 'today' ? 'Released today' : 'Released this week'}
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                  {(['all', 'today', 'week'] as DateFilter[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setDateFilter(option);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                        dateFilter === option ? 'text-sky-600 font-medium' : 'text-slate-600'
                      }`}
                    >
                      {option === 'all' ? 'All' : option === 'today' ? 'Released today' : 'Released this week'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowReleaseModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-4 h-4" /> Release Item
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 flex items-center gap-2">
            <CheckCircle2Icon className="w-4 h-4 shrink-0" />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error.includes('reachable') || error.includes('fetch')
              ? 'Failed to load distributions. Please check backend connection.'
              : error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4">
              <CheckSquareIcon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.totalDistributed}</h3>
            <p className="text-sm font-medium text-slate-500">Total Distributed</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
              <UsersIcon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.beneficiariesHelped}</h3>
            <p className="text-sm font-medium text-slate-500">Beneficiaries Helped</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
              <PackageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.releasedThisWeek}</h3>
            <p className="text-sm font-medium text-slate-500">Released This Week</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
              <ClockIcon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.pendingReleases}</h3>
            <p className="text-sm font-medium text-slate-500">Pending Releases</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading distributions...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Item Released</th>
                    <th className="px-6 py-4">Date Distributed</th>
                    <th className="px-6 py-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDistributions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        No distributions found.
                      </td>
                    </tr>
                  ) : (
                    filteredDistributions.map((dist) => (
                      <tr key={dist.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                              {getInitials(dist.recipientName)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{dist.recipientName}</p>
                              <p className="text-xs text-slate-500">{dist.recipientEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-700">{dist.itemName}</p>
                          <p className="text-xs text-slate-500">Qty: {dist.quantityReleased} • DIST-{dist.id}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {dist.releasedAt ? new Date(dist.releasedAt).toLocaleString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-slate-600 italic text-xs">{dist.remarks || 'No remarks'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showReleaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowReleaseModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(event) => event.stopPropagation()}
              className="bg-white rounded-3xl border border-slate-200 shadow-xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Release Item</h2>
                <button
                  type="button"
                  onClick={() => setShowReleaseModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleReleaseSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Name</label>
                  <input
                    required
                    value={form.recipientName}
                    onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    placeholder="Alex Rivera"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Email</label>
                  <input
                    required
                    type="email"
                    value={form.recipientEmail}
                    onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    placeholder="student@campuscares.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                  <input
                    required
                    value={form.itemName}
                    onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    placeholder="Scientific Calculator"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Released</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.quantityReleased}
                    onChange={(e) =>
                      setForm({ ...form, quantityReleased: Math.max(1, Number(e.target.value) || 1) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                  <textarea
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
                    placeholder="Released after request approval."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Releasing...' : 'Submit Release'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
