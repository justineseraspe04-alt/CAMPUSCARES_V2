import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import { adminMenuItems, adminUser } from '../../components/dashboard/adminConfig';
import {
  SearchIcon,
  FilterIcon,
  PackagePlusIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  EyeIcon
} from 'lucide-react';
import { DonationAdmin, getAllDonations } from '../../api/adminApi';

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

export function Donations() {
  const [donations, setDonations] = useState<DonationAdmin[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const response = await getAllDonations();
        setDonations(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDonations();
  }, []);

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
        categoryFilter === 'All Categories' ||
        item.category.toLowerCase() === categoryFilter.toLowerCase();

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
      sidebarItems={adminMenuItems}
      sidebarLabel="Admin Menu"
      user={adminUser}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4"
          >
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
              <option>All Categories</option>
              <option>Books</option>
              <option>Clothing</option>
              <option>School Supplies</option>
              <option>Essentials</option>
            </select>
          </div>
        </div>

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
                    <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                      <EyeIcon className="w-4 h-4" />
                    </button>
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
      </motion.div>
    </PlaceholderPage>
  );
}
