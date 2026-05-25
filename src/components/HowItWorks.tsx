import React from 'react';
import { motion } from 'framer-motion';
import {
  UploadIcon,
  ShieldCheckIcon,
  ArchiveIcon,
  HandHeartIcon,
  CheckCircle2Icon } from
'lucide-react';
const steps = [
{
  title: 'Donor Submits Item',
  description:
  'Students or faculty log items they wish to donate with details and photos.',
  icon: UploadIcon,
  color: 'bg-sky-100 text-sky-600 border-sky-200'
},
{
  title: 'Admin Verifies',
  description:
  'Campus staff review the submission for quality and appropriateness.',
  icon: ShieldCheckIcon,
  color: 'bg-emerald-100 text-emerald-600 border-emerald-200'
},
{
  title: 'Added to Inventory',
  description:
  'Approved items are categorized and listed in the live campus catalog.',
  icon: ArchiveIcon,
  color: 'bg-cyan-100 text-cyan-600 border-cyan-200'
},
{
  title: 'Student Requests',
  description:
  'Students in need browse the catalog and request specific items.',
  icon: HandHeartIcon,
  color: 'bg-indigo-100 text-indigo-600 border-indigo-200'
},
{
  title: 'Item Distributed',
  description:
  'Admin approves the request, releases the item, and logs the impact.',
  icon: CheckCircle2Icon,
  color: 'bg-rose-100 text-rose-600 border-rose-200'
}];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-white relative overflow-hidden">
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-sky-50/50 rounded-l-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How CampusCares Works
          </h2>
          <p className="text-lg text-slate-600">
            A transparent, five-step journey from donation to distribution,
            ensuring fairness and efficiency.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 border-t-2 border-dashed border-slate-300 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-6 relative z-10">
            {steps.map((step, index) =>
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
              className="flex flex-col items-center text-center relative">
              
                {/* Mobile Connecting Line */}
                {index !== steps.length - 1 &&
              <div className="lg:hidden absolute top-24 bottom-[-40px] left-1/2 w-0.5 bg-slate-200 border-l-2 border-dashed border-slate-300 -translate-x-1/2 -z-10" />
              }

                <div
                className={`w-24 h-24 rounded-full bg-white border-4 flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 ${step.color}`}>
                
                  <step.icon className="w-10 h-10" />
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 w-full">
                  <div className="text-sm font-bold text-slate-400 mb-1">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

}