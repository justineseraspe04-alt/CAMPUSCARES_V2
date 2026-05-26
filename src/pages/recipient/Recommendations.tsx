import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlaceholderPage } from '../PlaceholderPage';
import { recipientMenuItems } from '../../components/dashboard/recipientConfig';
import { SparklesIcon, PackageIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  getRecommendationsForStudent,
  type RecommendationRecord,
} from '../../api/recommendationApi';
import { formatCategoryLabel } from '../../utils/requestDisplay';

export function Recommendations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<RecommendationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecommendations = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError('');
    try {
      const response = await getRecommendationsForStudent(user.email);
      setRecommendations(response.data ?? []);
    } catch (err) {
      setRecommendations([]);
      setError(err instanceof Error ? err.message : 'Failed to load recommendations.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const handleRequestNow = (item: RecommendationRecord) => {
    navigate('/recipient/request', {
      state: {
        requestedItemName: item.itemName,
        category: item.category,
      },
    });
  };

  const displayReason = (item: RecommendationRecord) =>
    item.enhancedReason?.trim() || item.reason;

  return (
    <PlaceholderPage
      title="AI Recommendations"
      description="Personalized items we think you'll find useful."
      sidebarItems={recipientMenuItems}
      sidebarLabel="Recipient Menu">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan-500 to-sky-500 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-cyan-500/20 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
          <SparklesIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">How Recommendations Work</h2>
          <p className="text-cyan-50 max-w-2xl">
            Suggestions are based on your past request categories, item keywords, and what is
            currently available in campus inventory.
          </p>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => loadRecommendations()}
            className="shrink-0 rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 transition-colors">
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-slate-500">Loading recommendations...</div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <PackageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            No recommendations available yet. Try browsing available items or submit a request first.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          recommendations.map((item, i) => (
            <motion.div
              key={item.inventoryItemId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                {item.matchPercentage}% Match
              </div>

              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4">
                <PackageIcon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1 pr-16">{item.itemName}</h3>
              <p className="text-xs text-slate-500 mb-2">{formatCategoryLabel(item.category)}</p>
              <p className="text-sm text-slate-500 mb-6 flex-1">{displayReason(item)}</p>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleRequestNow(item)}
                  className="w-full py-2.5 rounded-xl bg-cyan-50 text-cyan-700 font-medium hover:bg-cyan-100 transition-colors">
                  Request Now
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </PlaceholderPage>
  );
}
