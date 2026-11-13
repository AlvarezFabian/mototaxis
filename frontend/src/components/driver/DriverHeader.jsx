import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lock } from 'lucide-react';

export default function DriverHeader() {
  const { currentDriver, driverOnline, isUpdatingDriverStatus, toggleDriverStatus } = useApp();

  return (
    <div className="space-y-4">
      {/* Encabezado operativo del panel del conductor */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-400/30">
              Modo Conductor Activo
            </span>
            <span className="text-xs text-slate-400">
              {currentDriver.name} (Placa: {currentDriver.plate})
            </span>
          </div>
          <h2 className="text-lg font-bold">Bolsa de Pedidos Publicos</h2>
          <p className="text-xs text-slate-300">
            Revisa las solicitudes de la comunidad. Postulate con tu tarifa estimada y abre la ruta en Google Maps.
          </p>
        </div>

        {/* Interruptor de disponibilidad sincronizado con la base de datos */}
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center gap-3 shrink-0">
          <span className="text-xs font-medium text-slate-300">Estado:</span>
          <button
            onClick={toggleDriverStatus}
            disabled={isUpdatingDriverStatus}
            className={`px-3 py-1.5 font-medium text-xs rounded-md shadow flex items-center gap-1.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              driverOnline
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${driverOnline ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></span>
            <span>{driverOnline ? 'Disponible' : 'Fuera de Servicio'}</span>
          </button>
        </div>
      </div>

      {/* Aviso de proteccion de datos personales */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Modo Privacidad Activo:</strong> Los numeros telefonicos estan protegidos bajo la <strong>Ley 1581 de 2012</strong> y solo se revelan al postularte formalmente al servicio.
          </span>
        </div>
      </div>
    </div>
  );
}