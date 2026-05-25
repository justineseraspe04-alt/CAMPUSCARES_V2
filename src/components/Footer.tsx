import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshakeIcon,
  MailIcon,
  TwitterIcon,
  InstagramIcon,
  GithubIcon,
  MapPinIcon } from
'lucide-react';
export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
                <HeartHandshakeIcon className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                CampusCares
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Promoting sustainability, fairness, and campus support through a
              smart donation inventory system.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-sky-500/20 hover:text-sky-400 flex items-center justify-center transition-colors">
                
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-sky-500/20 hover:text-sky-400 flex items-center justify-center transition-colors">
                
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-sky-500/20 hover:text-sky-400 flex items-center justify-center transition-colors">
                
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Features', 'How It Works', 'Roles', 'Impact'].map(
                (link) =>
                <li key={link}>
                    <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                    
                      {link}
                    </a>
                  </li>

              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
              'Help Center',
              'Donation Guidelines',
              'Campus Partners',
              'Sustainability Report'].
              map((link) =>
              <li key={link}>
                  <a
                  href="#"
                  className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                  
                    {link}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <MailIcon className="w-4 h-4 shrink-0 text-sky-400" />
                support@campuscares.edu
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPinIcon className="w-4 h-4 shrink-0 mt-0.5 text-sky-400" />
                <span>
                  Student Union Building, Room 204
                  <br />
                  University Campus
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2026 CampusCares Donation Inventory System. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-white transition-colors">
              
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-white transition-colors">
              
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-white transition-colors">
              
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>);

}