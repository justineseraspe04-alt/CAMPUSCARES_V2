import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  BoxesIcon,
  HandHeartIcon,
  ClockIcon,
  SparklesIcon,
  BellIcon,
  CheckCircle2Icon,
  PackageIcon,
  XCircleIcon,
  ArrowRightIcon,
  GraduationCapIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { recipientMenuItems } from '../../components/dashboard/recipientConfig';
import { useDashboardProfile } from '../../hooks/useDashboardProfile';
import { useAuth } from '../../hooks/useAuth';
import * as recipientApi from '../../api/recipientApi';
import { InventoryItem } from '../../api/inventoryApi';
import {
  formatCategoryLabel,
  formatRequestDate,
  formatRequestStatusLabel,
} from '../../utils/requestDisplay';

const StatusBadge = ({ status }: { status: string }) => {
  const label = formatRequestStatusLabel(status);
  const styles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Released: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Declined: 'bg-rose-100 text-rose-700 border-rose-200',
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
  const navigate = useNavigate();

  const [stats, setStats] = useState<recipientApi.RecipientDashboardStats | null>(null);
  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([]);
  const [recentRequests, setRecentRequests] = useState<recipientApi.StudentRequestRecord[]>([]);
  const [recommendations, setRecommendations] = useState<recipientApi.RecommendationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError('');
    try {
      const [statsResp, inventoryResp, historyResp, recsResp] = await Promise.all([
        recipientApi.getRecipientDashboardStats(user.email),
        recipientApi.getAllInventory(),
        recipientApi.getRequestHistory(user.email),
        recipientApi.getRecommendations(user.email),
      ]);

      setStats(statsResp.data);
      setUnreadCount(statsResp.data?.unreadNotifications ?? 0);
      const available = (inventoryResp.data ?? []).filter((i) => i.quantityAvailable > 0);
      setAvailableItems(available.slice(0, 4));
      setRecentRequests((historyResp.data ?? []).slice(0, 5));
      setRecommendations((recsResp.data ?? []).slice(0, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
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
        { title: 'Available Items', value: '—', icon: BoxesIcon, color: 'sky' },
        { title: 'Pending Requests', value: '—', icon: ClockIcon, color: 'amber' },
        { title: 'Approved Requests', value: '—', icon: CheckCircle2Icon, color: 'emerald' },
        { title: 'Released Items', value: '—', icon: PackageIcon, color: 'indigo' },
        { title: 'Rejected Requests', value: '—', icon: XCircleIcon, color: 'rose' },
      ];
    }
    return [
      {
        title: 'Available Items',
        value: String(stats.availableItemsCount),
        icon: BoxesIcon,
        color: 'sky',
      },
      {
        title: 'Pending Requests',
        value: String(stats.pendingRequests),
        icon: ClockIcon,
        color: 'amber',
      },
      {
        title: 'Approved Requests',
        value: String(stats.approvedRequests),
        icon: CheckCircle2Icon,
        color: 'emerald',
      },
      {
        title: 'Released Items',
        value: String(stats.releasedRequests),
        icon: PackageIcon,
        color: 'indigo',
      },
      {
        title: 'Rejected Requests',
        value: String(stats.rejectedRequests),
        icon: XCircleIcon,
        color: 'rose',
      },
    ];
  }, [stats]);

  const firstName = profile.name.split(' ')[0] || 'Student';

  const handleRequestItem = (item: { itemName: string; category: string }) => {
    navigate('/recipient/request', {
      state: { requestedItemName: item.itemName, category: item.category },
    });
  };

  return (
    <DashboardLayout sidebarItems={recipientMenuItems} sidebarLabel="Recipient Menu" user={profile}>
      <div className="space-y-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl relative overflow-hidden bg-slate-900 text-white grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 opacity-20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="relative z-10 lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-medium mb-4">
              <GraduationCapIcon className="w-3 h-3" />
              Student support portal
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
              Welcome, {firstName}
            </h1>
            <p className="text-slate-300 max-w-2xl text-base lg:text-lg">
              Browse available campus items, submit requests, and track approvals in one place.
            </p>
          </div>
          <div className="relative z-10 flex lg:flex-col gap-3">
            <Link
              to="/recipient/inventory"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors">
              Browse Items
            </Link>
            <Link
              to="/recipient/request"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors">
              Request Item
            </Link>
          </div>
        </motion.div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 flex flex-col gap-3">
            <Link
              to="/recipient/inventory"
              className="flex items-center justify-between p-4 rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700 transition-colors group">
              <div className="flex items-center gap-3">
                <BoxesIcon className="w-5 h-5" />
                <span className="font-medium">Browse Available Items</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/recipient/request"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <HandHeartIcon className="w-5 h-5 text-cyan-600" />
                <span className="font-medium text-slate-700">Submit New Request</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/recipient/recommendations"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-5 h-5 text-cyan-600" />
                <span className="font-medium text-slate-700">AI Recommendations</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/recipient/notifications"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <BellIcon className="w-5 h-5 text-slate-400" />
                <span className="font-medium text-slate-700">Notifications</span>
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
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <LayoutDashboardIcon className="w-5 h-5 text-slate-400" />
                <span className="font-medium text-slate-700">Back to Home</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Support Tips</h2>
            <div className="space-y-3">
              {[
                'Request only what you need to ensure fair distribution.',
                'Check item availability regularly as inventory updates daily.',
                'Wait for admin approval before attempting pickup.',
                'Claim released items on time to avoid cancellation.',
              ].map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700">
                  <span className="text-cyan-600 font-bold">{i + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Available Items</h2>
              <Link to="/recipient/inventory" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
                View all
              </Link>
            </div>
            {loading ? (
              <p className="p-6 text-slate-500 text-sm">Loading...</p>
            ) : availableItems.length === 0 ? (
              <p className="p-6 text-slate-500 text-sm">No items available right now.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {availableItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{item.itemName}</p>
                      <p className="text-xs text-slate-500">
                        {formatCategoryLabel(item.category)} · {item.quantityAvailable} available
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRequestItem(item)}
                      className="shrink-0 text-xs font-medium text-cyan-600 hover:text-cyan-700 px-3 py-1.5 rounded-lg bg-cyan-50">
                      Request
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Recommendations</h2>
              <Link
                to="/recipient/recommendations"
                className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
                See more
              </Link>
            </div>
            {loading ? (
              <p className="p-6 text-slate-500 text-sm">Loading...</p>
            ) : recommendations.length === 0 ? (
              <p className="p-6 text-slate-500 text-sm">No recommendations yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 hover:bg-slate-50/50">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <p className="font-medium text-slate-800">{rec.itemName}</p>
                      <span className="text-xs font-bold text-emerald-600">{rec.matchPercent}%</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{rec.reason}</p>
                    <button
                      type="button"
                      onClick={() => handleRequestItem(rec)}
                      className="text-xs font-medium text-cyan-600 hover:underline">
                      Request now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Recent Requests</h2>
            <Link to="/recipient/history" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                )}
                {!loading && recentRequests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No requests yet.{' '}
                      <Link to="/recipient/request" className="text-cyan-600 font-medium hover:underline">
                        Submit a request
                      </Link>
                    </td>
                  </tr>
                )}
                {!loading &&
                  recentRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-800">{r.requestedItemName}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatCategoryLabel(r.category)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{formatRequestDate(r.createdAt)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={r.status} />
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
