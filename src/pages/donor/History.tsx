import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import { donorMenuItems } from '../../components/dashboard/donorConfig';
import {
  SearchIcon,
  FilterIcon,
  PackagePlusIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as donorApi from '../../api/donorApi';
import {
  formatCategoryLabel,
  formatConditionLabel,
  formatStatusLabel,
} from '../../utils/donationDisplay';
import { kpiIconClasses } from '../../utils/tailwindClassMaps';

const StatusBadge = ({ status }: { status: string }) => {
  const label = formatStatusLabel(status);
  const styles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Rejected: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[label] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {label}
    </span>
  );
};

export function History() {
  const { user } = useAuth();
  const [rows, setRows] = useState<donorApi.DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const loadHistory = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError('');
    try {
      const response = await donorApi.getDonationHistory(user.email);
      setRows(response.data ?? []);
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : 'Failed to load donation history.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const summary = useMemo(() => {
    const total = rows.length;
    const approved = rows.filter((r) => r.status === 'APPROVED').length;
    const pending = rows.filter((r) => r.status === 'PENDING').length;
    const rejected = rows.filter((r) => r.status === 'REJECTED').length;
    return { total, approved, pending, rejected };
  }, [rows]);

  const summaryCards = [
    { title: 'Total', value: summary.total, icon: PackagePlusIcon, color: 'slate' },
    { title: 'Approved', value: summary.approved, icon: CheckCircle2Icon, color: 'emerald' },
    { title: 'Pending', value: summary.pending, icon: ClockIcon, color: 'amber' },
    { title: 'Rejected', value: summary.rejected, icon: XCircleIcon, color: 'rose' },
  ];

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        term.length === 0 ||
        row.itemName.toLowerCase().includes(term) ||
        row.category.toLowerCase().includes(term) ||
        String(row.id).includes(term);
      const matchesStatus =
        statusFilter === 'All Status' ||
        formatStatusLabel(row.status).toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  return (
    <PlaceholderPage
      title="Donation History"
      description="Track every item you've contributed to the community."
      sidebarItems={donorMenuItems}
      sidebarLabel="Donor Menu">
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
              placeholder="Search donations..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterIcon className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Donation ID</th>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Loading donations...
                  </td>
                </tr>
              )}
              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    {rows.length === 0
                      ? 'No donations yet. Submit your first donation to get started.'
                      : 'No donations match your search or filter.'}
                  </td>
                </tr>
              )}
              {!loading &&
                filteredRows.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-500">DON-{item.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.itemName}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatCategoryLabel(item.category)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatConditionLabel(item.itemCondition)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.quantity}</td>
                    <td className="px-6 py-4 text-slate-600">{item.dateSubmitted}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
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
