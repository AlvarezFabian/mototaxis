import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, ShoppingBag, ArrowLeftRight } from 'lucide-react';

export default function QuickServiceCards() {
  const { openOrderModal } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Carrera Urbana */}
      <button
        onClick={() => openOrderModal('Carrera urbana')}
        className="p-4 bg-white border border-slate-200 hover:border-brand-500 rounded-xl shadow-sm text-left transition-all group hover:shadow-md"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="p-2.5 bg-slate-100 group-hover:bg-brand-50 rounded-lg text-slate-700 group-hover:text-brand-600 transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-brand-600 group-hover:underline">Solicitar ›</span>
        </div>
        <h3 className="font-bold text-slate-900 text-sm">Carrera Urbana</h3>
        <p className="text-xs text-slate-500 mt-0.5">Pide traslado inmediato entre barrios del municipio.</p>
      </button>

      {/* 2. Mandado de compra */}
      <button
        onClick={() => openOrderModal('Mandado de compra')}
        className="p-4 bg-white border border-slate-200 hover:border-brand-500 rounded-xl shadow-sm text-left transition-all group hover:shadow-md"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="p-2.5 bg-slate-100 group-hover:bg-brand-50 rounded-lg text-slate-700 group-hover:text-brand-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-brand-600 group-hover:underline">Solicitar ›</span>
        </div>
        <h3 className="font-bold text-slate-900 text-sm">Mandado o Compra</h3>
        <p className="text-xs text-slate-500 mt-0.5">Encarga compras en la plaza, farmacias o tiendas.</p>
      </button>

      {/* 3. Encomienda Barranquilla */}
      <button
        onClick={() => openOrderModal('Encomienda intermunicipal')}
        className="p-4 bg-white border border-slate-200 hover:border-brand-500 rounded-xl shadow-sm text-left transition-all group hover:shadow-md"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="p-2.5 bg-slate-100 group-hover:bg-brand-50 rounded-lg text-slate-700 group-hover:text-brand-600 transition-colors">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-brand-600 group-hover:underline">Solicitar ›</span>
        </div>
        <h3 className="font-bold text-slate-900 text-sm">Encomienda Barranquilla</h3>
        <p className="text-xs text-slate-500 mt-0.5">Envía paquetes o documentos a municipios en ruta.</p>
      </button>
    </div>
  );
}
