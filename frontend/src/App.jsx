import React from 'react';
import { useApp } from './context/AppContext';
import AuthScreen from './components/auth/AuthScreen';
import Sidebar from './components/layout/Sidebar';
import Toast from './components/layout/Toast';
import ClientBanner from './components/client/ClientBanner';
import QuickServiceCards from './components/client/QuickServiceCards';
import DriverDirectory from './components/client/DriverDirectory';
import DriverHeader from './components/driver/DriverHeader';
import OpenOrdersFeed from './components/driver/OpenOrdersFeed';
import ProfileScreen from './components/profile/ProfileScreen';
import OrderModal from './components/modals/OrderModal';
import DriverApplyModal from './components/modals/DriverApplyModal';

export default function App() {
  const { currentUser, isProfileOpen } = useApp();

  // Bloquea el acceso a las vistas internas si no existe una sesion activa
  if (!currentUser) {
    return (
      <>
        <AuthScreen />
        <Toast />
      </>
    );
  }

  const isClient = currentUser.role === 'client';
  const isDriver = currentUser.role === 'driver';

  const handleScrollToDirectory = () => {
    const directoryElement = document.getElementById('directory-section');
    if (directoryElement) {
      directoryElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      {/* Desplaza el contenido principal a la derecha en escritorio para respetar el ancho del sidebar */}
      <main className="flex-1 md:pl-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {isProfileOpen ? (
            <ProfileScreen />
          ) : (
            <>
              {isClient && (
                <div className="space-y-6">
                  <ClientBanner onScrollToDirectory={handleScrollToDirectory} />
                  <QuickServiceCards />
                  <DriverDirectory />
                </div>
              )}

              {isDriver && (
                <div className="space-y-6">
                  <DriverHeader />
                  <OpenOrdersFeed />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {isClient && <OrderModal />}
      {isDriver && <DriverApplyModal />}

      <Toast />
    </div>
  );
}