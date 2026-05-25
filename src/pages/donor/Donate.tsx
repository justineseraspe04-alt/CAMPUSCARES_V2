import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceholderPage } from '../PlaceholderPage';
import {
  donorMenuItems,
  donorUser } from
  '../../components/dashboard/donorConfig';
import { InfoIcon, CheckCircle2Icon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as donorApi from '../../api/donorApi';
import { useNavigate } from 'react-router-dom';

export function Donate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('School Supplies');
  const [condition, setCondition] = useState('New');
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState('');
  const [subjectOrCourse, setSubjectOrCourse] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const mapCategory = (label: string) => {
    if (!label) return 'OTHER';
    return label.trim().replace(/[- ]/g, '_').toUpperCase();
  };

  const mapCondition = (label: string) => {
    if (!label) return 'WORN';
    const normalized = label.trim().toUpperCase();
    if (normalized === 'NEW') return 'NEW';
    if (normalized.includes('SLIGHT')) return 'SLIGHTLY_USED';
    if (normalized.includes('LIKE')) return 'SLIGHTLY_USED';
    return 'WORN';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!user) {
      setMessage({type: 'error', text: 'You must be logged in to submit a donation.'});
      return;
    }
    if (!itemName || itemName.trim() === '') {
      setMessage({type: 'error', text: 'Item name is required.'});
      return;
    }
    if (quantity < 1) {
      setMessage({type: 'error', text: 'Quantity must be at least 1.'});
      return;
    }

    const payload = {
      donorName: user.fullName,
      donorEmail: user.email,
      itemName,
      category: mapCategory(category),
      itemCondition: mapCondition(condition),
      quantity,
      size,
      subjectOrCourse,
      description,
    };

    try {
      setLoading(true);
      await donorApi.submitDonation(payload);
      setMessage({type: 'success', text: 'Donation submitted successfully and is now pending admin approval.'});
      // preserve donor name/email, clear the rest
      setItemName(''); setCategory('School Supplies'); setCondition('New'); setQuantity(1); setSize(''); setSubjectOrCourse(''); setDescription('');
      // optionally navigate to history after short delay
      setTimeout(() => navigate('/donor/history'), 1200);
    } catch (err:any) {
      setMessage({type: 'error', text: err?.message || 'Failed to submit donation.'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlaceholderPage
      title="Submit a Donation"
      description="Share usable items to help students in need."
      sidebarItems={donorMenuItems}
      sidebarLabel="Donor Menu"
      user={donorUser}>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Donor Name</label>
                <input type="text" value={user?.fullName || ''} readOnly className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Donor Email</label>
                <input type="email" value={user?.email || ''} readOnly className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Item Name</label>
              <input type="text" value={itemName} onChange={e=>setItemName(e.target.value)} placeholder="e.g. Intro to Psychology Textbook" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none">
                  <option>Clothing</option>
                  <option>Books</option>
                  <option>School Supplies</option>
                  <option>Essentials</option>
                  <option>Others</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Condition</label>
                <select value={condition} onChange={e=>setCondition(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none">
                  <option>New</option>
                  <option>Like New</option>
                  <option>Slightly Used</option>
                  <option>Worn</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Quantity</label>
                <input type="number" min={1} value={quantity} onChange={e=>setQuantity(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Size <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="text" value={size} onChange={e=>setSize(e.target.value)} placeholder="e.g. Medium, 10" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Subject/Course <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="text" value={subjectOrCourse} onChange={e=>setSubjectOrCourse(e.target.value)} placeholder="e.g. PSYCH 101" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Add any helpful details about the item..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none resize-none"></textarea>
            </div>

            {message && (
              <div className={`p-3 rounded ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm text-lg">
              {loading ? 'Submitting...' : 'Submit Donation'}
            </button>
          </form>
        </motion.div>

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
            delay: 0.1
          }}
          className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm h-fit">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <InfoIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Donation Guidelines
            </h3>
          </div>
          <ul className="space-y-4">
            {[
            'Ensure items are clean and usable',
            'Package items securely',
            'Drop off at Student Center',
            'Allow 2-3 days for approval'].
            map((tip, i) =>
            <li key={i} className="flex items-start gap-3">
                <CheckCircle2Icon className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm leading-relaxed">
                  {tip}
                </span>
              </li>
            )}
          </ul>
        </motion.div>
      </div>
    </PlaceholderPage>);

}