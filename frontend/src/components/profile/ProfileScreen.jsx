import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ProfileScreen() {
  const { currentUser, updateUserProfile, closeProfile } = useApp();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    vehicle: currentUser?.vehicle || 'moto',
    vehicleModel: currentUser?.vehicleModel || '',
    plate: currentUser?.plate || '',
    baseBarrio: currentUser?.baseBarrio || '',
  });

  if (!currentUser) {
    return null;
  }

  const isDriver = currentUser.role === 'driver';
  const userInitial = formData.fullName?.charAt(0).toUpperCase() || 'U';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const updated = await updateUserProfile(formData);
    setIsSaving(false);

    if (updated) {
      closeProfile();
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-center pb-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <span className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
              {userInitial}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Mi Perfil</h2>
              <p className="text-xs text-slate-500">
                {isDriver ? 'Cuenta de Conductor' : 'Cuenta de Cliente'}
              </p>
            </div>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Numero de Telefono
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo Electronico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {isDriver && (
            <div className="pt-5 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Datos del Vehiculo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tipo de Vehiculo
                  </label>
                  <select
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-slate-900"
                  >
                    <option value="moto">Motocicleta</option>
                    <option value="motocarro">Motocarro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Placa
                  </label>
                  <input
                    type="text"
                    name="plate"
                    required
                    value={formData.plate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm uppercase focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Marca / Modelo
                  </label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    placeholder="Ej: Boxer CT 100"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Barrio Base
                  </label>
                  <input
                    type="text"
                    name="baseBarrio"
                    required
                    value={formData.baseBarrio}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeProfile}
              className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}