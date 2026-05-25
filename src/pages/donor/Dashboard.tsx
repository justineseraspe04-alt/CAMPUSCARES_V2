import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  PackagePlusIcon,
  ClockIcon,
  BellIcon,
  CheckCircle2Icon,
  XCircleIcon,
  UsersIcon,
  LeafIcon,
  AwardIcon,
  ArrowRightIcon,
  HeartIcon } from
'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import {
  donorMenuItems,
  donorUser } from
'../../components/dashboard/donorConfig';
const kpiData = [
{
  title: 'Total Donations Submitted',
  value: '18',
  icon: PackagePlusIcon,
  color: 'emerald',
  trend: '+4',
  trendUp: true
},
{
  title: 'Approved Donations',
  value: '12',
  icon: CheckCircle2Icon,
  color: 'sky',
  trend: '+2',
  trendUp: true
},
{
  title: 'Pending Donations',
  value: '4',
  icon: ClockIcon,
  color: 'amber',
  trend: '+2',
  trendUp: true
},
{
  title: 'Rejected Donations',
  value: '2',
  icon: XCircleIcon,
  color: 'rose',
  trend: '0',
  trendUp: true
},
{
  title: 'Students Helped',
  value: '26',
  icon: UsersIcon,
  color: 'cyan',
  trend: '+8',
  trendUp: true
},
{
  title: 'Items Reused',
  value: '73',
  icon: LeafIcon,
  color: 'emerald',
  trend: '+15',
  trendUp: true
}];

const donationHistory = [
{
  id: 'DON-1045',
  item: 'School Uniform Set',
  category: 'Clothing',
  condition: 'Slightly Used',
  qty: 4,
  status: 'Approved',
  date: 'Oct 14, 2026'
},
{
  id: 'DON-1046',
  item: 'Java Programming Book',
  category: 'Books',
  condition: 'Slightly Used',
  qty: 2,
  status: 'Pending',
  date: 'Oct 12, 2026'
},
{
  id: 'DON-1047',
  item: 'Notebook Bundle',
  category: 'School Supplies',
  condition: 'New',
  qty: 10,
  status: 'Approved',
  date: 'Oct 08, 2026'
},
{
  id: 'DON-1048',
  item: 'Hygiene Kit',
  category: 'Essentials',
  condition: 'New',
  qty: 5,
  status: 'Approved',
  date: 'Oct 02, 2026'
},
{
  id: 'DON-1049',
  item: 'PE Shoes',
  category: 'Clothing',
  condition: 'Worn',
  qty: 1,
  status: 'Rejected',
  date: 'Sep 28, 2026'
}];

const StatusBadge = ({ status }: {status: string;}) => {
  const styles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Rejected: 'bg-rose-100 text-rose-700 border-rose-200'
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
      sidebarItems={donorMenuItems}
      sidebarLabel="Donor Menu"
      user={donorUser}>
      
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
          className="rounded-3xl relative overflow-hidden bg-slate-900 text-white grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500 opacity-10 rounded-full blur-3xl translate-y-1/3" />

          <div className="relative z-10 lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-sm">
              <HeartIcon className="w-3 h-3 fill-emerald-300" />
              Thank you for giving back
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
              Welcome, Donor
            </h1>
            <p className="text-slate-300 max-w-2xl text-base lg:text-lg">
              Thank you for helping students through sustainable campus giving.
            </p>
          </div>

          <div className="relative z-10 flex lg:flex-col gap-3">
            <Link
              to="/donor/donate"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/30">
              
              <PackagePlusIcon className="w-4 h-4" />
              Submit New Donation
            </Link>
            <Link
              to="/donor/history"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors backdrop-blur-sm">
              
              View History
            </Link>
          </div>
        </motion.div>

        {/* 2. KPI Cards & 3. Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                <p className="text-sm font-medium text-slate-500">
                  {kpi.title}
                </p>
              </motion.div>
            )}
          </div>

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
              delay: 0.2
            }}
            className="flex flex-col gap-3">
            
            <Link
              to="/donor/donate"
              className="flex items-center justify-between p-4 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 group">
              
              <div className="flex items-center gap-3">
                <PackagePlusIcon className="w-5 h-5" />
                <span className="font-medium">Submit New Donation</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/donor/history"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors group">
              
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-slate-400" />
                <span className="font-medium">View Donation History</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/donor/notifications"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors group">
              
              <div className="flex items-center gap-3">
                <BellIcon className="w-5 h-5 text-slate-400" />
                <span className="font-medium">View Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  2
                </span>
                <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link
              to="/"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors group">
              
              <div className="flex items-center gap-3">
                <LayoutDashboardIcon className="w-5 h-5 text-slate-400" />
                <span className="font-medium">Back to Home</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 4. Submit Donation Form UI */}
          <motion.div
            id="submit-donation"
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
              Submit a Donation
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Donor Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none"
                    readOnly />
                  
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Donor Email
                  </label>
                  <input
                    type="email"
                    defaultValue="jane.doe@university.edu"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none"
                    readOnly />
                  
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Intro to Psychology Textbook"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700">
                    <option>Clothing</option>
                    <option>Books</option>
                    <option>School Supplies</option>
                    <option>Essentials</option>
                    <option>Others</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Condition
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700">
                    <option>New</option>
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Used</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Size{' '}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Medium, 10"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Subject/Course{' '}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PSYCH 101"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add any helpful details about the item..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none">
                </textarea>
              </div>

              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                
                Submit Donation
              </button>
            </form>
          </motion.div>

          {/* 6. Donor Impact Section */}
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
              Your Impact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                  <LeafIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">34 kg</p>
                  <p className="text-sm font-medium text-slate-600">
                    Waste Reduced
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2 relative overflow-hidden">
                <AwardIcon className="w-16 h-16 absolute -right-2 -bottom-2 text-white opacity-10" />
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-300 shadow-sm backdrop-blur-sm relative z-10">
                  <AwardIcon className="w-5 h-5" />
                </div>
                <div className="relative z-10">
                  <p className="text-2xl font-bold text-white">92%</p>
                  <p className="text-sm font-medium text-slate-300">
                    Campus Contribution Score
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-100 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-cyan-600 shadow-sm">
                  <PackagePlusIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800 leading-tight">
                    School Supplies
                  </p>
                  <p className="text-sm font-medium text-slate-600">
                    Most Donated Category
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm">
                  <ClockIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800 leading-tight">
                    Notebook Bundle
                  </p>
                  <p className="text-sm font-medium text-slate-600">
                    Last Donation
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 5. Donation History UI */}
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
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              Donation History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Date Submitted</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donationHistory.map((item) =>
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors">
                  
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {item.item}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.condition}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.qty}</td>
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>);

}