import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const {
    currentUser,
    logoutUser,
    isProfileOpen,
    openProfile,
    closeProfile,
    openOrdersCount,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) {
    return null;
  }

  const isDriver = currentUser.role === 'driver';
  const userInitial = currentUser.fullName?.charAt(0).toUpperCase() || 'U';

  const handleSelectSection = (section) => {
    if (section === 'profile') {
      openProfile();
    } else {
      closeProfile();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Barra superior compacta exclusiva para pantallas moviles */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menu de navegacion"
            className="p-2 -ml-2 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              MR
            </span>
            <span className="font-semibold text-slate-900 text-sm">MotoRed</span>
          </div>
        </div>
      </div>

      {/* Fondo oscuro semitransparente al desplegar el menu en movil */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity"
        />
      )}

      {/* Panel lateral desplegable en movil y fijo en escritorio */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
          <div>
            {/* Encabezado interno del sidebar con el logo de la aplicacion */}
            <div className="flex items-center justify-between px-2 py-3 mb-6">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  MR
                </span>
                <div>
                  <span className="font-semibold text-base text-slate-900 block leading-none">
                    MotoRed
                  </span>
                  <span className="text-xs text-slate-500">Sabanalarga</span>
                </div>
              </div>

              {/* Boton para cerrar el menu lateral en pantallas moviles */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Cerrar menu"
                className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Enlaces de navegacion por secciones */}
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => handleSelectSection('home')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  !isProfileOpen
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{isDriver ? 'Panel Conductor' : 'Inicio'}</span>
                {isDriver && openOrdersCount > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      !isProfileOpen
                        ? 'bg-white text-slate-900'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {openOrdersCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSelectSection('profile')}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isProfileOpen
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>Mi Perfil</span>
              </button>
            </nav>
          </div>

          {/* Informacion del usuario autenticado y cierre de sesion */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center space-x-3 px-2">
              <span className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center text-xs font-semibold shrink-0">
                {userInitial}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {currentUser.fullName}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {isDriver
                    ? `Conductor - ${currentUser.plate || 'Sin placa'}`
                    : 'Cliente'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logoutUser}
              className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              Cerrar Sesion
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}