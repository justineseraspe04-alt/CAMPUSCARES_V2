import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import {
  ClockIcon,
  CheckCircle2Icon,
  XIcon,
  CheckIcon,
} from 'lucide-react';
import {
  DonationAdmin,
  getAllDonations,
  getPendingDonations,
  approveDonation,
  rejectDonation,
} from '../../api/adminApi';
import { useAdminMenuItems } from '../../hooks/useAdminMenuItems';
import { useAdminActions } from '../../hooks/useAdminActions';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';

const summaryIconClasses: Record<string, string> = {
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

type ConfirmState = {
  type: 'approve' | 'reject';
  donation: DonationAdmin;
} | null;

export function PendingDonations() {
  const menuItems = useAdminMenuItems();
  const { isProcessing, isBusy, error, success, runAction, clearMessages } = useAdminActions();

  const [pendingDonations, setPendingDonations] = useState<DonationAdmin[]>([]);
  const [allDonations, setAllDonations] = useState<DonationAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [pendingResp, allResp] = await Promise.all([getPendingDonations(), getAllDonations()]);
      setPendingDonations(pendingResp.data ?? []);
      setAllDonations(allResp.data ?? []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load donations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const approvedCount = useMemo(
    () => allDonations.filter((item) => item.status === 'APPROVED').length,
    [allDonations]
  );

  const approvalRate = useMemo(() => {
    if (allDonations.length === 0) return '0%';
    return `${Math.round((approvedCount / allDonations.length) * 100)}%`;
  }, [allDonations.length, approvedCount]);

  const summaryCards = [
    { title: 'Pending', value: pendingDonations.length.toString(), icon: ClockIcon, color: 'amber' },
    { title: 'Approval Rate', value: approvalRate, icon: CheckCircle2Icon, color: 'emerald' },
  ];

  const handleConfirm = async () => {
    if (!confirm) return;
    const { type, donation } = confirm;
    const key = `${type}-donation-${donation.id}`;
    const ok = await runAction(
      key,
      async () => {
        if (type === 'approve') {
          await approveDonation(donation.id);
        } else {
          await rejectDonation(donation.id);
        }
        await loadData();
      },
      type === 'approve'
        ? `Donation "${donation.itemName}" approved and added to inventory.`
        : `Donation "${donation.itemName}" rejected.`
    );
    if (ok) {
      setConfirm(null);
    }
  };

  return (
    <PlaceholderPage
      title="Pending Approvals"
      description="Review donations awaiting your approval."
      sidebarItems={menuItems}
      sidebarLabel="Admin Menu"
    >
      {(error || success || loadError) && (
        <div className="space-y-3 mb-6">
          {loadError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {loadError}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
              <button type="button" onClick={clearMessages} className="ml-2 underline">
                Dismiss
              </button>
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl ${summaryIconClasses[card.color]} flex items-center justify-center`}
            >
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{loading ? '…' : card.value}</p>
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
        {loading ? (
          <p className="p-8 text-center text-slate-500">Loading pending donations...</p>
        ) : (
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
                  pendingDonations.map((item) => {
                    const approveKey = `approve-donation-${item.id}`;
                    const rejectKey = `reject-donation-${item.id}`;
                    const busy = isProcessing(approveKey) || isProcessing(rejectKey);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-500">DON-{item.id}</td>
                        <td className="px-6 py-4 text-slate-800">{item.donorName}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">{item.itemName}</td>
                        <td className="px-6 py-4 text-slate-600">{item.category}</td>
                        <td className="px-6 py-4 text-slate-600">{item.itemCondition}</td>
                        <td className="px-6 py-4 text-slate-600">{item.quantity}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {item.dateSubmitted
                            ? new Date(item.dateSubmitted).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => setConfirm({ type: 'approve', donation: item })}
                              title="Approve"
                              className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => setConfirm({ type: 'reject', donation: item })}
                              title="Reject"
                              className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                          {busy && (
                            <p className="text-xs text-slate-400 mt-1">Processing...</p>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.type === 'approve' ? 'Approve donation?' : 'Reject donation?'}
        message={
          confirm
            ? confirm.type === 'approve'
              ? `Approve "${confirm.donation.itemName}" from ${confirm.donation.donorName}? This will add ${confirm.donation.quantity} unit(s) to inventory.`
              : `Reject "${confirm.donation.itemName}" from ${confirm.donation.donorName}? Inventory will not be updated.`
            : ''
        }
        confirmLabel={confirm?.type === 'approve' ? 'Approve' : 'Reject'}
        variant={confirm?.type === 'reject' ? 'danger' : 'primary'}
        loading={isBusy}
        onCancel={() => !isBusy && setConfirm(null)}
        onConfirm={handleConfirm}
      />
    </PlaceholderPage>
  );
}
