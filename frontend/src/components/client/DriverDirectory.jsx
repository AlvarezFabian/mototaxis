import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import DriverCard from './DriverCard';
import { Search } from 'lucide-react';

export default function DriverDirectory() {
  const { drivers } = useApp();
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDrivers = useMemo(() => {
    const query = search.toLowerCase().trim();
    return drivers.filter(d => {
      const matchesText = d.baseBarrio.toLowerCase().includes(query) || d.name.toLowerCase().includes(query);
      const matchesVehicle = vehicleFilter === 'all' || d.vehicle === vehicleFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'disponible' && d.status === 'disponible');
      return matchesText && matchesVehicle && matchesStatus;
    });
  }, [drivers, search, vehicleFilter, statusFilter]);

  const handleReset = () => {
    setSearch('');
    setVehicleFilter('all');
    setStatusFilter('all');
  };

  return (
    <div id="directory-section" className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Directorio de Conductores Registrados</h2>
          <p className="text-xs text-slate-500">
            Selecciona un conductor específico para enviar una solicitud directa a su WhatsApp.
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda de Conductores */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por barrio (Centro, 7 de Agosto, Nevada)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">Todos los vehículos</option>
            <option value="moto">Motocicleta</option>
            <option value="motocarro">Motocarro</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">Todos los estados</option>
            <option value="disponible">Solo disponibles</option>
          </select>

          <button
            onClick={handleReset}
            className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 font-medium underline shrink-0"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Grid de Conductores */}
      {filteredDrivers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.map(driver => (
            <DriverCard key={driver.id} driver={driver} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-xs font-medium text-slate-500">
            No se encontraron conductores con los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  );
}
