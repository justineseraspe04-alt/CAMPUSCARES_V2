import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlaceholderPage } from '../PlaceholderPage';
import { recipientMenuItems } from '../../components/dashboard/recipientConfig';
import { SearchIcon, FilterIcon, PackageIcon } from 'lucide-react';
import * as recipientApi from '../../api/recipientApi';
import { InventoryItem } from '../../api/inventoryApi';
import { formatCategoryLabel, formatConditionLabel } from '../../utils/requestDisplay';

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: '' },
  { label: 'Books', value: 'BOOKS' },
  { label: 'Clothing', value: 'CLOTHING' },
  { label: 'School Supplies', value: 'SCHOOL_SUPPLIES' },
  { label: 'Essentials', value: 'ESSENTIALS' },
  { label: 'Other', value: 'OTHER' },
];

export function Inventory() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInventory = useCallback(async (keyword: string, category: string) => {
    setLoading(true);
    setError('');
    try {
      const trimmed = keyword.trim();
      let response;
      if (trimmed) {
        response = await recipientApi.searchInventory(trimmed);
      } else if (category) {
        response = await recipientApi.getInventoryByCategory(category);
      } else {
        response = await recipientApi.getAllInventory();
      }
      let list = response.data ?? [];
      if (category && trimmed) {
        list = list.filter(
          (item) => item.category.toUpperCase() === category.toUpperCase()
        );
      }
      const available = list.filter((item) => item.quantityAvailable > 0);
      setItems(available);
    } catch (err) {
      setItems([]);
      setError(err instanceof Error ? err.message : 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory('', '');
  }, [loadInventory]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadInventory(search, categoryFilter);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search, categoryFilter, loadInventory]);

  const handleRequest = (item: InventoryItem) => {
    navigate('/recipient/request', {
      state: {
        requestedItemName: item.itemName,
        category: item.category,
      },
    });
  };

  const displayItems = useMemo(() => items, [items]);

  return (
    <PlaceholderPage
      title="Available Items"
      description="Browse items currently available for request."
      sidebarItems={recipientMenuItems}
      sidebarLabel="Recipient Menu">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search available items..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <FilterIcon className="w-5 h-5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-700">
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 text-slate-500">Loading available items...</div>
      )}

      {!loading && displayItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <PackageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No items available right now.</p>
          <p className="text-sm text-slate-500 mt-1">Check back later or try a different search.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {!loading &&
          displayItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4">
                <PackageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{item.itemName}</h3>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {formatCategoryLabel(item.category)}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-600 border border-sky-100">
                  {formatConditionLabel(item.itemCondition)}
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-bold text-slate-800">{item.quantityAvailable}</span>
                  <span className="text-slate-500 ml-1">available</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRequest(item)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition-colors shadow-sm shadow-cyan-200">
                  Request
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </PlaceholderPage>
  );
}
