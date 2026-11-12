import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function AppProvider({ children }) {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('motored_token'));
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('motored_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Define la vista principal automaticamente segun el rol autenticado
  const activeView = currentUser?.role === 'driver' ? 'driver' : 'client';

  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controla si la pantalla de edicion de perfil esta visible
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [driverOnline, setDriverOnline] = useState(true);
  const currentDriver = {
    name: currentUser?.fullName || 'Conductor',
    plate: currentUser?.plate || 'SIN-PLACA',
    phone: currentUser?.phone || '',
  };

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalPreset, setOrderModalPreset] = useState('Carrera urbana');
  const [selectedDriverForDirect, setSelectedDriverForDirect] = useState(null);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [currentApplyingOrder, setCurrentApplyingOrder] = useState(null);

  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3500);
  };

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);

  const saveSession = (token, user) => {
    localStorage.setItem('motored_token', token);
    localStorage.setItem('motored_user', JSON.stringify(user));
    setAuthToken(token);
    setCurrentUser(user);
  };

  const logoutUser = () => {
    localStorage.removeItem('motored_token');
    localStorage.removeItem('motored_user');
    setAuthToken(null);
    setCurrentUser(null);
    setIsProfileOpen(false);
    showToast('Sesion cerrada correctamente.');
  };

  const loginUser = async (identifier, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.detail || 'Credenciales invalidas.');
        return false;
      }

      saveSession(data.accessToken, data.user);
      showToast(`Bienvenido, ${data.user.fullName}`);
      return true;
    } catch (error) {
      console.error(error);
      showToast('No se pudo conectar con el servidor de autenticacion.');
      return false;
    }
  };

  const registerUser = async (registrationData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.detail || 'Error al registrar la cuenta.');
        return false;
      }

      saveSession(data.accessToken, data.user);
      await fetchAllData();
      showToast(`Cuenta creada con rol de ${data.user.role === 'driver' ? 'Conductor' : 'Cliente'}.`);
      return true;
    } catch (error) {
      console.error(error);
      showToast('Error de conexion al crear la cuenta.');
      return false;
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.detail || 'No se pudo actualizar el perfil.');
        return false;
      }

      // Sincroniza los cambios en memoria y almacenamiento local sin cerrar sesion
      localStorage.setItem('motored_user', JSON.stringify(data));
      setCurrentUser(data);
      await fetchAllData();
      showToast('Perfil actualizado correctamente.');
      return true;
    } catch (error) {
      console.error(error);
      showToast('Error de conexion al guardar el perfil.');
      return false;
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [driversRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/api/drivers`),
        fetch(`${API_URL}/api/orders`),
      ]);

      if (driversRes.ok) {
        const driversData = await driversRes.json();
        setDrivers(driversData);
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error conectando con el backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  const switchView = () => {
    showToast('Tu vista esta asignada segun el rol de tu cuenta.');
  };

  const toggleDriverStatus = () => {
    setDriverOnline((prev) => {
      const next = !prev;
      showToast(
        next
          ? 'Ahora estas marcado como Disponible para recibir carreras.'
          : 'Estado cambiado a Fuera de servicio.'
      );
      return next;
    });
  };

  const openOrderModal = (presetService = 'Carrera urbana', directDriver = null) => {
    setOrderModalPreset(presetService);
    setSelectedDriverForDirect(directDriver);
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedDriverForDirect(null);
  };

  const openApplyModal = (orderId) => {
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      setCurrentApplyingOrder(target);
      setIsApplyModalOpen(true);
    }
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
    setCurrentApplyingOrder(null);
  };

  const addOrder = async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          serviceType: orderData.serviceType,
          clientName: currentUser?.fullName || orderData.clientName,
          clientPhone: currentUser?.phone || orderData.clientPhone,
          origin: orderData.origin,
          destination: orderData.destination,
          details: orderData.details || '',
          payment: orderData.payment,
          habeasDataAccepted: true,
        }),
      });

      if (!response.ok) throw new Error('Error al guardar la solicitud');

      const createdOrder = await response.json();
      setOrders((prev) => [createdOrder, ...prev]);
      closeOrderModal();
      showToast('Solicitud publicada correctamente.');
      return createdOrder;
    } catch (error) {
      console.error(error);
      showToast('Error al publicar la solicitud.');
      return null;
    }
  };

  const applyToOrder = async (orderId, price, time) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          price: price || 'A convenir',
          time: time,
          driverName: currentDriver.name,
          driverPlate: currentDriver.plate,
        }),
      });

      if (!response.ok) throw new Error('Error al enviar la postulacion');

      const data = await response.json();

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, applicantsCount: (o.applicantsCount || 0) + 1 } : o
        )
      );

      closeApplyModal();
      showToast(`Postulacion enviada a ${data.clientName}.`);

      return { waUrl: data.whatsappUrl, message: data.messageText };
    } catch (error) {
      console.error(error);
      showToast('No se pudo registrar la postulacion.');
      return null;
    }
  };

  const registerDriver = async (driverData) => {
    try {
      const response = await fetch(`${API_URL}/api/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: driverData.name,
          phone: driverData.phone,
          vehicle: driverData.vehicle,
          vehicleModel:
            driverData.vehicleModel ||
            (driverData.vehicle === 'moto' ? 'Motocicleta Estandar' : 'Motocarro de Carga'),
          plate: driverData.plate.toUpperCase(),
          baseBarrio: driverData.baseBarrio,
        }),
      });

      if (!response.ok) throw new Error('Error al registrar conductor');

      const createdDriver = await response.json();
      setDrivers((prev) => [...prev, createdDriver]);
      showToast(`Conductor ${createdDriver.name} guardado.`);
      return createdDriver;
    } catch (error) {
      console.error(error);
      showToast('Error al registrar el conductor.');
      return null;
    }
  };

  const openOrdersCount = orders.filter((o) => o.status === 'pendiente').length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authToken,
        loginUser,
        registerUser,
        updateUserProfile,
        logoutUser,
        isProfileOpen,
        openProfile,
        closeProfile,
        activeView,
        switchView,
        drivers,
        orders,
        loading,
        fetchAllData,
        openOrdersCount,
        driverOnline,
        toggleDriverStatus,
        currentDriver,
        isOrderModalOpen,
        orderModalPreset,
        selectedDriverForDirect,
        openOrderModal,
        closeOrderModal,
        isApplyModalOpen,
        currentApplyingOrder,
        openApplyModal,
        closeApplyModal,
        addOrder,
        applyToOrder,
        registerDriver,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
}