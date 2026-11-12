import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, ShieldCheck } from 'lucide-react';

export default function DriverApplyModal() {
  const { 
    isApplyModalOpen, 
    closeApplyModal, 
    currentApplyingOrder, 
    applyToOrder 
  } = useApp();

  const [price, setPrice] = useState('');
  const [time, setTime] = useState('5 minutos');

  if (!isApplyModalOpen || !currentApplyingOrder) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = applyToOrder(currentApplyingOrder.id, price, time);
    if (result && result.waUrl) {
      window.open(result.waUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Postularme a esta Solicitud</h3>
            <p className="text-xs text-slate-300">Orden #{currentApplyingOrder.id}</p>
          </div>
          <button 
            onClick={closeApplyModal} 
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
            <div><strong className="text-slate-900">Cliente:</strong> {currentApplyingOrder.clientName}</div>
            <div><strong className="text-slate-900">Servicio:</strong> {currentApplyingOrder.serviceType}</div>
            <div><strong className="text-slate-900">Ruta:</strong> {currentApplyingOrder.origin} ➔ {currentApplyingOrder.destination}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tu Tarifa Propuesta ($ COP)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej: 4000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tiempo de Llegada</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="5 minutos">5 minutos</option>
                <option value="10 minutos">10 minutos</option>
                <option value="15 minutos">15 minutos</option>
                <option value="En camino inmediato">En camino inmediato</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>
              Al postularte se desenmascarará el teléfono del cliente para iniciar el chat oficial con tu propuesta estructurada.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeApplyModal}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-wa-500 hover:bg-wa-600 text-white font-semibold text-xs rounded-lg shadow flex items-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Postulación por WhatsApp</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
