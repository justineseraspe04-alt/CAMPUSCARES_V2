import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ListIcon, SearchIcon } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { adminMenuItems, adminUser } from '../../components/dashboard/adminConfig';
import { getLogs, TransactionLogAdmin } from '../../api/adminApi';

export function Logs() {
  const [view, setView] = useState<'timeline' | 'table'>('timeline');
  const [logs, setLogs] = useState<TransactionLogAdmin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await getLogs();
        setLogs(response.data);
      } catch (error) {
        console.error('Failed to load logs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return logs;
    return logs.filter((log) => {
      return (
        log.action.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term) ||
        log.performedBy.toLowerCase().includes(term) ||
        String(log.id).toLowerCase().includes(term)
      );
    });
  }, [logs, searchTerm]);

  return (
    <DashboardLayout sidebarItems={adminMenuItems} sidebarLabel="Admin Menu" user={adminUser}>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Transaction Logs</h1>
            <p className="text-slate-600 mt-1">Audit trail of all system activities and user actions.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="text"
                placeholder="Search logs..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setView('timeline')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${view === 'timeline' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                Timeline
              </button>
              <button
                onClick={() => setView('table')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${view === 'table' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                Table
              </button>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading logs...</div>
          ) : view === 'timeline' ? (
            <div className="p-8 max-w-3xl mx-auto">
              {filteredLogs.length === 0 ? (
                <div className="text-center text-slate-500">No logs match your search.</div>
              ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="relative flex items-start gap-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-400 text-white shadow-sm shrink-0">
                        <ListIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex items-center justify-between mb-2 gap-4">
                          <span className="font-bold text-slate-800">{log.action}</span>
                          <span className="text-xs font-medium text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{log.details}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>By: {log.performedBy}</span>
                          <span className="font-mono">{log.id}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Log ID</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Performed By</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{log.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{log.action}</td>
                      <td className="px-6 py-4 text-slate-600 max-w-md truncate">{log.details}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{log.performedBy}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
