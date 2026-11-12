import React from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Search } from 'lucide-react';

export default function ClientBanner({ onScrollToDirectory }) {
  const { openOrderModal } = useApp();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
      <div className="space-y-1 max-w-2xl">
       
        <h1 className="text-xl font-bold text-slate-900">¿Necesitas una carrera, mandado o envío?</h1>
        <p className="text-sm text-slate-600">
          Publica una solicitud abierta para recibir postulaciones con tarifa de los conductores disponibles, o selecciona directamente a uno del directorio.
        </p>
      </div>

      {/* Acciones Principales */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <button
          onClick={() => openOrderModal('Carrera urbana')}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Megaphone className="w-5 h-5" />
          <span>Publicar Solicitud Abierta</span>
        </button>
        <button
          onClick={onScrollToDirectory}
          className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span>Ver Directorio</span>
        </button>
      </div>
    </div>
  );
}
