import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { buildClientOrderMessage, buildDriverDirectWhatsAppUrl } from '../../services/whatsapp';
import { X, Copy, Send, CheckSquare } from 'lucide-react';

export default function OrderModal() {
  const { 
    isOrderModalOpen, 
    closeOrderModal, 
    orderModalPreset, 
    selectedDriverForDirect, 
    addOrder,
    showToast 
  } = useApp();

  const [serviceType, setServiceType] = useState('Carrera urbana');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [payment, setPayment] = useState('Efectivo en mano');
  const [habeasDataAccepted, setHabeasDataAccepted] = useState(true);

  // Carrera Urbana
  const [carreraOrigin, setCarreraOrigin] = useState('');
  const [carreraDest, setCarreraDest] = useState('');
  const [carreraPass, setCarreraPass] = useState('1 pasajero');
  const [carreraNotes, setCarreraNotes] = useState('');

  // Mandado / Compra
  const [mandadoPlace, setMandadoPlace] = useState('');
  const [mandadoDelivery, setMandadoDelivery] = useState('');
  const [mandadoItems, setMandadoItems] = useState('');
  const [mandadoMoney, setMandadoMoney] = useState('No, el pedido ya está pagado o se paga al recoger');

  // Encomienda Intermunicipal
  const [encomiendaOrigin, setEncomiendaOrigin] = useState('');
  const [encomiendaDest, setEncomiendaDest] = useState('');
  const [encomiendaPackage, setEncomiendaPackage] = useState('');
  const [encomiendaReceiverName, setEncomiendaReceiverName] = useState('');
  const [encomiendaReceiverPhone, setEncomiendaReceiverPhone] = useState('');

  useEffect(() => {
    if (orderModalPreset) {
      setServiceType(orderModalPreset);
    }
  }, [orderModalPreset, isOrderModalOpen]);

  if (!isOrderModalOpen) return null;

  // Construir origen, destino y detalles según tipo
  let origin = '';
  let destination = '';
  let details = '';

  if (serviceType === 'Carrera urbana') {
    origin = carreraOrigin;
    destination = carreraDest;
    details = `${carreraPass}${carreraNotes ? ' - ' + carreraNotes : ''}`;
  } else if (serviceType === 'Mandado de compra') {
    origin = mandadoPlace;
    destination = mandadoDelivery;
    details = `Productos: ${mandadoItems}. Dinero: ${mandadoMoney}`;
  } else if (serviceType === 'Encomienda intermunicipal') {
    origin = encomiendaOrigin;
    destination = encomiendaDest;
    details = `Paquete: ${encomiendaPackage}. Recibe: ${encomiendaReceiverName} (${encomiendaReceiverPhone})`;
  }

  const previewText = buildClientOrderMessage({
    serviceType,
    clientName,
    clientPhone,
    origin,
    destination,
    details,
    payment
  });

  const handleCopyMessage = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(previewText);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = previewText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    showToast("Mensaje copiado al portapapeles.");
  };

  const handlePublishToBolsa = () => {
    if (!habeasDataAccepted) {
      alert('Debes aceptar la autorización de tratamiento de datos para continuar.');
      return;
    }
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor ingresa tu nombre y teléfono de contacto.');
      return;
    }
    if (!origin.trim() || !destination.trim()) {
      alert('Por favor completa el origen y destino del servicio.');
      return;
    }

    addOrder({
      serviceType,
      clientName,
      clientPhone,
      origin,
      destination,
      details,
      payment
    });
  };

  const handleSendDirectToDriver = () => {
    if (!selectedDriverForDirect) return;
    if (!habeasDataAccepted) {
      alert('Debes aceptar la autorización de tratamiento de datos para continuar.');
      return;
    }
    const waUrl = buildDriverDirectWhatsAppUrl(selectedDriverForDirect.phone, previewText);
    window.open(waUrl, '_blank');
    closeOrderModal();
    showToast(`Abriendo WhatsApp con ${selectedDriverForDirect.name}...`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">
              {selectedDriverForDirect 
                ? `Solicitar a ${selectedDriverForDirect.name}` 
                : 'Publicar Solicitud Abierta'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {selectedDriverForDirect 
                ? `Mensaje directo para: ${selectedDriverForDirect.name} (${selectedDriverForDirect.vehicle === 'moto' ? 'Moto' : 'Motocarro'} - ${selectedDriverForDirect.plate})`
                : 'Destino: Bolsa Pública (Visible para todos los conductores libres)'}
            </p>
          </div>
          <button 
            onClick={closeOrderModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal (Formulario Adaptable por Servicio) */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">

          {/* 1. Selección Tipo de Servicio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Servicio Requerido</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50 font-medium text-slate-800"
            >
              <option value="Carrera urbana">Carrera Urbana (Traslado de Persona)</option>
              <option value="Mandado de compra">Mandado o Compra de Productos</option>
              <option value="Encomienda intermunicipal">Encomienda / Envío a Barranquilla u otro municipio</option>
            </select>
          </div>

          {/* Campos Comunes: Cliente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tu Nombre</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej: María Gómez"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tu Teléfono (WhatsApp)</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Ej: 3001234567"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* SECCIÓN DINÁMICA A: Carrera Urbana */}
          {serviceType === 'Carrera urbana' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Barrio u Origen de Recogida</label>
                  <input
                    type="text"
                    value={carreraOrigin}
                    onChange={(e) => setCarreraOrigin(e.target.value)}
                    placeholder="Ej: Barrio Centro (Cerca al Banco Agrario)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Usa puntos de referencia, no tu dirección exacta.</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Barrio u Destino Final</label>
                  <input
                    type="text"
                    value={carreraDest}
                    onChange={(e) => setCarreraDest(e.target.value)}
                    placeholder="Ej: Barrio 7 de Agosto (Por la cancha)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Número de Pasajeros</label>
                  <select
                    value={carreraPass}
                    onChange={(e) => setCarreraPass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  >
                    <option value="1 pasajero">1 Pasajero</option>
                    <option value="2 pasajeros (Requiere Motocarro o 2 motos)">2 Pasajeros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nota adicional</label>
                  <input
                    type="text"
                    value={carreraNotes}
                    onChange={(e) => setCarreraNotes(e.target.value)}
                    placeholder="Ej: Llevo bolso pesado / Salgo en 5 min"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN DINÁMICA B: Mandado / Compra */}
          {serviceType === 'Mandado de compra' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">¿Dónde realizar la compra?</label>
                  <input
                    type="text"
                    value={mandadoPlace}
                    onChange={(e) => setMandadoPlace(e.target.value)}
                    placeholder="Ej: Plaza de Mercado / Droguería Inglesa"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección de Entrega</label>
                  <input
                    type="text"
                    value={mandadoDelivery}
                    onChange={(e) => setMandadoDelivery(e.target.value)}
                    placeholder="Ej: Barrio San Antonio (Transversal 14 #5-12)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lista detallada de Productos</label>
                <textarea
                  rows={2}
                  value={mandadoItems}
                  onChange={(e) => setMandadoItems(e.target.value)}
                  placeholder="Ej: 2 kilos de queso costeño duro, 1 bolsa de suero y 1 cartón de huevos"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">¿El conductor debe llevar dinero para la compra?</label>
                <select
                  value={mandadoMoney}
                  onChange={(e) => setMandadoMoney(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                >
                  <option value="No, el pedido ya está pagado o se paga al recoger">No (Ya está pagado o solo recoger)</option>
                  <option value="Sí, el conductor debe comprar (Aprox $20.000 a $40.000)">Sí (Comprar y cobrar contra entrega)</option>
                </select>
              </div>
            </div>
          )}

          {/* SECCIÓN DINÁMICA C: Encomienda Intermunicipal */}
          {serviceType === 'Encomienda intermunicipal' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Origen (Sabanalarga)</label>
                  <input
                    type="text"
                    value={encomiendaOrigin}
                    onChange={(e) => setEncomiendaOrigin(e.target.value)}
                    placeholder="Ej: Nevada de buses / Casa cliente"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Municipio / Destino Final</label>
                  <input
                    type="text"
                    value={encomiendaDest}
                    onChange={(e) => setEncomiendaDest(e.target.value)}
                    placeholder="Ej: Barranquilla (Calle 72 # 45-10)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción del Paquete o Documento</label>
                <input
                  type="text"
                  value={encomiendaPackage}
                  onChange={(e) => setEncomiendaPackage(e.target.value)}
                  placeholder="Ej: Caja mediana de repuestos mecánicos (Aprox 3 kg)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de quien recibe en Destino</label>
                  <input
                    type="text"
                    value={encomiendaReceiverName}
                    onChange={(e) => setEncomiendaReceiverName(e.target.value)}
                    placeholder="Ej: Pedro Ruiz"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono de quien recibe</label>
                  <input
                    type="tel"
                    value={encomiendaReceiverPhone}
                    onChange={(e) => setEncomiendaReceiverPhone(e.target.value)}
                    placeholder="Ej: 3109876543"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Método de Pago */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Forma de Pago Acordada</label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
            >
              <option value="Efectivo en mano">Efectivo en mano</option>
              <option value="Transferencia Nequi">Transferencia Nequi</option>
              <option value="Transferencia Daviplata">Transferencia Daviplata</option>
            </select>
          </div>

          {/* Cláusula de Protección de Datos (Habeas Data - Ley 1581) */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={habeasDataAccepted}
                onChange={(e) => setHabeasDataAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-[11px] text-slate-500 leading-tight">
                Autorizo el tratamiento de mis datos personales únicamente para la gestión de esta solicitud según la <strong>Ley 1581 de 2012</strong>. Tu teléfono no se publicará abiertamente.
              </span>
            </label>
          </div>

          {/* Vista Previa Mensaje */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">VISTA PREVIA DEL MENSAJE (PRIVADO VÍA WHATSAPP):</label>
            <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 whitespace-pre-wrap">
              {previewText}
            </div>
          </div>

        </div>

        {/* Footer Modal con Acciones */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopyMessage}
            className="w-full sm:w-auto px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar Mensaje</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2 flex-1 justify-end">
            {selectedDriverForDirect ? (
              <button
                onClick={handleSendDirectToDriver}
                className="w-full sm:w-auto px-5 py-2.5 bg-wa-500 hover:bg-wa-600 text-white font-semibold text-sm rounded-lg shadow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>Enviar por WhatsApp a Conductor</span>
              </button>
            ) : (
              <button
                onClick={handlePublishToBolsa}
                className="w-full sm:w-auto px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-lg shadow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>Publicar en Bolsa de Pedidos</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
