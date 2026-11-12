import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { currentUser, logoutUser, openProfile, closeProfile } = useApp();

  if (!currentUser) {
    return null;
  }

  const userInitial = currentUser.fullName?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={closeProfile}
          className="flex items-center space-x-2.5 text-left focus:outline-none"
        >
          <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            MR
          </span>
          <div>
            <span className="font-semibold text-base text-slate-900 block leading-none">
              MotoRed
            </span>
            <span className="text-xs text-slate-500">Sabanalarga</span>
          </div>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={openProfile}
            className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
              {userInitial}
            </span>
            <div className="hidden sm:block text-left">
              <span className="text-sm font-medium text-slate-800 block leading-tight">
                {currentUser.fullName}
              </span>
              <span className="text-xs text-slate-500 block">Mi Perfil</span>
            </div>
          </button>

          <button
            type="button"
            onClick={logoutUser}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}