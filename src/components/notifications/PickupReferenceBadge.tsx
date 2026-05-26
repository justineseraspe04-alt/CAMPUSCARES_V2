import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';

interface PickupReferenceBadgeProps {
  referenceNumber: string;
  accent?: 'sky' | 'emerald' | 'cyan';
}

export function PickupReferenceBadge({ referenceNumber, accent = 'sky' }: PickupReferenceBadgeProps) {
  const [copied, setCopied] = useState(false);

  const accentClasses =
    accent === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : accent === 'cyan'
        ? 'border-cyan-200 bg-cyan-50 text-cyan-800'
        : 'border-sky-200 bg-sky-50 text-sky-800';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`mt-3 rounded-xl border px-4 py-3 ${accentClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">
        Pickup Reference No.
      </p>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-sm font-bold break-all">{referenceNumber}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-current/20 bg-white/60 px-2.5 py-1.5 text-xs font-medium hover:bg-white transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5" /> Copied
            </>
          ) : (
            <>
              <CopyIcon className="w-3.5 h-3.5" /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
