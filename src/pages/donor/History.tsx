import React from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import {
  donorMenuItems,
  donorUser } from
'../../components/dashboard/donorConfig';
import {
  SearchIcon,
  FilterIcon,
  PackagePlusIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon } from
'lucide-react';
const summaryCards = [
{
  title: 'Total',
  value: '18',
  icon: PackagePlusIcon,
  color: 'slate'
},
{
  title: 'Approved',
  value: '12',
  icon: CheckCircle2Icon,
  color: 'emerald'
},
{
  title: 'Pending',
  value: '4',
  icon: ClockIcon,
  color: 'amber'
},
{
  title: 'Rejected',
  value: '2',
  icon: XCircleIcon,
  color: 'rose'
}];

const historyData = [
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
},
{
  id: 'DON-1050',
  item: 'Used Laptop Bag',
  category: 'Clothing',
  condition: 'Slightly Used',
  qty: 1,
  status: 'Approved',
  date: 'Sep 20, 2026'
},
{
  id: 'DON-1051',
  item: 'Algebra Workbook',
  category: 'Books',
  condition: 'New',
  qty: 3,
  status: 'Approved',
  date: 'Sep 15, 2026'
},
{
  id: 'DON-1052',
  item: 'Sports Jersey',
  category: 'Clothing',
  condition: 'Worn',
  qty: 2,
  status: 'Pending',
  date: 'Sep 10, 2026'
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
export function History() {
  return (
    <PlaceholderPage
      title="Donation History"
      description="Track every item you've contributed to the community."
      sidebarItems={donorMenuItems}
      sidebarLabel="Donor Menu"
      user={donorUser}>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, i) =>
        <motion.div
          key={card.title}
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
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          
            <div
            className={`w-12 h-12 rounded-xl bg-${card.color}-50 flex items-center justify-center text-${card.color}-600`}>
            
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
            </div>
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
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search donations..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterIcon className="w-5 h-5 text-slate-400" />
            <select className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Donation ID</th>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyData.map((item) =>
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors">
                
                  <td className="px-6 py-4 font-medium text-slate-500">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {item.item}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.category}</td>
                  <td className="px-6 py-4 text-slate-600">{item.condition}</td>
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
    </PlaceholderPage>);

}