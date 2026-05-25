import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  BoxesIcon,
  HandHeartIcon,
  ClockIcon,
  SparklesIcon,
  BellIcon,
  CheckCircle2Icon,
  PackageIcon,
  ShirtIcon,
  BookIcon,
  QrCodeIcon,
  InfoIcon } from
'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import {
  recipientMenuItems,
  recipientUser } from
'../../components/dashboard/recipientConfig';
const kpiData = [
{
  title: 'Available Items',
  value: '1,240',
  icon: BoxesIcon,
  color: 'sky'
},
{
  title: 'Pending Requests',
  value: '1',
  icon: ClockIcon,
  color: 'amber'
},
{
  title: 'Approved Requests',
  value: '3',
  icon: CheckCircle2Icon,
  color: 'emerald'
},
{
  title: 'Released Items',
  value: '2',
  icon: PackageIcon,
  color: 'indigo'
}];

const availableItems = [
{
  id: 'INV-001',
  name: 'Scientific Calculators',
  category: 'School Supplies',
  condition: 'Good',
  qty: 4,
  icon: BoxesIcon
},
{
  id: 'INV-002',
  name: 'Winter Jackets (Assorted)',
  category: 'Clothing',
  condition: 'Good',
  qty: 24,
  icon: ShirtIcon
},
{
  id: 'INV-003',
  name: 'Intro to Physics 4th Ed',
  category: 'Books',
  condition: 'Fair',
  qty: 2,
  icon: BookIcon
},
{
  id: 'INV-004',
  name: 'Hygiene Kits',
  category: 'Essentials',
  condition: 'New',
  qty: 45,
  icon: PackageIcon
}];

const requestHistory = [
{
  id: 'REQ-892',
  item: 'Scientific Calculator',
  category: 'School Supplies',
  reason: 'Required for Math 201...',
  status: 'Pending',
  date: 'Oct 15, 2026'
},
{
  id: 'REQ-890',
  item: 'Winter Coat (L)',
  category: 'Clothing',
  reason: 'Need warm clothing...',
  status: 'Approved',
  date: 'Oct 10, 2026'
},
{
  id: 'REQ-885',
  item: 'Intro to Biology',
  category: 'Books',
  reason: 'Required text...',
  status: 'Released',
  date: 'Sep 05, 2026'
}];

const recommendations = [
{
  item: 'Lab Goggles',
  category: 'School Supplies',
  reason: 'Often requested with Scientific Calculators',
  qty: 15
},
{
  item: 'Winter Gloves',
  category: 'Clothing',
  reason: 'Matches your recent Winter Coat request',
  qty: 8
}];

const StatusBadge = ({ status }: {status: string;}) => {
  const styles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Rejected: 'bg-rose-100 text-rose-700 border-rose-200',
    Released: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      
      {status}
    </span>);

};
export function Dashboard() {
  return (
    <DashboardLayout
      sidebarItems={recipientMenuItems}
      sidebarLabel="Recipient Menu"
      user={recipientUser}>
      
      <div className="space-y-8 pb-12">
        {/* 1. Welcome Banner */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="glass-card rounded-3xl p-8 relative overflow-hidden border-cyan-100 shadow-cyan-100/50">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome, Recipient
            </h1>
            <p className="text-slate-600 max-w-2xl text-lg">
              Browse available donations, request needed items, and receive
              support from the campus community.
            </p>
          </div>
        </motion.div>

        {/* 2. KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, i) =>
          <motion.div
            key={kpi.title}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: i * 0.05
            }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            
              <div
              className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center text-${kpi.color}-600 mb-4`}>
              
                <kpi.icon className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">
                {kpi.value}
              </h3>
              <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
            </motion.div>
          )}
        </div>

        {/* 3. Available Items UI */}
        <motion.div
          id="available"
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.2
          }}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Available Items
            </h2>
            <button className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
              View Catalog
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableItems.map((item) =>
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-cyan-300 transition-colors relative group">
              
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded-md text-xs">
                    {item.condition}
                  </span>
                  <span className="font-bold text-slate-700">
                    Qty: {item.qty}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <QrCodeIcon className="w-3 h-3" /> {item.id}
                  </span>
                  <button className="text-xs font-medium text-cyan-600 hover:text-cyan-700">
                    Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 4. Request Item Form UI */}
          <motion.div
            id="request"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.3
            }}
            className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Request an Item
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Student Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Alex Rivera"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none"
                    readOnly />
                  
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Student Email
                  </label>
                  <input
                    type="email"
                    defaultValue="arivera@university.edu"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none"
                    readOnly />
                  
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Requested Item Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scientific Calculator"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all" />
                  
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700">
                    <option>School Supplies</option>
                    <option>Clothing</option>
                    <option>Books</option>
                    <option>Essentials</option>
                    <option>Others</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Reason for Request
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly explain why you need this item..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none">
                </textarea>
              </div>

              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition-colors shadow-sm shadow-cyan-200">
                
                Submit Request
              </button>
            </form>
          </motion.div>

          {/* 7. Recipient Support Tips Section */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.4
            }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
            
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Support Tips
            </h2>
            <div className="space-y-4 flex-1">
              {[
              {
                text: 'Request only what you need to ensure fair distribution.',
                icon: HandHeartIcon
              },
              {
                text: 'Check item availability regularly as inventory updates daily.',
                icon: BoxesIcon
              },
              {
                text: 'Wait for admin approval before attempting pickup.',
                icon: ClockIcon
              },
              {
                text: 'Claim released items on time to avoid cancellation.',
                icon: CheckCircle2Icon
              }].
              map((tip, i) =>
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                
                  <tip.icon className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{tip.text}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 5. Request History UI */}
          <motion.div
            id="history"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.5
            }}
            className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Request History
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Requested Item</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requestHistory.map((req) =>
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/50 transition-colors">
                    
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {req.item}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {req.category}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{req.date}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* 6. AI Recommendation Section */}
          <motion.div
            id="recommendations"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.6
            }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-800">
                Recommendations
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-6 flex items-start gap-1">
              <InfoIcon className="w-3 h-3 shrink-0 mt-0.5" />
              Based on your previous requests and available inventory.
            </p>

            <div className="space-y-4">
              {recommendations.map((rec, i) =>
              <div
                key={i}
                className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800">{rec.item}</h4>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                      Qty: {rec.qty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{rec.category}</p>
                  <p className="text-sm text-slate-700 italic mb-4">
                    "{rec.reason}"
                  </p>
                  <button className="w-full py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-sm font-medium hover:bg-indigo-50 transition-colors">
                    Request Now
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>);

}