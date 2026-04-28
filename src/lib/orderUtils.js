import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Saves an order to Firestore and returns the orderId
 */
export const saveOrderToDb = async (artifacts, userData, total) => {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      clientName: userData.name,
      clientPhone: userData.phone,
      zone: userData.zone || 'No especificada',
      items: artifacts,
      totalInvestment: total,
      createdAt: serverTimestamp(),
      status: 'PENDING_VALIDATION'
    });
    return orderRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};

/**
 * Generates a formatted WhatsApp link for order inquiry
 * @param {Array} artifacts - The list of deployed artifacts
 * @param {Object} userData - Customer data (name, phone)
 * @param {number} total - Total price
 * @param {string} orderId - The Firestore document ID
 */
export const generateWhatsAppLink = (artifacts, userData, total, orderId = null) => {
  const ADMIN_PHONE = "6321059822";
  const BASE_URL = window.location.origin;
  
  let message = `🚀 *NUEVA SOLICITUD DE DESPLIEGUE - NOVAFRAME*\n\n`;
  message += `👤 *CLIENTE:* ${userData.name.toUpperCase()}\n`;
  message += `📱 *TELÉFONO:* ${userData.phone}\n`;
  
  if (orderId) {
    message += `🔗 *VALIDACIÓN TÁCTICA:* ${BASE_URL}/admin/orders?id=${orderId}\n`;
  }

  message += `\n----------------------------------\n`;
  message += `📦 *DETALLE DEL PEDIDO:*\n\n`;

  artifacts.forEach((art, index) => {
    message += `${index + 1}. *${art.name.toUpperCase()}*\n`;
    message += `   - Protocolo: ${art.size}\n`;
    message += `   - Material: ${art.finish}\n`;
    message += `   - Variante: ${art.variant?.toUpperCase() || 'Única'} ${art.subVariant ? `(VERSIÓN ${art.subVariant})` : ''}\n`;
    message += `   - Inversión: $${art.price}\n\n`;
  });

  message += `----------------------------------\n`;
  message += `💰 *INVERSIÓN TOTAL: $${total}*\n\n`;
  message += `_Este es un mensaje automático generado por el Nexus de NovaFrame._`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${ADMIN_PHONE}?text=${encodedMessage}`;
};
