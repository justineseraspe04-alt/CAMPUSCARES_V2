import React, { Component } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
  SearchIcon,
  BellIcon } from
'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import {
  adminMenuItems,
  adminUser } from
'../../components/dashboard/adminConfig';
export function DesignSystem() {
  return (
    <DashboardLayout
      sidebarItems={adminMenuItems}
      sidebarLabel="Admin Menu"
      user={adminUser}>
      
      <div className="space-y-12 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Design System</h1>
          <p className="text-slate-600 mt-1">
            Component library and style guide for CampusCares.
          </p>
        </div>

        {/* Buttons */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <button className="px-6 py-2.5 rounded-full bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors shadow-sm shadow-sky-200">
              Primary Button
            </button>
            <button className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
              Success Button
            </button>
            <button className="px-6 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              Outline Button
            </button>
            <button className="px-6 py-2.5 rounded-full text-sky-600 font-medium hover:bg-sky-50 transition-colors">
              Ghost Button
            </button>
            <button className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-medium hover:bg-rose-100 transition-colors text-sm">
              Small Danger
            </button>
          </div>
        </section>

        {/* Status Badges */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Status Badges
          </h2>
          <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-100 text-amber-700 border-amber-200">
              Pending
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-100 text-emerald-700 border-emerald-200">
              Approved
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-rose-100 text-rose-700 border-rose-200">
              Rejected
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-indigo-100 text-indigo-700 border-indigo-200">
              Released
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1">
              <AlertTriangleIcon className="w-3 h-3" /> Low Stock
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-sky-100 text-sky-700 border-sky-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>{' '}
              Unread
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-100 text-slate-600 border-slate-200">
              Read
            </span>
          </div>
        </section>

        {/* Form Inputs */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Form Inputs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Standard Input
              </label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" />
              
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Input with Icon
              </label>
              <div className="relative">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" />
                
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Select Dropdown
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700">
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Disabled Input
              </label>
              <input
                type="text"
                value="Read only value"
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none cursor-not-allowed" />
              
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Textarea
              </label>
              <textarea
                rows={3}
                placeholder="Enter description..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none">
              </textarea>
            </div>
          </div>
        </section>

        {/* Alerts & Notifications */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Alerts & Notifications
          </h2>
          <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-700">
              <CheckCircle2Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">Success Alert</p>
                <p className="text-sm mt-0.5 opacity-90">
                  Action completed successfully.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-700">
              <XCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">Error Alert</p>
                <p className="text-sm mt-0.5 opacity-90">
                  Something went wrong. Please try again.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-sky-700">
              <InfoIcon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">Information Alert</p>
                <p className="text-sm mt-0.5 opacity-90">
                  Here is some helpful information.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3 text-amber-700">
              <AlertTriangleIcon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">Warning Alert</p>
                <p className="text-sm mt-0.5 opacity-90">
                  Please be careful before proceeding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Solid Card
              </h3>
              <p className="text-slate-600 text-sm">
                Standard white card with subtle border and shadow. Used for most
                content blocks.
              </p>
            </div>
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400 opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Glassmorphic Card
                </h3>
                <p className="text-slate-600 text-sm">
                  Used for welcome banners and hero sections. Features backdrop
                  blur and decorative blobs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>);

}