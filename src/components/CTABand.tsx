import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
export function CTABand() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          whileInView={{
            opacity: 1,
            scale: 1
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.5
          }}
          className="relative rounded-3xl overflow-hidden bg-sky-600 px-6 py-16 sm:px-12 sm:py-20 text-center">
          
          {/* Decorative background patterns */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-sky-500 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-sky-700 rounded-full blur-3xl opacity-50" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
              Ready to make an impact on campus?
            </h2>
            <p className="text-sky-100 text-lg mb-10">
              Join thousands of students and faculty already using CampusCares
              to donate, request, and support each other.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-sky-600 font-bold hover:bg-sky-50 transition-colors shadow-xl shadow-sky-900/20">
                Get Started Now
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-sky-700/50 text-white font-medium border border-sky-500 hover:bg-sky-700 transition-colors">
                Browse Items
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}