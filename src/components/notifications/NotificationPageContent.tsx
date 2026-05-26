import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  MailOpenIcon,
  CheckIcon,
  ListIcon,
} from 'lucide-react';
import {
  getNotificationStats,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  NotificationRecord,
  NotificationStats,
} from '../../api/notificationApi';
import { UserProfile } from '../dashboard/DashboardLayout';
import {
  extractPickupReferenceNumber,
  formatNotificationType,
} from '../../utils/notificationDisplay';
import { PickupReferenceBadge } from './PickupReferenceBadge';

const statusStyles: Record<string, { bg: string; text: string }> = {
  sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-600' },
};

interface NotificationPageContentProps {
  user: UserProfile;
  accent?: 'sky' | 'emerald' | 'cyan';
}

export function NotificationPageContent({ user, accent = 'sky' }: NotificationPageContentProps) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    totalNotifications: 0,
    unreadNotifications: 0,
    readNotifications: 0,
    latestAlert: 'No alerts yet',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listResp, statsResp] = await Promise.all([
        getNotifications(user.email),
        getNotificationStats(user.email),
      ]);
      setNotifications(listResp.data ?? []);
      setStats(
        statsResp.data ?? {
          totalNotifications: 0,
          unreadNotifications: 0,
          readNotifications: 0,
          latestAlert: 'No alerts yet',
        }
      );
    } catch (err) {
      setNotifications([]);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load notifications. Please check backend connection.'
      );
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const markAsRead = async (id: number) => {
    setActionError('');
    setMarkingId(id);
    try {
      await markNotificationAsRead(id, user.email);
      await loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to mark notification as read.');
    } finally {
      setMarkingId(null);
    }
  };

  const markAllAsRead = async () => {
    setActionError('');
    setMarkingAll(true);
    try {
      await markAllNotificationsAsRead(user.email);
      await loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to mark all notifications as read.');
    } finally {
      setMarkingAll(false);
    }
  };

  const style = statusStyles[accent] || statusStyles.sky;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">Stay updated on alerts for {user.email}.</p>
        </div>
        <button
          type="button"
          onClick={markAllAsRead}
          disabled={markingAll || stats.unreadNotifications === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <CheckIcon className="w-4 h-4" />
          {markingAll ? 'Updating...' : 'Mark all as read'}
        </button>
      </div>

      {(error || actionError) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error || actionError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
        >
          <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center ${style.text} mb-4`}>
            <BellIcon className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">
            {loading ? '…' : stats.totalNotifications}
          </h3>
          <p className="text-sm font-medium text-slate-500">Total Notifications</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
            <MailOpenIcon className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">
            {loading ? '…' : stats.unreadNotifications}
          </h3>
          <p className="text-sm font-medium text-slate-500">Unread Notifications</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <CheckCircle2Icon className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">
            {loading ? '…' : stats.readNotifications}
          </h3>
          <p className="text-sm font-medium text-slate-500">Read Notifications</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
            <AlertTriangleIcon className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1 truncate">
            {loading ? '…' : stats.latestAlert}
          </h3>
          <p className="text-sm font-medium text-slate-500">Latest Alert</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <BellIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">All caught up!</h3>
            <p className="text-slate-500">You have no notifications at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => {
              const pickupReference =
                notif.type === 'ITEM_RELEASED'
                  ? extractPickupReferenceNumber(notif.message)
                  : null;

              return (
              <div
                key={notif.id}
                className={`p-6 flex flex-col sm:flex-row sm:items-start gap-4 transition-colors ${
                  notif.read ? 'bg-white' : `${style.bg}/30`
                }`}
              >
                <div
                  className={`${style.bg} ${style.text} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}
                >
                  <ListIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className={`text-base font-bold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notif.title || notif.message}
                    </h4>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-sky-500" />}
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {formatNotificationType(notif.type)}
                    </span>
                  </div>
                  {notif.title && notif.message && notif.title !== notif.message && (
                    <p className="text-sm text-slate-600 mb-1">{notif.message}</p>
                  )}
                  {pickupReference && (
                    <PickupReferenceBadge referenceNumber={pickupReference} accent={accent} />
                  )}
                  <p className="text-xs font-medium text-slate-400 mt-2">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                {!notif.read && (
                  <button
                    type="button"
                    disabled={markingId !== null || markingAll}
                    onClick={() => markAsRead(notif.id)}
                    className={`mt-2 sm:mt-0 text-sm font-medium whitespace-nowrap disabled:opacity-50 ${
                      accent === 'emerald'
                        ? 'text-emerald-600 hover:text-emerald-700'
                        : accent === 'cyan'
                          ? 'text-cyan-600 hover:text-cyan-700'
                          : 'text-sky-600 hover:text-sky-700'
                    }`}
                  >
                    {markingId === notif.id ? 'Saving...' : 'Mark as read'}
                  </button>
                )}
              </div>
            );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
