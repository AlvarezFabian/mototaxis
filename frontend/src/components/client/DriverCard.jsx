import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Star, ArrowRight } from 'lucide-react';

export default function DriverCard({ driver }) {
  const { openOrderModal } = useApp();
  const isAvailable = driver.status === 'disponible';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">{driver.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {driver.vehicle === 'moto' ? 'Motocicleta' : 'Motocarro'} • {driver.vehicleModel}
            </p>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
            isAvailable 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
            }`}></span>
            {isAvailable ? 'Disponible' : 'En servicio'}
          </span>
        </div>

        <div className="space-y-2 mb-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Base: <strong className="text-slate-800">{driver.baseBarrio}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
            <span><strong>{driver.rating}</strong> ({driver.tripsCount} carreras)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {driver.services.map((s, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md">
              {s}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => openOrderModal('Carrera urbana', driver)}
        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
      >
        <span>Solicitar a este Conductor</span>
        <ArrowRight className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
}
