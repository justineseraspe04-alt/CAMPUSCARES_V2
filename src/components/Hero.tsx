import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  ArrowRightIcon,
  PackageIcon,
  BookIcon,
  ShirtIcon,
  GraduationCapIcon,
  HeartIcon,
  CheckCircle2Icon,
  LeafIcon,
  ScaleIcon,
  UsersIcon } from
'lucide-react';
const trustBadges = [
{
  icon: LeafIcon,
  label: 'Sustainable',
  color: 'text-emerald-600 bg-emerald-50'
},
{
  icon: ScaleIcon,
  label: 'Fair Distribution',
  color: 'text-sky-600 bg-sky-50'
},
{
  icon: UsersIcon,
  label: 'Student Support',
  color: 'text-cyan-600 bg-cyan-50'
}];

export function Hero() {
  return (
    <section
      id="home"
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50 -z-20" />

      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
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
              duration: 0.6
            }}
            className="max-w-2xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4" />
              <span>Campus Sustainability Initiative</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              CampusCares Donation{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                Inventory System
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl font-medium text-slate-700 mb-4">
              Donate. Request. Reuse. Support.
            </h2>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              A smart campus donation platform that connects donors with
              students in need while promoting sustainability, fairness, and
              social impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-300 hover:shadow-slate-400 hover:-translate-y-0.5">
                
                Get Started
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-700 font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                
                View Available Items
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              {trustBadges.map((badge) =>
              <div
                key={badge.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                
                  <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${badge.color}`}>
                  
                    <badge.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">
                    {badge.label}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Illustration */}
          <div className="relative h-[500px] w-full hidden sm:block">
            {/* Main Card */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 0.6,
                delay: 0.2
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 glass-card rounded-3xl p-6 z-20 shadow-2xl shadow-slate-300/40">
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Recent Donations
                  </h3>
                  <p className="text-xs text-slate-500">Live campus feed</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live
                </span>
              </div>

              <div className="space-y-3">
                {[
                {
                  icon: BookIcon,
                  name: 'Textbooks (Math)',
                  status: 'Verified',
                  color: 'bg-blue-100 text-blue-600'
                },
                {
                  icon: ShirtIcon,
                  name: 'Winter Hoodie',
                  status: 'Available',
                  color: 'bg-emerald-100 text-emerald-600'
                },
                {
                  icon: PackageIcon,
                  name: 'Art Supplies',
                  status: 'Requested',
                  color: 'bg-amber-100 text-amber-600'
                }].
                map((item, i) =>
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-white/60 border border-white/40">
                  
                    <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">{item.status}</p>
                    </div>
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [-10, 10, -10]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute top-20 right-10 glass-card rounded-2xl p-4 flex items-center gap-3 z-30 shadow-xl shadow-slate-300/30">
              
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <PackageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Today's Impact
                </p>
                <p className="text-sm font-bold text-slate-800">
                  120 items added
                </p>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [10, -10, 10]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              }}
              className="absolute bottom-24 left-4 glass-card rounded-2xl p-4 flex items-center gap-3 z-30 shadow-xl shadow-slate-300/30">
              
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) =>
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-sky-100 border-2 border-white flex items-center justify-center text-sky-600">
                  
                    <GraduationCapIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">+45 students</p>
                <p className="text-xs text-slate-500 font-medium">
                  helped this week
                </p>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [-5, 5, -5],
                rotate: [-2, 2, -2]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2
              }}
              className="absolute top-40 left-10 w-16 h-16 glass-card rounded-2xl flex items-center justify-center text-rose-500 z-10 shadow-lg">
              
              <HeartIcon className="w-8 h-8 fill-rose-100" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>);

}