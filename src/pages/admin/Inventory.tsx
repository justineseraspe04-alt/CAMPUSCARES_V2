import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BoxesIcon, CheckCircle2Icon, AlertTriangleIcon, QrCodeIcon, SearchIcon, FilterIcon, XIcon } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAdminMenuItems } from '../../hooks/useAdminMenuItems';
import { useDashboardProfile } from '../../hooks/useDashboardProfile';
import {
  getInventory,
  getInventoryByCategory,
  getInventoryStats,
  InventoryAdmin,
  InventoryStats,
  searchInventory,
} from '../../api/adminApi';

const categoryColors: Record<string, string> = {
  CLOTHING: 'bg-sky-500',
  BOOKS: 'bg-emerald-500',
  SCHOOL_SUPPLIES: 'bg-amber-500',
  ESSENTIALS: 'bg-rose-500',
  OTHER: 'bg-slate-500',
  default: 'bg-slate-500',
};

const categoryOptions = [
  { label: 'All Categories', value: '' },
  { label: 'Clothing', value: 'CLOTHING' },
  { label: 'Books', value: 'BOOKS' },
  { label: 'School Supplies', value: 'SCHOOL_SUPPLIES' },
  { label: 'Essentials', value: 'ESSENTIALS' },
  { label: 'Other', value: 'OTHER' },
];

function formatLabel(value: string) {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Inventory() {
  const profile = useDashboardProfile();
  const menuItems = useAdminMenuItems();
  const [inventory, setInventory] = useState<InventoryAdmin[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    availableItems: 0,
    lowStockItems: 0,
    qrTrackedItems: 0,
  });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    const response = await getInventoryStats();
    setStats(response.data);
  }, []);

  const loadInventory = useCallback(async (keyword: string, category: string) => {
    setLoading(true);
    setError('');
    try {
      const trimmedKeyword = keyword.trim();
      let response;

      if (trimmedKeyword) {
        response = await searchInventory(trimmedKeyword);
      } else if (category) {
        response = await getInventoryByCategory(category);
      } else {
        response = await getInventory();
      }

      let list = response.data ?? [];
      if (category && trimmedKeyword) {
        list = list.filter(
          (item) => item.category.toUpperCase() === category.toUpperCase()
        );
      }
      setInventory(list);
      await loadStats();
    } catch (err) {
      setInventory([]);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load inventory. Please check backend connection.'
      );
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  useEffect(() => {
    const delay = search.trim() || categoryFilter ? 350 : 0;
    const timer = window.setTimeout(() => {
      loadInventory(search, categoryFilter);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [search, categoryFilter, loadInventory]);

  const handleClearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    loadInventory('', '');
  };

  return (
    <DashboardLayout sidebarItems={menuItems} sidebarLabel="Admin Menu" user={profile}>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
            <p className="text-slate-600 mt-1">Track, filter, and manage all donated items currently in stock.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Search items..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <FilterIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full sm:w-auto pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none text-slate-700 font-medium"
              >
                {categoryOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {(search.trim() || categoryFilter) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <XIcon className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error.includes('reachable') || error.includes('fetch')
              ? 'Failed to load inventory. Please check backend connection.'
              : error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
              <BoxesIcon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.totalItems}</h3>
            <p className="text-sm font-medium text-slate-500">Total Items</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2Icon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.availableItems}</h3>
            <p className="text-sm font-medium text-slate-500">Available</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
              <AlertTriangleIcon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.lowStockItems}</h3>
            <p className="text-sm font-medium text-slate-500">Low Stock</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 mb-4">
              <QrCodeIcon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.qrTrackedItems}</h3>
            <p className="text-sm font-medium text-slate-500">QR-Tracked</p>
          </motion.div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Loading inventory...
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventory.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                No inventory items found.
              </div>
            ) : (
              inventory.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all relative group flex flex-col">
                  {item.quantityAvailable <= 5 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-1 rounded-full border border-rose-200 text-xs font-bold">
                      <AlertTriangleIcon className="w-3 h-3" /> Low Stock
                    </div>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 ${
                      categoryColors[item.category] || categoryColors.default
                    }`}
                  >
                    <BoxesIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1">{item.itemName}</h4>
                    <p className="text-sm font-medium text-slate-500 mb-4">{formatLabel(item.category)}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Condition:</span>
                        <span className="font-medium text-slate-700 bg-slate-100 px-2 rounded">
                          {formatLabel(item.itemCondition)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Size:</span>
                        <span className="font-medium text-slate-700">{item.size || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Course:</span>
                        <span className="font-medium text-slate-700">{item.subjectOrCourse || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-end justify-between mb-3">
                      <p className="text-sm font-medium text-slate-500">Available</p>
                      <p className={`text-2xl font-bold leading-none ${item.quantityAvailable <= 5 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {item.quantityAvailable}
                      </p>
                    </div>
                    <button
                      type="button"
                      title="Copy item reference to clipboard"
                      onClick={() => {
                        const ref = item.qrCode || `INV-${item.id}`;
                        void navigator.clipboard.writeText(ref);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm font-mono hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-colors"
                    >
                      <QrCodeIcon className="w-4 h-4" /> {item.qrCode || `ID ${item.id}`}
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
