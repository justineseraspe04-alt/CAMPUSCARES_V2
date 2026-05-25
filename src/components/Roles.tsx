import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldIcon,
  HeartHandshakeIcon,
  GraduationCapIcon,
  CheckIcon,
  ArrowRightIcon } from
'lucide-react';
const roles = [
{
  title: 'Admin',
  icon: ShieldIcon,
  description: 'Campus staff managing the platform operations end-to-end.',
  color: 'sky',
  cta: 'Admin Login',
  ctaLink: '/login',
  capabilities: [
  'Approves incoming donations',
  'Manages inventory catalog',
  'Monitors impact reports']

},
{
  title: 'Donor',
  icon: HeartHandshakeIcon,
  description: 'Students, faculty, or alumni giving back to the community.',
  color: 'emerald',
  cta: 'Become a Donor',
  ctaLink: '/register',
  capabilities: [
  'Submits donation entries',
  'Tracks donation status',
  'Views personal impact']

},
{
  title: 'Recipient',
  icon: GraduationCapIcon,
  description: 'Students requesting needed items with dignity and ease.',
  color: 'cyan',
  cta: 'Request Items',
  ctaLink: '/register',
  capabilities: [
  'Browses available inventory',
  'Requests specific items',
  'Receives pickup notifications']

}];

const colorMap = {
  sky: {
    bg: 'bg-sky-50',
    iconBg: 'bg-sky-100',
    text: 'text-sky-600',
    border: 'border-sky-100',
    button: 'bg-sky-600 hover:bg-sky-700 shadow-sky-200'
  },
  emerald: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
  },
  cyan: {
    bg: 'bg-cyan-50',
    iconBg: 'bg-cyan-100',
    text: 'text-cyan-600',
    border: 'border-cyan-100',
    button: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200'
  }
};
export function Roles() {
  return (
    <section id="roles" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyan-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            User Roles
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Built for the whole campus
          </h2>
          <p className="text-lg text-slate-600">
            Tailored experiences for every participant in the donation
            lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => {
            const colors = colorMap[role.color as keyof typeof colorMap];
            return (
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
                className={`glass-card rounded-3xl p-8 border-2 ${colors.border} hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col`}>
                
                <div
                  className={`w-16 h-16 rounded-2xl ${colors.iconBg} flex items-center justify-center mb-6`}>
                  
                  <role.icon className={`w-8 h-8 ${colors.text}`} />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-slate-600 mb-6">{role.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {role.capabilities.map((cap, i) =>
                  <li key={i} className="flex items-start gap-3">
                      <div
                      className={`mt-1 w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      
                        <CheckIcon className={`w-3 h-3 ${colors.text}`} />
                      </div>
                      <span className="text-slate-700 font-medium text-sm">
                        {cap}
                      </span>
                    </li>
                  )}
                </ul>

                <Link
                  to={role.ctaLink}
                  className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl ${colors.button} text-white font-medium transition-all shadow-md hover:-translate-y-0.5 group`}>
                  
                  {role.cta}
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>);

          })}
        </div>
      </div>
    </section>);

}