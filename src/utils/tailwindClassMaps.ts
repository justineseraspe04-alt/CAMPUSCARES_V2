/** Explicit Tailwind class maps — dynamic `bg-${color}-50` strings are not compiled by JIT. */

export const roleButtonClasses: Record<
  string,
  { selected: string; iconSelected: string; textSelected: string; subtextSelected: string }
> = {
  cyan: {
    selected: 'border-cyan-500 bg-cyan-50 text-cyan-700',
    iconSelected: 'bg-cyan-100 text-cyan-600',
    textSelected: 'text-cyan-700',
    subtextSelected: 'text-cyan-600/80',
  },
  emerald: {
    selected: 'border-emerald-500 bg-emerald-50 text-emerald-700',
    iconSelected: 'bg-emerald-100 text-emerald-600',
    textSelected: 'text-emerald-700',
    subtextSelected: 'text-emerald-600/80',
  },
  sky: {
    selected: 'border-sky-500 bg-sky-50 text-sky-700',
    iconSelected: 'bg-sky-100 text-sky-600',
    textSelected: 'text-sky-700',
    subtextSelected: 'text-sky-600/80',
  },
};

export const kpiIconClasses: Record<string, { bg: string; text: string }> = {
  sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-600' },
};

export const accentNavClasses: Record<
  string,
  { active: string; icon: string; badge: string }
> = {
  sky: {
    active: 'bg-sky-50 text-sky-700',
    icon: 'text-sky-600',
    badge: 'bg-sky-200 text-sky-800',
  },
  emerald: {
    active: 'bg-emerald-50 text-emerald-700',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-200 text-emerald-800',
  },
  cyan: {
    active: 'bg-cyan-50 text-cyan-700',
    icon: 'text-cyan-600',
    badge: 'bg-cyan-200 text-cyan-800',
  },
};
