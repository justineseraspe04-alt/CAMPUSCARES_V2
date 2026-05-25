import React, { Children } from 'react';
import { motion } from 'framer-motion';
import {
  PackagePlusIcon,
  BoxesIcon,
  HandHeartIcon,
  ScaleIcon,
  BarChart3Icon,
  BellIcon,
  QrCodeIcon,
  SparklesIcon } from
'lucide-react';
const features = [
{
  title: 'Donation Management',
  description:
  'Easily submit, track, and manage donated items with our streamlined process.',
  icon: PackagePlusIcon,
  color: 'bg-sky-100 text-sky-600'
},
{
  title: 'Smart Inventory Tracking',
  description:
  'Real-time visibility into available items, categories, and stock levels.',
  icon: BoxesIcon,
  color: 'bg-emerald-100 text-emerald-600'
},
{
  title: 'Student Item Requests',
  description:
  'Students can securely browse and request needed items with privacy in mind.',
  icon: HandHeartIcon,
  color: 'bg-cyan-100 text-cyan-600'
},
{
  title: 'Fair Distribution',
  description:
  'Built-in logic to ensure equitable access to high-demand essentials.',
  icon: ScaleIcon,
  color: 'bg-indigo-100 text-indigo-600'
},
{
  title: 'Impact Dashboard',
  description:
  'Visualize campus sustainability metrics and community support statistics.',
  icon: BarChart3Icon,
  color: 'bg-sky-100 text-sky-600'
},
{
  title: 'Notification System',
  description:
  'Automated alerts for donation approvals, request updates, and pickups.',
  icon: BellIcon,
  color: 'bg-emerald-100 text-emerald-600'
},
{
  title: 'QR Code Item Tracking',
  description:
  'Scan items for quick check-in, verification, and distribution logging.',
  icon: QrCodeIcon,
  color: 'bg-cyan-100 text-cyan-600'
},
{
  title: 'Basic AI Recommendations',
  description:
  'Smart suggestions matching available inventory to student needs.',
  icon: SparklesIcon,
  color: 'bg-indigo-100 text-indigo-600'
}];

const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};
export function Features() {
  return (
    <section id="features" className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sky-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to manage campus donations
          </h2>
          <p className="text-lg text-slate-600">
            A comprehensive suite of tools designed to make giving and receiving
            as seamless as possible for the entire campus community.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: '-100px'
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {features.map((feature, index) =>
          <motion.div
            key={index}
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300">
            
              <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
              
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

}