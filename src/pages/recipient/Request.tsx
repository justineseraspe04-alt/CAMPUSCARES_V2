import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import { recipientMenuItems } from '../../components/dashboard/recipientConfig';
import { InfoIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as recipientApi from '../../api/recipientApi';
import { apiCategoryToFormLabel, mapCategoryToApi } from '../../utils/requestDisplay';
import { useLocation, useNavigate } from 'react-router-dom';

interface RequestLocationState {
  requestedItemName?: string;
  category?: string;
}

export function Request() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prefilled = (location.state as RequestLocationState | null) ?? {};

  const [requestedItemName, setRequestedItemName] = useState('');
  const [category, setCategory] = useState('Books');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (prefilled.requestedItemName) {
      setRequestedItemName(prefilled.requestedItemName);
    }
    if (prefilled.category) {
      setCategory(apiCategoryToFormLabel(prefilled.category));
    }
  }, [prefilled.requestedItemName, prefilled.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to submit a request.' });
      return;
    }
    if (!requestedItemName.trim()) {
      setMessage({ type: 'error', text: 'Requested item name is required.' });
      return;
    }
    if (!category.trim()) {
      setMessage({ type: 'error', text: 'Category is required.' });
      return;
    }
    if (!reason.trim()) {
      setMessage({ type: 'error', text: 'Reason is required.' });
      return;
    }

    const payload: recipientApi.RequestPayload = {
      studentName: user.fullName,
      studentEmail: user.email,
      requestedItemName: requestedItemName.trim(),
      category: mapCategoryToApi(category),
      reason: reason.trim(),
    };

    try {
      setLoading(true);
      await recipientApi.submitRequest(payload);
      setMessage({
        type: 'success',
        text: 'Request submitted successfully and is now pending admin review.',
      });
      setRequestedItemName('');
      setReason('');
      setCategory('Books');
      setTimeout(() => navigate('/recipient/history'), 1000);
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to submit request.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlaceholderPage
      title="Request an Item"
      description="Tell us what you need — we'll match you with available items."
      sidebarItems={recipientMenuItems}
      sidebarLabel="Recipient Menu">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Student Name</label>
                <input
                  type="text"
                  value={user?.fullName || ''}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Student Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Requested Item Name</label>
              <input
                type="text"
                value={requestedItemName}
                onChange={(e) => setRequestedItemName(e.target.value)}
                placeholder="e.g. Scientific Calculator"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none text-slate-700">
                <option>Books</option>
                <option>Clothing</option>
                <option>School Supplies</option>
                <option>Essentials</option>
                <option>Others</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Reason for Request</label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly explain how this item will help you..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none resize-none"
                required
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl border text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-rose-50 border-rose-100 text-rose-700'
                }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition-colors shadow-sm text-lg disabled:opacity-60">
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <InfoIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">How requests work</h3>
          </div>
          <ul className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {[
              { title: 'Submit request', desc: 'Fill out the form with your needs.' },
              { title: 'Admin reviews', desc: 'We match your request with inventory.' },
              { title: 'Pickup', desc: 'Collect your item at the Student Center.' },
            ].map((step, i) => (
              <li key={i} className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-cyan-500 flex items-center justify-center text-cyan-600 font-bold shrink-0 z-10 shadow-sm">
                  {i + 1}
                </div>
                <div className="pt-2">
                  <h4 className="font-bold text-slate-800">{step.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </PlaceholderPage>
  );
}
