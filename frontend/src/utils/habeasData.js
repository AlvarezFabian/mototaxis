/**
 * Utilidades para el cumplimiento de la Ley 1581 de 2012 (Habeas Data)
 * Protege los datos sensibles de los clientes en vistas públicas.
 */

export const MASKED_PHONE_LABEL = "🔒 Teléfono oculto por Ley 1581";

/**
 * Enmascara un número telefónico mostrando solo los últimos dígitos si se requiere,
 * o un mensaje de bloqueo oficial para bolsas abiertas de pedidos.
 * @param {string} phone 
 * @param {boolean} fullMask 
 * @returns {string}
 */
export function maskPhoneNumber(phone, fullMask = true) {
  if (!phone) return MASKED_PHONE_LABEL;
  if (fullMask) return MASKED_PHONE_LABEL;
  
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 4) return '***-***-****';
  return `***-***-${clean.slice(-4)}`;
}

/**
 * Sanitiza el número de teléfono para su uso en enlaces de WhatsApp colombianos (+57).
 * @param {string} phone 
 * @returns {string}
 */
export function formatColombianPhoneForWA(phone) {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('57')) {
    return clean;
  }
  return `57${clean}`;
}
