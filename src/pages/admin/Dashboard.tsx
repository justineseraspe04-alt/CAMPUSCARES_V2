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
  FilterIcon,
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
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { adminMenuItems, adminUser } from '../../components/dashboard/adminConfig';
import {
  DashboardStats,
  DonationAdmin,
  InventoryAdmin,
  StudentRequestAdmin,
  NotificationAdmin,
  getDashboardStats,
  getPendingDonations,
  getInventory,
  getPendingRequests,
  getNotifications,
  approveDonation,
  approveRequest,
  rejectDonation,
  rejectRequest
} from '../../api/adminApi';

const chartData = [
  { name: 'Mon', donations: 45 },
  { name: 'Tue', donations: 52 },
  { name: 'Wed', donations: 38 },
  { name: 'Thu', donations: 65 },
  { name: 'Fri', donations: 48 },
  { name: 'Sat', donations: 25 },
  { name: 'Sun', donations: 30 }
];

const categoryProgress = [
  { name: 'Clothing', value: 45, color: 'bg-sky-500' },
  { name: 'Books', value: 30, color: 'bg-emerald-500' },
  { name: 'School Supplies', value: 15, color: 'bg-amber-500' },
  { name: 'Essentials', value: 8, color: 'bg-rose-500' },
  { name: 'Others', value: 2, color: 'bg-slate-400' }
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

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingDonations, setPendingDonations] = useState<DonationAdmin[]>([]);
  const [inventory, setInventory] = useState<InventoryAdmin[]>([]);
  const [pendingRequests, setPendingRequests] = useState<StudentRequestAdmin[]>([]);
  const [notifications, setNotifications] = useState<NotificationAdmin[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [statsResp, donationsResp, inventoryResp, requestsResp, notificationsResp] = await Promise.all([
          getDashboardStats(),
          getPendingDonations(),
          getInventory(),
          getPendingRequests(),
          getNotifications(adminUser.email)
        ]);

        setStats(statsResp.data);
        setPendingDonations(donationsResp.data);
        setInventory(inventoryResp.data);
        setPendingRequests(requestsResp.data);
        setNotifications(notificationsResp.data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unable to load admin dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const lowStockCount = inventory.filter((item) => item.quantityAvailable <= 5).length;
  const unreadNotifications = notifications.filter((notification) => !notification.read).length;
  const totalDistributedItems = stats?.totalDistributedItems ?? 0;
  const beneficiariesHelped = stats?.beneficiaries ?? 0;
  const totalDonations = stats?.totalDonations ?? 0;
  const approvedDonations = Math.max(0, totalDonations - pendingDonations.length);

  const kpiData = useMemo(
    () => [
      {
        title: 'Total Donations',
        value: totalDonations.toString(),
        icon: PackageIcon,
        color: 'sky',
        trend: '+12.5%',
        trendUp: true
      },
      {
        title: 'Pending Donations',
        value: pendingDonations.length.toString(),
        icon: ClockIcon,
        color: 'amber',
        trend: '+3',
        trendUp: true
      },
      {
        title: 'Approved Donations',
        value: approvedDonations.toString(),
        icon: CheckCircle2Icon,
        color: 'emerald',
        trend: '+8.2%',
        trendUp: true
      },
      {
        title: 'Total Inventory Items',
        value: inventory.length.toString(),
        icon: BoxesIcon,
        color: 'indigo',
        trend: '+45',
        trendUp: true
      },
      {
        title: 'Distributed Items',
        value: totalDistributedItems.toString(),
        icon: HandHeartIcon,
        color: 'cyan',
        trend: '+14.3%',
        trendUp: true
      },
      {
        title: 'Beneficiaries Helped',
        value: beneficiariesHelped.toString(),
        icon: UsersIcon,
        color: 'teal',
        trend: '+22',
        trendUp: true
      },
      {
        title: 'Low Inventory Alerts',
        value: lowStockCount.toString(),
        icon: AlertTriangleIcon,
        color: 'rose',
        trend: '-2',
        trendUp: false
      },
      {
        title: 'Unread Notifications',
        value: unreadNotifications.toString(),
        icon: BellIcon,
        color: 'violet',
        trend: '+5',
        trendUp: true
      }
    ],
    [approvedDonations, inventory.length, lowStockCount, pendingDonations.length, totalDistributedItems, totalDonations, unreadNotifications, beneficiariesHelped]
  );

  const handleApproveDonation = async (id: number) => {
    try {
      await approveDonation(id);
      setPendingDonations((prev) => prev.filter((donation) => donation.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectDonation = async (id: number) => {
    try {
      await rejectDonation(id);
      setPendingDonations((prev) => prev.filter((donation) => donation.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveRequest = async (id: number) => {
    try {
      await approveRequest(id);
      setPendingRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async (id: number) => {
    try {
      await rejectRequest(id);
      setPendingRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout sidebarItems={adminMenuItems} sidebarLabel="Admin Menu" user={adminUser}>
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
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">Welcome back, Admin</h1>
            <p className="text-slate-300 max-w-2xl text-base lg:text-lg">
              Monitor donations, manage inventory, approve student requests, and track the impact of CampusCares — all from one centralized dashboard.
            </p>
          </div>

          <div className="relative z-10 flex lg:flex-col gap-3">
            <button className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/30">
              Review Pending
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <button className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors backdrop-blur-sm">
              View Reports
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{error}</div>
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
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {kpi.trendUp ? '↑' : '↓'} {kpi.trend}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{kpi.value}</h3>
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
            <p className="text-xs text-slate-500 mb-6">Items released this quarter</p>
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#0ea5e9" strokeWidth="10" strokeDasharray="264" strokeDashoffset="79" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">70%</span>
                  <span className="text-xs text-slate-500">complete</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-500"></span> Released</span>
                  <span className="font-bold text-slate-700">{totalDistributedItems}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Remaining</span>
                  <span className="font-bold text-slate-700">{Math.max(0, totalDistributedItems - 675)}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-emerald-600 font-medium">↑ 14% vs last quarter</div>
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
              {categoryProgress.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 truncate">{cat.name}</span>
                      <span className="font-bold text-slate-800 ml-2">{cat.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`${cat.color} h-1.5 rounded-full`} style={{ width: `${cat.value}%` }} />
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
              <button className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1">
                View Report <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="h-64 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="donations" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Donations by Category</h3>
              <div className="space-y-4">
                {categoryProgress.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-600">{cat.name}</span>
                      <span className="text-slate-500">{cat.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${cat.value}%` }} />
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
              <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {pendingDonations.slice(0, 5).map((item) => {
                  const colors = {
                    success: 'bg-emerald-500 ring-emerald-100',
                    info: 'bg-sky-500 ring-sky-100',
                    warning: 'bg-amber-500 ring-amber-100',
                    error: 'bg-rose-500 ring-rose-100'
                  };
                  const status = item.status === 'PENDING' ? 'warning' : item.status === 'APPROVED' ? 'success' : 'info';
                  return (
                    <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 border-white ${colors[status as keyof typeof colors]} ring-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10`} />
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800 text-sm">Pending donation review</span>
                          <span className="text-xs font-medium text-slate-400">{item.dateSubmitted || 'Pending'}</span>
                        </div>
                        <p className="text-xs text-slate-600">{item.itemName} from {item.donorName}</p>
                      </div>
                    </div>
                  );
                })}
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
                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-full">{unreadNotifications} New</span>
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 2).map((notification) => {
                  const isAlert = notification.message.toLowerCase().includes('low inventory');
                  return (
                    <div key={notification.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAlert ? 'bg-rose-50 text-rose-500' : 'bg-sky-50 text-sky-600'}`}>
                        <BellIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{new Date(notification.createdAt).toLocaleString()}</p>
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
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <FilterIcon className="w-4 h-4" /> Filter
            </button>
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
                {pendingDonations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No pending donations found.</td>
                  </tr>
                ) : (
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
                          <button onClick={() => handleApproveDonation(item.id)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-medium hover:bg-emerald-100 transition-colors">Approve</button>
                          <button onClick={() => handleRejectDonation(item.id)} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 font-medium hover:bg-rose-100 transition-colors">Reject</button>
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
              <button className="text-sm font-medium text-sky-600 hover:text-sky-700">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inventory.slice(0, 4).map((item) => (
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
              <button className="text-sm font-medium text-sky-600 hover:text-sky-700">View All</button>
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
                        <button onClick={() => handleApproveRequest(req.id)} className="flex-1 py-2 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors">
                          Approve
                        </button>
                        <button onClick={() => handleRejectRequest(req.id)} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
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
    </DashboardLayout>
  );
}

