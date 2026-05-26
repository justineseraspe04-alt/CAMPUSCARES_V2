import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangleIcon, XIcon } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmClasses =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700'
      : 'bg-sky-600 hover:bg-sky-700';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={loading ? undefined : onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    variant === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'
                  }`}
                >
                  <AlertTriangleIcon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={onCancel}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-50"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={onCancel}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={onConfirm}
                className={`px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-60 ${confirmClasses}`}
              >
                {loading ? 'Processing...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
