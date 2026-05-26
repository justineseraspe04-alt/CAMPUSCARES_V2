import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlertIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getDashboardPath } from '../utils/authUtils';

export function AccessDenied() {
  const { user } = useAuth();
  const home = user ? getDashboardPath(user.role) : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlertIcon className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access denied</h1>
        <p className="text-slate-600 mb-6">
          You do not have permission to view this page with your current role.
        </p>
        <Link
          to={home}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors"
        >
          Go to my dashboard
        </Link>
      </div>
    </div>
  );
}
