import { formatColombianPhoneForWA } from '../utils/habeasData';

/**
 * Construye el texto formal estructurado para una solicitud de servicio.
 * @param {Object} data 
 * @returns {string}
 */
export function buildClientOrderMessage({
  serviceType,
  clientName,
  clientPhone,
  origin,
  destination,
  details,
  payment
}) {
  let text = `📌 *SOLICITUD MOTORED - SABANALARGA*\n\n`;
  text += `👤 *Cliente:* ${clientName || '[Nombre del cliente]'} (${clientPhone || '[Teléfono cliente]'})\n`;
  text += `🛵 *Servicio:* ${serviceType}\n`;
  text += `📍 *Origen:* ${origin || '[Origen]'}\n`;
  text += `🏡 *Destino:* ${destination || '[Destino]'}\n`;
  text += `📝 *Detalles:* ${details || '[Detalles]'}\n`;
  text += `💳 *Pago:* ${payment || 'Efectivo en mano'}\n\n`;
  text += `¿Hay algún conductor disponible para este servicio y cuál sería la tarifa?`;
  return text;
}

/**
 * Genera la URL de WhatsApp (wa.me) para enviar la solicitud directa a un conductor.
 * @param {string} driverPhone 
 * @param {string} messageText 
 * @returns {string}
 */
export function buildDriverDirectWhatsAppUrl(driverPhone, messageText) {
  const phone = formatColombianPhoneForWA(driverPhone);
  const encoded = encodeURIComponent(messageText);
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * Construye el mensaje de postulación oficial de un conductor hacia el cliente.
 * @param {Object} params
 * @returns {string}
 */
export function buildDriverProposalMessage({
  clientName,
  orderId,
  serviceType,
  price,
  time,
  driverName = "Carlos Mario Ruiz",
  plate = "KJL-88F"
}) {
  return `👋 ¡Hola ${clientName}! Te hablo de MotoRed Sabanalarga.\n\n` +
    `Me postulo para atender tu solicitud #${orderId} (${serviceType}).\n` +
    `💰 *Tarifa propuesta:* $${price || 'A convenir'} COP\n` +
    `⏱️ *Tiempo estimado de llegada:* ${time}\n` +
    `🛵 *Conductor:* ${driverName} (Placa ${plate})\n\n` +
    `¿Confirmamos el servicio?`;
}

/**
 * Genera la URL de WhatsApp (wa.me) para la postulación del conductor al cliente.
 * Desenmascara el teléfono del cliente de acuerdo a la autorización de Habeas Data.
 * @param {string} clientPhone 
 * @param {string} proposalText 
 * @returns {string}
 */
export function buildProposalWhatsAppUrl(clientPhone, proposalText) {
  const phone = formatColombianPhoneForWA(clientPhone);
  const encoded = encodeURIComponent(proposalText);
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * Genera la URL de Google Maps para trazar la ruta en Sabanalarga y municipios aledaños.
 * @param {string} origin 
 * @param {string} destination 
 * @returns {string}
 */
export function buildGoogleMapsRouteUrl(origin, destination) {
  const cleanOrigin = origin.toLowerCase().includes('barranquilla') 
    ? `${origin}, Atlantico, Colombia` 
    : `${origin}, Sabanalarga, Atlantico, Colombia`;

  const cleanDest = destination.toLowerCase().includes('barranquilla') 
    ? `${destination}, Atlantico, Colombia` 
    : `${destination}, Sabanalarga, Atlantico, Colombia`;

  const originQuery = encodeURIComponent(cleanOrigin);
  const destQuery = encodeURIComponent(cleanDest);
  return `https://www.google.com/maps/dir/?api=1&origin=${originQuery}&destination=${destQuery}&travelmode=driving`;
}
