/**
 * Procesa el mensaje del usuario y decide si responder con una auto-respuesta.
 * @param {object} conn - Objeto de conexión del bot (WhatsApp Connection).
 * @param {object} m - Objeto de mensaje normalizado (smsg).
 * @returns {Promise<boolean>} True si el procesamiento del mensaje DEBE detenerse (porque ya se respondió), False si debe continuar.
 */
export async function messageProcessor(conn, m) {
    // Si no hay texto, es un mensaje del propio bot (isBaileys) o es un mensaje no-texto, ignorar.
    if (!m.text || m.isBaileys) return false;

    // --- 1. FILTROS DE IGNORACIÓN PARA MÁXIMA OPTIMIZACIÓN ---

    // a) Ignorar si NO es un mensaje de texto (sticker, imagen, video, etc.)
    if (m.type !== 'text') {
        return false;
    }

    // b) Ignorar mensajes que comienzan con prefijos comunes de comandos.
    const commandPrefixes = ['#', '/', '!', '$', '>', '=', '.', '¿', '¡', '?', '¿', '¡', '>', '<', '(', ')'];
    const startsWithCommandPrefix = commandPrefixes.some(prefix => m.text.trim().startsWith(prefix));

    if (startsWithCommandPrefix) {
        // Devolvemos false para que el 'handler' principal lo procese como un comando.
        return false;
    }
    
    // c) Ignorar mensajes que intentan ser "binarios" o saturadores.
    // Usamos una expresión regular para buscar caracteres no imprimibles o de control.
    // (\p{C}) es una propiedad de Unicode que incluye caracteres de control, formato, sin asignar, y privados.
    // Si contiene más de 5 caracteres de control, lo descartamos.
    const controlCharCount = (m.text.match(/[\p{C}\u200B-\u200F\uFEFF]/gu) || []).length;
    if (controlCharCount > 5) {
        console.log(`[Processor] Mensaje ignorado: Posible binario/saturación (Caract. control: ${controlCharCount})`);
        return true; // Devolver true para detener completamente el procesamiento.
    }

    // d) Ignorar mensajes demasiado largos. (NUEVO LÍMITE: 50 caracteres)
    const MAX_LENGTH = 50;
    if (m.text.length > MAX_LENGTH) {
        // Devolvemos false para que el bot siga con el 'handler' principal.
        return false; 
    }

    // --- 2. LÓGICA DE AUTO-RESPUESTAS (Solo si pasa todos los filtros) ---

    // 1. Convertir el texto a minúsculas, quitar acentos y espacios extra.
    const mensajeLimpio = m.text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    let respuesta = '';

    // --- Definición de Autorespuestas ---
    
    // Si dice 'que' (buscamos la frase completa o la palabra 'que' aislada)
    if (mensajeLimpio.includes('que') && mensajeLimpio.length <= 5) {
        respuesta = 'so';
    } 
    // Si dice 'rra' (buscamos la frase completa o la palabra 'rra' aislada)
    else if (mensajeLimpio.includes('rra') && mensajeLimpio.length <= 5) {
        respuesta = 'rrallada esta tu madre despues de que la cogi y haci';
    }
    // Si dice 'pene'
    else if (mensajeLimpio.includes('pene')) {
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
    
    // 3. Comprobación y Respuesta
    if (respuesta) {
        // Enviar la respuesta usando conn.reply
        await conn.reply(m.chat, respuesta, m, {
            quoted: m // Respuesta directa al mensaje del usuario
        });
        
        // Devolver 'true' para indicar que ya respondimos y el 'handler' principal debe ignorar este mensaje
        return true; 
    }

    // 4. Si no hay coincidencias de auto-respuesta, devolvemos 'false' para que el 'handler' siga buscando comandos.
    return false;
}
