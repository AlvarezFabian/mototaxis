import React from 'react';
import { useApp } from '../../context/AppContext';
import OrderCard from './OrderCard';
import { RefreshCw, Inbox } from 'lucide-react';

export default function OpenOrdersFeed() {
  const { orders, showToast } = useApp();
  const pendingOrders = orders.filter(o => o.status === 'pendiente');

  const handleRefresh = () => {
    showToast('Bolsa de pedidos sincronizada.');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Solicitudes enviadas recientemente por la comunidad:</span>
        <button
          onClick={handleRefresh}
          className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {pendingOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-800">No hay solicitudes pendientes en este momento</p>
          <p className="text-xs text-slate-500 mt-1">
            Las nuevas solicitudes creadas por clientes aparecerán aquí en tiempo real.
          </p>
        </div>
      )}
    </div>
  );
}
