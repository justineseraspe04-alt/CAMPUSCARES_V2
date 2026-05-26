import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  PackagePlusIcon,
  ClockIcon,
  BellIcon,
  CheckCircle2Icon,
  XCircleIcon,
  UsersIcon,
  LeafIcon,
  AwardIcon,
  ArrowRightIcon,
  HeartIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { donorMenuItems } from '../../components/dashboard/donorConfig';
import { useDashboardProfile } from '../../hooks/useDashboardProfile';
import { useAuth } from '../../hooks/useAuth';
import * as donorApi from '../../api/donorApi';
import {
  formatCategoryLabel,
  formatConditionLabel,
  formatStatusLabel,
} from '../../utils/donationDisplay';

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

export function Dashboard() {
  const profile = useDashboardProfile();
  const { user } = useAuth();
  const [stats, setStats] = useState<donorApi.DonorDashboardStats | null>(null);
  const [recentDonations, setRecentDonations] = useState<donorApi.DonationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError('');
    try {
      const [statsResp, historyResp] = await Promise.all([
        donorApi.getDonorDashboardStats(user.email),
        donorApi.getDonationHistory(user.email),
      ]);
      setStats(statsResp.data);
      setRecentDonations((historyResp.data ?? []).slice(0, 5));
      setUnreadCount(statsResp.data?.unreadNotifications ?? 0);
    } catch (err) {
      setStats(null);
      setRecentDonations([]);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const kpiData = useMemo(() => {
    if (!stats) {
      return [
        { title: 'Total Donations Submitted', value: '—', icon: PackagePlusIcon, color: 'emerald' },
        { title: 'Approved Donations', value: '—', icon: CheckCircle2Icon, color: 'sky' },
        { title: 'Pending Donations', value: '—', icon: ClockIcon, color: 'amber' },
        { title: 'Rejected Donations', value: '—', icon: XCircleIcon, color: 'rose' },
        { title: 'Students Helped', value: '—', icon: UsersIcon, color: 'cyan' },
        { title: 'Items Reused', value: '—', icon: LeafIcon, color: 'emerald' },
      ];
    }
    return [
      {
        title: 'Total Donations Submitted',
        value: String(stats.totalDonations),
        icon: PackagePlusIcon,
        color: 'emerald',
      },
      {
        title: 'Approved Donations',
        value: String(stats.approvedDonations),
        icon: CheckCircle2Icon,
        color: 'sky',
      },
      {
        title: 'Pending Donations',
        value: String(stats.pendingDonations),
        icon: ClockIcon,
        color: 'amber',
      },
      {
        title: 'Rejected Donations',
        value: String(stats.rejectedDonations),
        icon: XCircleIcon,
        color: 'rose',
      },
      {
        title: 'Students Helped',
        value: String(stats.studentsHelped),
        icon: UsersIcon,
        color: 'cyan',
      },
      {
        title: 'Items Reused',
        value: String(stats.itemsReused),
        icon: LeafIcon,
        color: 'emerald',
      },
    ];
  }, [stats]);

  const contributionScore =
    stats && stats.totalDonations > 0
      ? Math.round((stats.approvedDonations / stats.totalDonations) * 100)
      : 0;

  const firstName = profile.name.split(' ')[0] || 'Donor';

  return (
    <DashboardLayout sidebarItems={donorMenuItems} sidebarLabel="Donor Menu" user={profile}>
      <div className="space-y-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl relative overflow-hidden bg-slate-900 text-white grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500 opacity-10 rounded-full blur-3xl translate-y-1/3" />

          <div className="relative z-10 lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-sm">
              <HeartIcon className="w-3 h-3 fill-emerald-300" />
              Thank you for giving back
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
              Welcome, {firstName}
            </h1>
            <p className="text-slate-300 max-w-2xl text-base lg:text-lg">
              Thank you for helping students through sustainable campus giving.
            </p>
          </div>

          <div className="relative z-10 flex lg:flex-col gap-3">
            <Link
              to="/donor/donate"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/30">
              <PackagePlusIcon className="w-4 h-4" />
              Submit New Donation
            </Link>
            <Link
              to="/donor/history"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors backdrop-blur-sm">
              View History
            </Link>
          </div>
        </motion.div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {kpiData.map((kpi, i) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div
                  className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center text-${kpi.color}-600 mb-4`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-1">
                  {loading ? '…' : kpi.value}
                </h3>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3">
            <Link
              to="/donor/donate"
              className="flex items-center justify-between p-4 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 group">
              <div className="flex items-center gap-3">
                <PackagePlusIcon className="w-5 h-5" />
                <span className="font-medium">Submit New Donation</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/donor/history"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-slate-400" />
                <span className="font-medium">View Donation History</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/donor/notifications"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <BellIcon className="w-5 h-5 text-slate-400" />
                <span className="font-medium">View Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link
              to="/"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <LayoutDashboardIcon className="w-5 h-5 text-slate-400" />
                <span className="font-medium">Back to Home</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Ready to donate?</h2>
              <p className="text-slate-600 text-sm max-w-lg">
                Submit items for admin review. Approved donations are added to campus inventory for
                students in need.
              </p>
            </div>
            <Link
              to="/donor/donate"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shrink-0">
              <PackagePlusIcon className="w-4 h-4" />
              Submit Donation
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Your Impact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                  <LeafIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {loading ? '…' : stats?.itemsReused ?? 0}
                  </p>
                  <p className="text-sm font-medium text-slate-600">Items Reused</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2 relative overflow-hidden">
                <AwardIcon className="w-16 h-16 absolute -right-2 -bottom-2 text-white opacity-10" />
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-300 shadow-sm backdrop-blur-sm relative z-10">
                  <AwardIcon className="w-5 h-5" />
                </div>
                <div className="relative z-10">
                  <p className="text-2xl font-bold text-white">
                    {loading ? '…' : `${contributionScore}%`}
                  </p>
                  <p className="text-sm font-medium text-slate-300">Approval Rate</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-100 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-cyan-600 shadow-sm">
                  <PackagePlusIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800 leading-tight">
                    {loading
                      ? '…'
                      : formatCategoryLabel(stats?.mostDonatedCategory ?? '—')}
                  </p>
                  <p className="text-sm font-medium text-slate-600">Most Donated Category</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm">
                  <ClockIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800 leading-tight truncate">
                    {loading ? '…' : stats?.lastDonationItemName ?? '—'}
                  </p>
                  <p className="text-sm font-medium text-slate-600">
                    Last Donation
                    {!loading && stats?.lastDonationDateSubmitted
                      ? ` · ${stats.lastDonationDateSubmitted}`
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          id="history"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Recent Donations</h2>
            <Link
              to="/donor/history"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Date Submitted</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Loading donations...
                    </td>
                  </tr>
                )}
                {!loading && recentDonations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No donations yet.{' '}
                      <Link to="/donor/donate" className="text-emerald-600 font-medium hover:underline">
                        Submit your first donation
                      </Link>
                    </td>
                  </tr>
                )}
                {!loading &&
                  recentDonations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
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
      </div>
    </DashboardLayout>
  );
}
