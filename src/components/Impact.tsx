import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  PackageIcon,
  HandHeartIcon,
  UsersIcon,
  LeafIcon,
  TrendingUpIcon } from
'lucide-react';
const stats = [
{
  label: 'Total Items Donated',
  value: 2847,
  icon: PackageIcon,
  color: 'text-sky-600',
  bg: 'bg-sky-100',
  trend: '+12% this month'
},
{
  label: 'Items Distributed',
  value: 2156,
  icon: HandHeartIcon,
  color: 'text-emerald-600',
  bg: 'bg-emerald-100',
  trend: '+8% this month'
},
{
  label: 'Students Helped',
  value: 1432,
  icon: UsersIcon,
  color: 'text-cyan-600',
  bg: 'bg-cyan-100',
  trend: '+15% this month'
},
{
  label: 'Waste Reduced (Tons)',
  value: 1.2,
  icon: LeafIcon,
  color: 'text-indigo-600',
  bg: 'bg-indigo-100',
  trend: 'Estimated',
  isFloat: true
}];

function Counter({
  value,
  isFloat = false



}: {value: number;isFloat?: boolean;}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-50px'
  });
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const incrementTime = 20;
      const steps = duration / incrementTime;
      const increment = end / steps;
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  return (
    <span ref={ref}>
      {isFloat ? count.toFixed(1) : Math.floor(count).toLocaleString()}
    </span>);

}
export function Impact() {
  return (
    <section id="impact" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-slate-50/50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sky-100/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Making a real difference
          </h2>
          <p className="text-lg text-slate-600">
            Every donation counts. See how the campus community is coming
            together to support one another and reduce waste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) =>
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.1
            }}
            className="glass-card rounded-3xl p-6 relative overflow-hidden group">
            
              <div className="flex items-center justify-between mb-4">
                <div
                className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  <TrendingUpIcon className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-4xl font-bold text-slate-900 tracking-tight mb-1">
                  <Counter value={stat.value} isFloat={stat.isFloat} />
                  {stat.isFloat ? '' : '+'}
                </h4>
                <p className="text-sm font-medium text-slate-600">
                  {stat.label}
                </p>
              </div>

              {/* Hover effect background */}
              <div
              className={`absolute -bottom-24 -right-24 w-48 h-48 ${stat.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
            
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}