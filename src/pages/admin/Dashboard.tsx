import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PackageIcon,
  ClockIcon,
  CheckCircle2Icon,
  BoxesIcon,
  HandHeartIcon,
  UsersIcon,
  AlertTriangleIcon,
  BellIcon,
  QrCodeIcon,
  ArrowRightIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useDashboardProfile } from '../../hooks/useDashboardProfile';
import { useAdminMenuItems } from '../../hooks/useAdminMenuItems';
import { useAdminActions } from '../../hooks/useAdminActions';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import {
  AdminDashboardStats,
  DonationAdmin,
  InventoryAdmin,
  StudentRequestAdmin,
  getAdminDashboardStats,
  approveDonation,
  approveRequest,
  rejectDonation,
  rejectRequest
} from '../../api/adminApi';

const CATEGORY_BAR_COLORS = [
  'bg-sky-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-slate-400',
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
    RELEASED: 'bg-sky-100 text-sky-700 border-sky-200'
  };
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {label}
    </span>
  );
};

type DonationConfirm = { type: 'approve' | 'reject'; id: number; itemName: string } | null;
type RequestConfirm = { type: 'approve' | 'reject'; id: number; itemName: string; studentName: string } | null;

export function Dashboard() {
  const profile = useDashboardProfile();
  const menuItems = useAdminMenuItems();
  const { isBusy, error: actionError, success: actionSuccess, runAction, clearMessages } = useAdminActions();
  const [donationConfirm, setDonationConfirm] = useState<DonationConfirm>(null);
  const [requestConfirm, setRequestConfirm] = useState<RequestConfirm>(null);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const loadDashboard = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const statsResp = await getAdminDashboardStats();
      setStats(statsResp.data ?? null);
    } catch (err) {
      setStats(null);
      setError(err instanceof Error ? err.message : 'Unable to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const pendingDonations = stats?.pendingDonationItems ?? [];
  const pendingRequests = stats?.pendingRequestItems ?? [];
  const inventory = stats?.inventoryPreview ?? [];
  const chartData = stats?.donationActivityByDay ?? [];
  const requestCategories = stats?.requestCategoryBreakdown ?? [];
  const donationCategories = stats?.donationCategoryBreakdown ?? [];
  const recentLogs = stats?.recentLogs ?? [];
  const recentNotifications = stats?.recentNotifications ?? [];

  const kpiData = useMemo(
    () => [
      { title: 'Total Donations', value: String(stats?.totalDonations ?? 0), icon: PackageIcon, color: 'sky' },
      { title: 'Pending Donations', value: String(stats?.pendingDonations ?? 0), icon: ClockIcon, color: 'amber' },
      { title: 'Approved Donations', value: String(stats?.approvedDonations ?? 0), icon: CheckCircle2Icon, color: 'emerald' },
      { title: 'Total Inventory Items', value: String(stats?.totalInventoryItems ?? 0), icon: BoxesIcon, color: 'indigo' },
      { title: 'Distributed Items', value: String(stats?.totalDistributedItems ?? 0), icon: HandHeartIcon, color: 'cyan' },
      { title: 'Beneficiaries Helped', value: String(stats?.beneficiariesHelped ?? 0), icon: UsersIcon, color: 'teal' },
      { title: 'Low Inventory Alerts', value: String(stats?.lowStockItems ?? 0), icon: AlertTriangleIcon, color: 'rose' },
      { title: 'Unread Notifications', value: String(stats?.unreadNotifications ?? 0), icon: BellIcon, color: 'violet' },
    ],
    [stats]
  );

  const distributionProgress = stats?.distributionProgressPercent ?? 0;
  const releasedRequests = stats?.releasedRequests ?? 0;
  const approvedRequests = stats?.approvedRequests ?? 0;

  const handleDonationConfirm = async () => {
    if (!donationConfirm) return;
    const { type, id } = donationConfirm;
    const ok = await runAction(
      `${type}-donation-${id}`,
      async () => {
        if (type === 'approve') await approveDonation(id);
        else await rejectDonation(id);
        await loadDashboard();
      },
      type === 'approve' ? 'Donation approved.' : 'Donation rejected.'
    );
    if (ok) setDonationConfirm(null);
  };

  const handleRequestConfirm = async () => {
    if (!requestConfirm) return;
    const { type, id } = requestConfirm;
    const ok = await runAction(
      `${type}-request-${id}`,
      async () => {
        if (type === 'approve') await approveRequest(id);
        else await rejectRequest(id);
        await loadDashboard();
      },
      type === 'approve' ? 'Request approved.' : 'Request rejected.'
    );
    if (ok) setRequestConfirm(null);
  };

  return (
    <DashboardLayout sidebarItems={menuItems} sidebarLabel="Admin Menu" user={profile}>
      <div className="space-y-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl relative overflow-hidden bg-slate-900 text-white grid grid-cols-1 lg:grid-cols-3 gap-6 p-8"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500 opacity-20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500 opacity-10 rounded-full blur-3xl translate-y-1/3" />

          <div className="relative z-10 lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-4 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              System Online
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
              Welcome back, {profile.name.split(' ')[0] || 'Admin'}
            </h1>
            <p className="text-slate-300 max-w-2xl text-base lg:text-lg">
              Monitor donations, manage inventory, approve student requests, and track the impact of CampusCares — all from one centralized dashboard.
            </p>
          </div>

          <div className="relative z-10 flex lg:flex-col gap-3">
            <Link
              to="/admin/donations/pending"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/30"
            >
              Review Pending
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/admin/logs"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              View Reports
            </Link>
          </div>
        </motion.div>

        {(error || actionError) && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
            {error || actionError}
            {actionError && (
              <button type="button" onClick={clearMessages} className="ml-2 underline text-sm">
                Dismiss
              </button>
            )}
          </div>
        )}

        {actionSuccess && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">
            {actionSuccess}
          </div>
        )}

        {loading && (
          <p className="text-sm text-slate-500">Refreshing dashboard data...</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, i) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all relative overflow-hidden group"
            >
              <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${kpi.color}-100 rounded-full opacity-50 blur-2xl group-hover:opacity-80 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center text-${kpi.color}-600`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">
                  {loading ? '…' : kpi.value}
                </h3>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-1">Distribution Progress</h2>
            <p className="text-xs text-slate-500 mb-6">Approved requests released to students</p>
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="10"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * distributionProgress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">
                    {loading ? '…' : `${distributionProgress}%`}
                  </span>
                  <span className="text-xs text-slate-500">released</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-500"></span> Released requests</span>
                  <span className="font-bold text-slate-700">{loading ? '…' : releasedRequests}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Awaiting release</span>
                  <span className="font-bold text-slate-700">{loading ? '…' : approvedRequests}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                  {loading ? 'Loading…' : `${stats?.totalDistributedItems ?? 0} items distributed total`}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Most Requested Categories</h2>
                <p className="text-xs text-slate-500">Based on student requests in the last 30 days</p>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-sky-50 text-sky-600 rounded-full">Last 30 days</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {loading && <p className="text-sm text-slate-500 col-span-2">Loading categories...</p>}
              {!loading && requestCategories.length === 0 && (
                <p className="text-sm text-slate-500 col-span-2">No student requests yet.</p>
              )}
              {!loading &&
                requestCategories.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 truncate">{cat.name}</span>
                        <span className="font-bold text-slate-800 ml-2">{cat.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`${CATEGORY_BAR_COLORS[i % CATEGORY_BAR_COLORS.length]} h-1.5 rounded-full`}
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Donation Activity</h2>
              <Link to="/admin/donations" className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1">
                View Report <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="h-64 mb-8">
              {loading ? (
                <p className="h-full flex items-center justify-center text-slate-500 text-sm">Loading chart...</p>
              ) : chartData.every((d) => d.donations === 0) ? (
                <p className="h-full flex items-center justify-center text-slate-500 text-sm">No donations in the last 7 days.</p>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="donations" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Donations by Category</h3>
              <div className="space-y-4">
                {donationCategories.length === 0 && !loading && (
                  <p className="text-sm text-slate-500">No donations recorded yet.</p>
                )}
                {donationCategories.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-600">{cat.name}</span>
                      <span className="text-slate-500">{cat.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`${CATEGORY_BAR_COLORS[i % CATEGORY_BAR_COLORS.length]} h-2 rounded-full`}
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Recent Logs</h2>
                <Link to="/admin/logs" className="text-sm font-medium text-sky-600 hover:text-sky-700">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {loading && <p className="text-sm text-slate-500">Loading logs...</p>}
                {!loading && recentLogs.length === 0 && (
                  <p className="text-sm text-slate-500">No transaction logs yet.</p>
                )}
                {!loading &&
                  recentLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="font-bold text-slate-800 text-sm">{log.action}</span>
                        <span className="text-xs text-slate-400 shrink-0">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{log.details}</p>
                    </div>
                  ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-full">
                  {loading ? '…' : stats?.unreadNotifications ?? 0} New
                </span>
              </div>
              <div className="space-y-3">
                {loading && <p className="text-sm text-slate-500">Loading notifications...</p>}
                {!loading && recentNotifications.length === 0 && (
                  <p className="text-sm text-slate-500">No notifications yet.</p>
                )}
                {!loading &&
                  recentNotifications.slice(0, 2).map((notification) => {
                  const isAlert =
                    notification.type === 'ADMIN_LOW_INVENTORY' ||
                    notification.message?.toLowerCase().includes('low inventory');
                  return (
                    <div key={notification.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAlert ? 'bg-rose-50 text-rose-500' : 'bg-sky-50 text-sky-600'}`}>
                        <BellIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{notification.title || notification.message}</p>
                        {notification.message && notification.title !== notification.message && (
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notification.message}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-0.5">
                          {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pending Approvals</h2>
              <p className="text-sm text-slate-500">Review and approve submitted donations.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Donor</th>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading pending donations...</td>
                  </tr>
                )}
                {!loading && pendingDonations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No pending donations found.</td>
                  </tr>
                ) : !loading && (
                  pendingDonations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{item.donorName}</p>
                        <p className="text-xs text-slate-500">DON-{item.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">{item.itemName}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.category}</td>
                      <td className="px-6 py-4 text-slate-600">{item.itemCondition}</td>
                      <td className="px-6 py-4 text-slate-600">{item.dateSubmitted || 'Pending'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              setDonationConfirm({
                                type: 'approve',
                                id: item.id,
                                itemName: item.itemName,
                              })
                            }
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              setDonationConfirm({
                                type: 'reject',
                                id: item.id,
                                itemName: item.itemName,
                              })
                            }
                            className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 font-medium hover:bg-rose-100 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Inventory Overview</h2>
              <Link to="/admin/inventory" className="text-sm font-medium text-sky-600 hover:text-sky-700">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading && <p className="text-slate-500 text-sm col-span-2">Loading inventory...</p>}
              {!loading && inventory.length === 0 && (
                <p className="text-slate-500 text-sm col-span-2">No inventory items yet.</p>
              )}
              {!loading &&
              inventory.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-colors relative group">
                  {item.quantityAvailable <= 5 && (
                    <span className="absolute top-3 right-3 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <BoxesIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.itemName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded-md text-xs">{item.itemCondition}</span>
                    <span className={`font-bold ${item.quantityAvailable <= 5 ? 'text-rose-600' : 'text-slate-700'}`}>Qty: {item.quantityAvailable}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">INV-{item.id}</span>
                    <button className="text-slate-400 hover:text-sky-600 transition-colors">
                      <QrCodeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Student Requests</h2>
              <Link to="/admin/requests" className="text-sm font-medium text-sky-600 hover:text-sky-700">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-500">No pending student requests.</div>
              ) : (
                pendingRequests.slice(0, 3).map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800">{req.studentName}</h4>
                        <p className="text-xs font-medium text-sky-600">
                          {req.requestedItemName} <span className="text-slate-400 font-normal">({req.category})</span>
                        </p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-sm text-slate-600 mb-4 bg-white p-3 rounded-xl border border-slate-100 italic">"{req.reason}"</p>
                    {req.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            setRequestConfirm({
                              type: 'approve',
                              id: req.id,
                              itemName: req.requestedItemName,
                              studentName: req.studentName,
                            })
                          }
                          className="flex-1 py-2 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            setRequestConfirm({
                              type: 'reject',
                              id: req.id,
                              itemName: req.requestedItemName,
                              studentName: req.studentName,
                            })
                          }
                          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                          Deny
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <ConfirmDialog
        open={donationConfirm !== null}
        title={donationConfirm?.type === 'approve' ? 'Approve donation?' : 'Reject donation?'}
        message={
          donationConfirm
            ? `${donationConfirm.type === 'approve' ? 'Approve' : 'Reject'} "${donationConfirm.itemName}"?`
            : ''
        }
        confirmLabel={donationConfirm?.type === 'approve' ? 'Approve' : 'Reject'}
        variant={donationConfirm?.type === 'reject' ? 'danger' : 'primary'}
        loading={isBusy}
        onCancel={() => !isBusy && setDonationConfirm(null)}
        onConfirm={handleDonationConfirm}
      />

      <ConfirmDialog
        open={requestConfirm !== null}
        title={requestConfirm?.type === 'approve' ? 'Approve request?' : 'Reject request?'}
        message={
          requestConfirm
            ? `${requestConfirm.type === 'approve' ? 'Approve' : 'Reject'} ${requestConfirm.studentName}'s request for "${requestConfirm.itemName}"?`
            : ''
        }
        confirmLabel={requestConfirm?.type === 'approve' ? 'Approve' : 'Reject'}
        variant={requestConfirm?.type === 'reject' ? 'danger' : 'primary'}
        loading={isBusy}
        onCancel={() => !isBusy && setRequestConfirm(null)}
        onConfirm={handleRequestConfirm}
      />
    </DashboardLayout>
  );
}

