// ./lib/messageProcessor.js (Código Final y Corregido)

/**
 * Procesa el mensaje del usuario y decide si responder con una auto-respuesta.
 * @param {object} conn - Objeto de conexión del bot (WhatsApp Connection).
 * @param {object} m - Objeto de mensaje normalizado (smsg).
 * @returns {Promise<boolean>} True si el procesamiento del mensaje DEBE detenerse (porque ya se respondió), False si debe continuar.
 */
export async function messageProcessor(conn, m) {
    
    if (!m.text || m.isBaileys) return false;

    // 1. Convertir el texto a minúsculas, quitar acentos y espacios extra.
    const mensajeLimpio = m.text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    let respuesta = '';

    // --- Definición de Autorespuestas (Nuevas y Existentes) ---
    
    // Si dice 'so' (buscamos la frase completa o la palabra 'so' aislada)
    if (mensajeLimpio.includes('que') && mensajeLimpio.length <= 5) {
        respuesta = 'so';
    } 
    // Si dice 'rra' (buscamos la frase completa o la palabra 'rra' aislada)
    else if (mensajeLimpio.includes('rra') && mensajeLimpio.length <= 5) {
        respuesta = 'rrallada esta tu madre despues de que la cogi y haci';
    }
    // Si dice 'pene'
    else if (mensajeLimpio.includes('pene')) {
        // 🟢 RESPUESTA ACTUALIZADA SEGÚN TU PETICIÓN
        respuesta = 'comes';
    } 
    // Respuestas originales
    else if (mensajeLimpio.includes('hola')) {
        respuesta = 'Hola, ¿qué tal?';
    } else if (mensajeLimpio.includes('bot de mierda')) {
        respuesta = 'Más mierda fue tu nacimiento';
    } else if (mensajeLimpio.includes('gay')) {
        respuesta = 'Eres';
    } 
    
    // 2. Comprobación y Respuesta
    if (respuesta) {
        // Enviar la respuesta usando conn.reply
        await conn.reply(m.chat, respuesta, m, {
            // para asegurar que siempre sea una respuesta directa al mensaje del usuario
            quoted: m 
        });
        
        // Devolver 'true' para indicar que ya respondimos y el 'handler' principal debe ignorar este mensaje
        return true; 
    }

    // 3. Si no hay coincidencias, devolvemos 'false' para que el 'handler' siga buscando comandos.
    return false;
}
