import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import { recipientMenuItems } from '../../components/dashboard/recipientConfig';
import {
  SearchIcon,
  FilterIcon,
  HandHeartIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as recipientApi from '../../api/recipientApi';
import {
  formatCategoryLabel,
  formatRequestDate,
  formatRequestStatusFilter,
  formatRequestStatusLabel,
} from '../../utils/requestDisplay';
import { kpiIconClasses } from '../../utils/tailwindClassMaps';

const StatusBadge = ({ status }: { status: string }) => {
  const label = formatRequestStatusLabel(status);
  const display =
    label === 'Approved' || label === 'Released'
      ? label === 'Released'
        ? 'Released'
        : 'Approved'
      : label;
  const styles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Released: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Declined: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[display] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {display}
    </span>
  );
};

export function History() {
  const { user } = useAuth();
  const [rows, setRows] = useState<recipientApi.StudentRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const loadHistory = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError('');
    try {
      const resp = await recipientApi.getRequestHistory(user.email);
      setRows(resp.data ?? []);
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : 'Failed to load request history.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const summary = useMemo(() => {
    const total = rows.length;
    const fulfilled = rows.filter(
      (r) => r.status === 'APPROVED' || r.status === 'RELEASED'
    ).length;
    const pending = rows.filter((r) => r.status === 'PENDING').length;
    const declined = rows.filter((r) => r.status === 'REJECTED').length;
    return { total, fulfilled, pending, declined };
  }, [rows]);

  const summaryCards = [
    { title: 'Total Requests', value: summary.total, icon: HandHeartIcon, color: 'slate' },
    { title: 'Fulfilled', value: summary.fulfilled, icon: CheckCircle2Icon, color: 'emerald' },
    { title: 'Pending', value: summary.pending, icon: ClockIcon, color: 'amber' },
    { title: 'Declined', value: summary.declined, icon: XCircleIcon, color: 'rose' },
  ];

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        term.length === 0 ||
        row.requestedItemName.toLowerCase().includes(term) ||
        row.category.toLowerCase().includes(term) ||
        String(row.id).includes(term);
      const rowFilterLabel = formatRequestStatusFilter(row.status);
      const matchesStatus =
        statusFilter === 'All Status' || rowFilterLabel === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  return (
    <PlaceholderPage
      title="Request History"
      description="View the status of every item you've requested."
      sidebarItems={recipientMenuItems}
      sidebarLabel="Recipient Menu">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                kpiIconClasses[card.color]?.bg ?? 'bg-slate-50'
              } ${kpiIconClasses[card.color]?.text ?? 'text-slate-600'}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterIcon className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-700">
              <option>All Status</option>
              <option>Fulfilled</option>
              <option>Pending</option>
              <option>Declined</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Loading requests...
                  </td>
                </tr>
              )}
              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    {rows.length === 0
                      ? 'No requests yet. Browse inventory or submit a request.'
                      : 'No requests match your search or filter.'}
                  </td>
                </tr>
              )}
              {!loading &&
                filteredRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-500">{`REQ-${r.id}`}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {r.requestedItemName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatCategoryLabel(r.category)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatRequestDate(r.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PlaceholderPage>
  );
}
