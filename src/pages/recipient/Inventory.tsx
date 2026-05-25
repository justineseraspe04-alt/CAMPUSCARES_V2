import React from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import {
  recipientMenuItems,
  recipientUser } from
'../../components/dashboard/recipientConfig';
import {
  SearchIcon,
  FilterIcon,
  BookIcon,
  ShirtIcon,
  PackageIcon,
  BriefcaseIcon } from
'lucide-react';
const inventoryItems = [
{
  id: 1,
  name: 'Notebook Bundle',
  category: 'School Supplies',
  condition: 'New',
  qty: 12,
  icon: BriefcaseIcon
},
{
  id: 2,
  name: 'Calculus Textbook',
  category: 'Books',
  condition: 'Good',
  qty: 3,
  icon: BookIcon
},
{
  id: 3,
  name: 'School Uniform - Medium',
  category: 'Clothing',
  condition: 'Slightly Used',
  qty: 4,
  icon: ShirtIcon
},
{
  id: 4,
  name: 'Hygiene Kit',
  category: 'Essentials',
  condition: 'New',
  qty: 8,
  icon: PackageIcon
},
{
  id: 5,
  name: 'Scientific Calculator',
  category: 'School Supplies',
  condition: 'Like New',
  qty: 5,
  icon: BriefcaseIcon
},
{
  id: 6,
  name: 'Java Programming Book',
  category: 'Books',
  condition: 'Slightly Used',
  qty: 2,
  icon: BookIcon
},
{
  id: 7,
  name: 'PE Uniform',
  category: 'Clothing',
  condition: 'Good',
  qty: 6,
  icon: ShirtIcon
},
{
  id: 8,
  name: 'Backpack',
  category: 'Essentials',
  condition: 'Slightly Used',
  qty: 4,
  icon: PackageIcon
},
{
  id: 9,
  name: 'Pencil Case Set',
  category: 'School Supplies',
  condition: 'New',
  qty: 15,
  icon: BriefcaseIcon
},
{
  id: 10,
  name: 'Winter Jacket',
  category: 'Clothing',
  condition: 'Good',
  qty: 2,
  icon: ShirtIcon
}];

export function Inventory() {
  return (
    <PlaceholderPage
      title="Available Items"
      description="Browse items currently available for request."
      sidebarItems={recipientMenuItems}
      sidebarLabel="Recipient Menu"
      user={recipientUser}>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search available items..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
          
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <FilterIcon className="w-5 h-5 text-slate-400" />
          <select className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-700">
            <option>All Categories</option>
            <option>Books</option>
            <option>Clothing</option>
            <option>School Supplies</option>
            <option>Essentials</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {inventoryItems.map((item, i) =>
        <motion.div
          key={item.id}
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
          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
          
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4">
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">
              {item.name}
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {item.category}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-600 border border-sky-100">
                {item.condition}
              </span>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-bold text-slate-800">{item.qty}</span>
                <span className="text-slate-500 ml-1">available</span>
              </div>
              <button className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition-colors shadow-sm shadow-cyan-200">
                Request
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </PlaceholderPage>);

}