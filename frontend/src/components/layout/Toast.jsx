import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-slate-700 animate-fade-in">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{toast.message}</span>
    </div>
  );
}
