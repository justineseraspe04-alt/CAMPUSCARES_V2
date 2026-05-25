import React from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import {
  recipientMenuItems,
  recipientUser } from
'../../components/dashboard/recipientConfig';
import {
  SparklesIcon,
  BookIcon,
  BriefcaseIcon,
  PackageIcon } from
'lucide-react';
const recommendations = [
{
  id: 1,
  name: 'Java Programming Book',
  match: '95%',
  reason: 'Based on your CS 101 course',
  icon: BookIcon
},
{
  id: 2,
  name: 'Scientific Calculator',
  match: '88%',
  reason: 'Often requested with textbooks',
  icon: BriefcaseIcon
},
{
  id: 3,
  name: 'Notebook Bundle',
  match: '82%',
  reason: 'Essential for all students',
  icon: BriefcaseIcon
},
{
  id: 4,
  name: 'Backpack',
  match: '75%',
  reason: 'Matches your previous requests',
  icon: PackageIcon
},
{
  id: 5,
  name: 'Algebra Workbook',
  match: '70%',
  reason: 'Related to your major',
  icon: BookIcon
},
{
  id: 6,
  name: 'Pencil Case Set',
  match: '68%',
  reason: 'Popular in your department',
  icon: BriefcaseIcon
}];

export function Recommendations() {
  return (
    <PlaceholderPage
      title="AI Recommendations"
      description="Personalized items we think you'll find useful."
      sidebarItems={recipientMenuItems}
      sidebarLabel="Recipient Menu"
      user={recipientUser}>
      
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="bg-gradient-to-r from-cyan-500 to-sky-500 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-cyan-500/20 mb-8 flex flex-col md:flex-row items-center gap-6">
        
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
          <SparklesIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">How Recommendations Work</h2>
          <p className="text-cyan-50 max-w-2xl">
            Our system analyzes your course schedule, major, and past requests
            to suggest available items that might help you succeed this
            semester.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item, i) =>
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
            delay: 0.1 + i * 0.05
          }}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
          
            <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              {item.match} Match
            </div>

            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4">
              <item.icon className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {item.name}
            </h3>
            <p className="text-sm text-slate-500 mb-6">{item.reason}</p>

            <div className="mt-auto pt-4 border-t border-slate-100">
              <button className="w-full py-2.5 rounded-xl bg-cyan-50 text-cyan-700 font-medium hover:bg-cyan-100 transition-colors">
                Request Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </PlaceholderPage>);

}