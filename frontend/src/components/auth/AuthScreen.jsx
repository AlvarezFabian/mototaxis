import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AuthScreen() {
  const { loginUser, registerUser } = useApp();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    identifier: '',
    fullName: '',
    phone: '',
    email: '',
    password: '',
    role: 'client',
    vehicle: 'moto',
    vehicleModel: '',
    plate: '',
    baseBarrio: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (isLoginMode) {
      await loginUser(formData.identifier, formData.password);
      setIsSubmitting(false);
      return;
    }

    // Excluye el campo exclusivo de inicio de sesion antes de enviar el registro
    const { identifier, ...registrationPayload } = formData;
    await registerUser(registrationPayload);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">MotoRed Sabanalarga</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoginMode
              ? 'Inicia sesion con tu celular o correo electronico'
              : 'Crea tu cuenta y elige tu rol en la plataforma'}
          </p>
        </div>

        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setIsLoginMode(true)}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              isLoginMode
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Iniciar Sesion
          </button>
          <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              !isLoginMode
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Registrarme
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isLoginMode ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Celular o Correo Electronico
              </label>
              <input
                type="text"
                name="identifier"
                required
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Ej: 3001234567 o usuario@correo.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Tipo de Cuenta (Rol)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'client' }))}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${
                      formData.role === 'client'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Soy Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'driver' }))}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${
                      formData.role === 'driver'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Soy Conductor
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ej: Fabian Alvarez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Numero de Celular
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej: 3001234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Correo Electronico (Opcional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej: fabian@correo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {!isLoginMode && formData.role === 'driver' && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Vehiculo
                  </label>
                  <select
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="moto">Moto</option>
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
                    placeholder="KJL-88F"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Barrio Base en Sabanalarga
                </label>
                <input
                  type="text"
                  name="baseBarrio"
                  required
                  value={formData.baseBarrio}
                  onChange={handleChange}
                  placeholder="Ej: Barrio Centro"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? 'Procesando...'
              : isLoginMode
              ? 'Entrar a MotoRed'
              : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}