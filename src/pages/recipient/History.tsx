import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import {
  recipientMenuItems,
  recipientUser } from
  '../../components/dashboard/recipientConfig';
import {
  SearchIcon,
  FilterIcon,
  HandHeartIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon } from
  'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as requestApi from '../../api/requestApi';

const summaryCards = [
  { title: 'Total Requests', value: '—', icon: HandHeartIcon, color: 'slate' },
  { title: 'Fulfilled', value: '—', icon: CheckCircle2Icon, color: 'emerald' },
  { title: 'Pending', value: '—', icon: ClockIcon, color: 'amber' },
  { title: 'Declined', value: '—', icon: XCircleIcon, color: 'rose' },
];

const StatusBadge = ({ status }: { status?: string }) => {
  const map = (s?: string) => {
    if (!s) return 'Pending';
    if (s === 'PENDING') return 'Pending';
    if (s === 'APPROVED' || s === 'RELEASED') return 'Fulfilled';
    if (s === 'REJECTED') return 'Declined';
    return s;
  };
  const label = map(status);
  const styles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Fulfilled: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Declined: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[label] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>{label}</span>
  );
};

export function History() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const resp = await requestApi.getRequestHistory(user.email);
        if (resp && resp.success && Array.isArray(resp.data)) {
          setRows(resp.data);
        } else {
          setRows([]);
        }
      } catch (e) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const total = rows.length;
  const fulfilled = rows.filter(r => r.status === 'APPROVED' || r.status === 'RELEASED').length;
  const pending = rows.filter(r => r.status === 'PENDING').length;
  const declined = rows.filter(r => r.status === 'REJECTED').length;

  const cards = summaryCards.map((c, i) => ({ ...c, value: [total, fulfilled, pending, declined][i] }));

  return (
    <PlaceholderPage title="Request History" description="View the status of every item you've requested." sidebarItems={recipientMenuItems} sidebarLabel="Recipient Menu" user={recipientUser}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-${card.color}-50 flex items-center justify-center text-${card.color}-600`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search requests..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterIcon className="w-5 h-5 text-slate-400" />
            <select className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-700">
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
              {loading && (<tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>)}
              {!loading && rows.length === 0 && (<tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No requests found.</td></tr>)}
              {!loading && rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-500">{`REQ-${r.id}`}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{r.requestedItemName}</td>
                  <td className="px-6 py-4 text-slate-600">{r.category}</td>
                  <td className="px-6 py-4 text-slate-600">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PlaceholderPage>
  );
}
