import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartHandshakeIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
  ShieldIcon,
  GraduationCapIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  PackageIcon,
  BookIcon,
  ShirtIcon } from
'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('recipient');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrorMessage('');

    try {
      await login({
        email: email.trim(),
        password: password.trim(),
        role: role.toUpperCase(),
      });
      setStatus('success');
      const target = role === 'admin' ? '/admin/dashboard' : `/${role}/dashboard`;
      navigate(target);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Invalid credentials. Please confirm your email, password, and role.'
      );
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative z-10">
        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-8 left-8 sm:left-16 lg:left-24 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors">
          
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
              Welcome Back
            </h1>
            <p className="text-slate-600 mb-8">
              Sign in to access your dashboard and continue supporting the
              campus community.
            </p>

            {/* Alert Placeholder */}
            {status === 'error' &&
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-700">
                <AlertCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">
                  {errorMessage || 'Invalid credentials. Please check your email and password.'}
                </p>
              </div>
            }

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  I am a...
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                  {
                    id: 'recipient',
                    label: 'Recipient',
                    icon: GraduationCapIcon,
                    color: 'cyan'
                  },
                  {
                    id: 'donor',
                    label: 'Donor',
                    icon: HeartHandshakeIcon,
                    color: 'emerald'
                  },
                  {
                    id: 'admin',
                    label: 'Admin',
                    icon: ShieldIcon,
                    color: 'sky'
                  }].
                  map((r) =>
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${role === r.id ? `border-${r.color}-500 bg-${r.color}-50 text-${r.color}-700` : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
                    
                      <r.icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{r.label}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type={role === 'admin' ? 'text' : 'email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                  role === 'admin' ? 'admin or admin@campuscares.com' : 'Enter your email'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900 placeholder:text-slate-400" />
                
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-sky-600 hover:text-sky-700">
                    
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                    role === 'admin' ? 'Enter admin123' : '••••••••'
                    }
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
              </div>
              {/* Admin Note */}
              {role === 'admin' &&
              <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <ShieldIcon className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                  <p>
                    Admin accounts are managed by the system. Use{' '}
                    <strong>admin</strong> / <strong>admin123</strong> to test.
                  </p>
                </div>
              }

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors shadow-sm shadow-sky-200 mt-2">
                
                Sign In
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-sky-600 hover:text-sky-700">
                  
                  Create an Account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Visual Panel */}
      <div className="hidden lg:flex w-1/2 bg-sky-50 relative overflow-hidden items-center justify-center">
        {/* Background Blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-sky-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />

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
            className="glass-card rounded-3xl p-8 shadow-2xl shadow-sky-900/10">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Campus Inventory
                </h3>
                <p className="text-sm text-slate-500">Live updates</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <PackageIcon className="w-6 h-6 text-sky-600" />
              </div>
            </div>

            <div className="space-y-4">
              {[
              {
                icon: BookIcon,
                name: 'Calculus Textbook',
                status: 'Just Added',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: ShirtIcon,
                name: 'Campus Jacket',
                status: 'Available',
                color: 'bg-emerald-100 text-emerald-600'
              },
              {
                icon: PackageIcon,
                name: 'Lab Equipment',
                status: 'Requested',
                color: 'bg-amber-100 text-amber-600'
              }].
              map((item, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-white/50">
                
                  <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                  
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">
                      {item.name}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {item.status}
                    </p>
                  </div>
                  <CheckCircle2Icon className="w-5 h-5 text-emerald-500" />
                </div>
              )}
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-sky-600 text-white flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) =>
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-sky-400 border-2 border-sky-600 flex items-center justify-center">
                  
                    <GraduationCapIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-bold">Join 1,400+ students</p>
                <p className="text-xs text-sky-200">
                  making a difference today
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}