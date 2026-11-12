import React from 'react';
import { useApp } from '../../context/AppContext';
import { buildGoogleMapsRouteUrl } from '../../services/whatsapp';
import { MASKED_PHONE_LABEL } from '../../utils/habeasData';
import { Send, Map, Lock } from 'lucide-react';

export default function OrderCard({ order }) {
  const { openApplyModal } = useApp();

  let badgeColor = 'bg-brand-50 text-brand-700 border-brand-200';
  if (order.serviceType === 'Mandado de compra') {
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (order.serviceType === 'Encomienda intermunicipal') {
    badgeColor = 'bg-purple-50 text-purple-800 border-purple-200';
  }

  const handleOpenMaps = () => {
    const url = buildGoogleMapsRouteUrl(order.origin, order.destination);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${badgeColor}`}>
            {order.serviceType}
          </span>
          <span className="text-[11px] font-medium text-slate-400">{order.createdAt}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{order.clientName}</h4>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded mt-0.5">
              <Lock className="w-3 h-3 text-amber-600" />
              {MASKED_PHONE_LABEL}
            </span>
          </div>
          <span className="text-[11px] text-brand-600 bg-brand-50 px-2 py-1 rounded-md font-medium">
            {order.applicantsCount || 0} postulaciones
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div><strong className="text-slate-900">Origen:</strong> {order.origin}</div>
          <div><strong className="text-slate-900">Destino:</strong> {order.destination}</div>
          <div><strong className="text-slate-900">Detalles:</strong> {order.details}</div>
          <div><strong className="text-slate-900">Pago:</strong> {order.payment}</div>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => openApplyModal(order.id)}
            className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg shadow flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
          >
            <Send className="w-4 h-4" />
            <span>Postularme al Servicio</span>
          </button>

          <button
            onClick={handleOpenMaps}
            title="Ver Ruta en Google Maps"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center justify-center border border-slate-200"
          >
            <Map className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
