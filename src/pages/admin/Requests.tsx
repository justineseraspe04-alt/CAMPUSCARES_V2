import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlaceholderPage } from '../PlaceholderPage';
import {
  SearchIcon,
  FilterIcon,
  HandHeartIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  CheckIcon,
  XIcon,
  PackageIcon,
} from 'lucide-react';
import {
  StudentRequestAdmin,
  getAllRequests,
  approveRequest,
  rejectRequest,
} from '../../api/adminApi';
import { useAdminMenuItems } from '../../hooks/useAdminMenuItems';
import { useAdminActions } from '../../hooks/useAdminActions';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';

const statusBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  APPROVED: 'bg-sky-100 text-sky-700 border-sky-200',
  RELEASED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadgeStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}
  >
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>
);

type ConfirmState = {
  type: 'approve' | 'reject';
  request: StudentRequestAdmin;
} | null;

export function Requests() {
  const menuItems = useAdminMenuItems();
  const { isProcessing, isBusy, error, success, runAction, clearMessages } = useAdminActions();

  const [requests, setRequests] = useState<StudentRequestAdmin[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await getAllRequests();
      setRequests(response.data ?? []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const filteredRequests = useMemo(() => {
    const term = search.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesSearch =
        term.length === 0 ||
        request.studentName.toLowerCase().includes(term) ||
        request.requestedItemName.toLowerCase().includes(term) ||
        request.category.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === 'All Status' ||
        request.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const approvedPendingRelease = useMemo(
    () => requests.filter((r) => r.status === 'APPROVED'),
    [requests]
  );

  const summaryCards = useMemo(
    () => [
      { title: 'Total Requests', value: requests.length.toString(), icon: HandHeartIcon, color: 'slate' },
      {
        title: 'Fulfilled',
        value: requests
          .filter((r) => r.status === 'APPROVED' || r.status === 'RELEASED')
          .length.toString(),
        icon: CheckCircle2Icon,
        color: 'emerald',
      },
      {
        title: 'Pending',
        value: requests.filter((r) => r.status === 'PENDING').length.toString(),
        icon: ClockIcon,
        color: 'amber',
      },
      {
        title: 'Declined',
        value: requests.filter((r) => r.status === 'REJECTED').length.toString(),
        icon: XCircleIcon,
        color: 'rose',
      },
    ],
    [requests]
  );

  const handleConfirm = async () => {
    if (!confirm) return;
    const { type, request } = confirm;
    const key = `${type}-request-${request.id}`;
    const ok = await runAction(
      key,
      async () => {
        if (type === 'approve') {
          await approveRequest(request.id);
        } else {
          await rejectRequest(request.id);
        }
        await loadRequests();
      },
      type === 'approve'
        ? `Request for "${request.requestedItemName}" approved.`
        : `Request for "${request.requestedItemName}" rejected.`
    );
    if (ok) {
      setConfirm(null);
    }
  };

  return (
    <PlaceholderPage
      title="Student Requests"
      description="Review and manage requests from students."
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{loading ? '…' : card.value}</p>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {approvedPendingRelease.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-sky-900">
                {approvedPendingRelease.length} approved request(s) ready for release
              </p>
              <p className="text-sm text-sky-700 mt-1">
                Release items from the Distributions page to decrease inventory and notify students.
              </p>
            </div>
            <Link
              to="/admin/distributions"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
            >
              <PackageIcon className="w-4 h-4" />
              Go to Distributions
            </Link>
          </div>
        </motion.div>
      )}

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
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterIcon className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-700"
            >
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Rejected</option>
              <option>Released</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">Loading requests...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Item Requested</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                      No matching requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-500">REQ-{item.id}</td>
                      <td className="px-6 py-4 text-slate-800">{item.studentName}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{item.requestedItemName}</td>
                      <td className="px-6 py-4 text-slate-600">{item.category}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 truncate max-w-[150px]">{item.reason}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => setConfirm({ type: 'approve', request: item })}
                              className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => setConfirm({ type: 'reject', request: item })}
                              className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50"
                              title="Decline"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : item.status === 'APPROVED' ? (
                          <Link
                            to="/admin/distributions"
                            state={{ openReleaseForRequestId: item.id }}
                            className="text-xs font-medium text-sky-600 hover:underline"
                          >
                            Release →
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.type === 'approve' ? 'Approve request?' : 'Reject request?'}
        message={
          confirm
            ? confirm.type === 'approve'
              ? `Approve ${confirm.request.studentName}'s request for "${confirm.request.requestedItemName}"? Inventory is not decreased until release.`
              : `Reject ${confirm.request.studentName}'s request for "${confirm.request.requestedItemName}"?`
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
