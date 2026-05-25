import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import { adminMenuItems, adminUser } from '../../components/dashboard/adminConfig';
import {
  ClockIcon,
  ActivityIcon,
  CheckCircle2Icon,
  XIcon,
  CheckIcon
} from 'lucide-react';
import {
  DonationAdmin,
  getAllDonations,
  getPendingDonations,
  approveDonation,
  rejectDonation
} from '../../api/adminApi';

const summaryIconClasses: Record<string, string> = {
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  emerald: 'bg-emerald-50 text-emerald-600'
};

export function PendingDonations() {
  const [pendingDonations, setPendingDonations] = useState<DonationAdmin[]>([]);
  const [allDonations, setAllDonations] = useState<DonationAdmin[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pendingResp, allResp] = await Promise.all([getPendingDonations(), getAllDonations()]);
        setPendingDonations(pendingResp.data);
        setAllDonations(allResp.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const approvedCount = useMemo(
    () => allDonations.filter((item) => item.status === 'APPROVED').length,
    [allDonations]
  );

  const approvalRate = useMemo(() => {
    if (allDonations.length === 0) return '0%';
    return `${Math.round((approvedCount / allDonations.length) * 100)}%`;
  }, [allDonations.length, approvedCount]);

  const summaryCards = [
    {
      title: 'Pending',
      value: pendingDonations.length.toString(),
      icon: ClockIcon,
      color: 'amber'
    },
    {
      title: 'Avg Review Time',
      value: '1.4 days',
      icon: ActivityIcon,
      color: 'sky'
    },
    {
      title: 'Approval Rate',
      value: approvalRate,
      icon: CheckCircle2Icon,
      color: 'emerald'
    }
  ];

  const handleApprove = async (donationId: number) => {
    try {
      await approveDonation(donationId);
      setPendingDonations((prev) => prev.filter((donation) => donation.id !== donationId));
      setAllDonations((prev) => prev.map((donation) => (donation.id === donationId ? { ...donation, status: 'APPROVED' } : donation)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (donationId: number) => {
    try {
      await rejectDonation(donationId);
      setPendingDonations((prev) => prev.filter((donation) => donation.id !== donationId));
      setAllDonations((prev) => prev.map((donation) => (donation.id === donationId ? { ...donation, status: 'REJECTED' } : donation)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PlaceholderPage
      title="Pending Approvals"
      description="Review donations awaiting your approval."
      sidebarItems={adminMenuItems}
      sidebarLabel="Admin Menu"
      user={adminUser}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl ${summaryIconClasses[card.color]} flex items-center justify-center`}>
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
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingDonations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No pending donations available.
                  </td>
                </tr>
              ) : (
                pendingDonations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-500">DON-{item.id}</td>
                    <td className="px-6 py-4 text-slate-800">{item.donorName}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.itemName}</td>
                    <td className="px-6 py-4 text-slate-600">{item.category}</td>
                    <td className="px-6 py-4 text-slate-600">{item.itemCondition}</td>
                    <td className="px-6 py-4 text-slate-600">{item.quantity}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(item.dateSubmitted).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          title="Approve"
                          className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          title="Reject"
                          className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          <XIcon className="w-4 h-4" />
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
    </PlaceholderPage>
  );
}
