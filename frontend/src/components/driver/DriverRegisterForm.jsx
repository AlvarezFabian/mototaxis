import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function DriverRegisterForm({ onSuccess }) {
  const { registerDriver } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: 'moto',
    baseBarrio: '',
    plate: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.baseBarrio || !formData.plate) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }
    registerDriver(formData);
    setFormData({
      name: '',
      phone: '',
      vehicle: 'moto',
      baseBarrio: '',
      plate: ''
    });
    if (onSuccess) onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Registrar Nuevo Conductor en la Red</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Formulario para ingresar nuevos mototaxistas o motocarros al directorio oficial de Sabanalarga.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: Mario Andrés Fontalvo"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Número de Celular (WhatsApp)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Ej: 3012345678"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Vehículo</label>
              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="moto">Motocicleta</option>
                <option value="motocarro">Motocarro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Barrio Base / Acopio</label>
              <input
                type="text"
                name="baseBarrio"
                value={formData.baseBarrio}
                onChange={handleChange}
                required
                placeholder="Ej: Barrio San Antonio"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Placa del Vehículo</label>
              <input
                type="text"
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                required
                placeholder="Ej: HTY-44E"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow transition-all active:scale-[0.99]"
            >
              Guardar Conductor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
