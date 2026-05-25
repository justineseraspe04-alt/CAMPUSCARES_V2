import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartHandshakeIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
  GraduationCapIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  PackagePlusIcon,
  HeartIcon,
  UsersIcon } from
'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('recipient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrorMessage('');

    try {
      const user = await register({
        fullName,
        email,
        password,
        role,
      });
      setStatus('success');
      const target = role === 'admin' ? '/admin/dashboard' : `/${role}/dashboard`;
      navigate(target);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed.');
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-row-reverse">
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative z-10 bg-white shadow-2xl shadow-slate-200/50">
        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-8 right-8 sm:right-16 lg:right-24 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors">
          
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <HeartHandshakeIcon className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              CampusCares
            </span>
          </div>

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
              duration: 0.5
            }}>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Create Your Account
            </h1>
            <p className="text-slate-600 mb-8">
              Join CampusCares as a donor or recipient and help build a more
              supportive campus community.
            </p>

            {/* Alert Placeholder */}
            {status === 'success' &&
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-700">
                <CheckCircle2Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">
                  Account created successfully! Redirecting to login...
                </p>
              </div>
            }

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  I want to join as a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                  {
                    id: 'recipient',
                    label: 'Recipient',
                    icon: GraduationCapIcon,
                    color: 'cyan',
                    desc: 'Request items'
                  },
                  {
                    id: 'donor',
                    label: 'Donor',
                    icon: HeartHandshakeIcon,
                    color: 'emerald',
                    desc: 'Give items'
                  }].
                  map((r) =>
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left ${role === r.id ? `border-${r.color}-500 bg-${r.color}-50` : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}>
                    
                      <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === r.id ? `bg-${r.color}-100 text-${r.color}-600` : 'bg-slate-100 text-slate-500'}`}>
                      
                        <r.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span
                        className={`block text-sm font-bold ${role === r.id ? `text-${r.color}-700` : 'text-slate-700'}`}>
                        
                          {r.label}
                        </span>
                        <span
                        className={`block text-xs ${role === r.id ? `text-${r.color}-600/80` : 'text-slate-500'}`}>
                        
                          {r.desc}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900 placeholder:text-slate-400" />
                
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Campus Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900 placeholder:text-slate-400" />
                
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900 placeholder:text-slate-400 pr-10" />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    
                    {showPassword ?
                    <EyeOffIcon className="w-5 h-5" /> :

                    <EyeIcon className="w-5 h-5" />
                    }
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Must be at least 8 characters long.
                </p>
              </div>
              {status === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-700">
                  <AlertCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    {errorMessage || 'Registration failed. Please check your information.'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors shadow-sm shadow-sky-200 mt-4">
                
                Create Account
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-sky-600 hover:text-sky-700">
                  
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Left Side - Visual Panel */}
      <div className="hidden lg:flex w-1/2 bg-emerald-50 relative overflow-hidden items-center justify-center">
        {/* Background Blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />

        <div className="relative z-10 w-full max-w-md">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.6,
              delay: 0.2
            }}
            className="glass-card rounded-3xl p-8 shadow-2xl shadow-emerald-900/10">
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <HeartIcon className="w-8 h-8 text-rose-500 fill-rose-100" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Give & Receive
              </h3>
              <p className="text-slate-600">
                Building a sustainable campus together.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/60 p-4 rounded-2xl border border-white/50 text-center">
                <PackagePlusIcon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-slate-800">2.8k+</p>
                <p className="text-xs font-medium text-slate-500">
                  Items Donated
                </p>
              </div>
              <div className="bg-white/60 p-4 rounded-2xl border border-white/50 text-center">
                <UsersIcon className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-slate-800">1.4k+</p>
                <p className="text-xs font-medium text-slate-500">
                  Students Helped
                </p>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-white">
              <p className="text-sm text-slate-600 italic text-center">
                "CampusCares helped me get the textbooks I needed for the
                semester when I couldn't afford them. It's an amazing
                community."
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  JD
                </div>
                <span className="text-xs font-bold text-slate-800">
                  - Junior, CS Major
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}