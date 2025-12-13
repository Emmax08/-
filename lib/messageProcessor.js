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
    const commandPrefixes = ['#', '/', '!', '$', '>', '=', '.', '¿', '¡', '?', '>', '<', '(', ')'];
    const startsWithCommandPrefix = commandPrefixes.some(prefix => m.text.trim().startsWith(prefix));

    if (startsWithCommandPrefix) {
        // Devolvemos false para que el 'handler' principal lo procese como un comando.
        return false;
    }
    
    // c) Ignorar mensajes que intentan ser "binarios" o saturadores.
    const controlCharCount = (m.text.match(/[\p{C}\u200B-\u200F\uFEFF]/gu) || []).length;
    if (controlCharCount > 5) {
        console.log(`[Processor] Mensaje ignorado: Posible binario/saturación (Caract. control: ${controlCharCount})`);
        return true; // Devolver true para detener completamente el procesamiento.
    }

    // d) Ignorar mensajes demasiado largos. (LÍMITE: 50 caracteres)
    const MAX_LENGTH = 50;
    if (m.text.length > MAX_LENGTH) {
        return false; 
    }

    // --- 2. PREPARACIÓN DEL MENSAJE Y LÓGICA DE AUTO-RESPUESTAS ---

    // 1. Convertir el texto a minúsculas, quitar acentos y espacios extra.
    // **NOTA DE CORRECCIÓN:** NO eliminaremos la puntuación aquí, ya que afecta a la longitud
    // y puede ser útil para la detección de frases exactas. Solo normalizaremos el texto.
    const mensajeBase = m.text.toLowerCase().trim();
    
    // Creamos la versión limpia de acentos para las comparaciones de palabras clave.
    const mensajeLimpio = mensajeBase
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Quitar acentos
    
    let respuesta = '';

    // --- Definición de Autorespuestas (Corregido: Coincidencia Estricta o por Frase) ---
    
    // --- PALABRAS CORTAS QUE DEBEN IR SOLAS (o casi solas) ---
    // Limpiamos de puntuación solo para estas comparaciones, para que 'que!' funcione como 'que'.
    const mensajeSoloPalabra = mensajeLimpio.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"“”]/g, "").replace(/\s{2,}/g, " ");

    // Si dice 'que' (SOLO: comprobando longitud y limpieza básica)
    if (mensajeLimpio.includes('que') && mensajeBase.length <= 5) { // Usamos el mensaje base para la longitud real
        respuesta = 'so';
    } 
    // Si dice 'rra' (SOLO: comprobando longitud y limpieza básica)
    else if (mensajeLimpio.includes('rra') && mensajeBase.length <= 5) {
        respuesta = 'rrallada esta tu madre despues de que la cogi y haci';
    }
    // Si dice 'hola' (SOLO: Coincidencia estricta de la palabra limpia)
    else if (mensajeSoloPalabra === 'hola') { 
        respuesta = 'Hola, ¿qué tal?';
    } 
    // Si dice 'gay' (SOLO: Coincidencia estricta de la palabra limpia)
    else if (mensajeSoloPalabra === 'gay') {
        respuesta = 'Eres';
    }

    // --- FRASES LARGAS O PALABRAS QUE PUEDEN ESTAR DENTRO DE OTRAS ---
    // Si dice 'pene' (Permite frases, usa 'includes')
    else if (mensajeLimpio.includes('pene')) {
        respuesta = 'comes';
    } 
    // Si dice 'bot de mierda' (Permite frases, usa 'includes')
    else if (mensajeLimpio.includes('bot de mierda')) {
        respuesta = 'Más mierda fue tu nacimiento';
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
