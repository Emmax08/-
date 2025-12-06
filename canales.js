const strings = [
    'reply',
    'chat',
    'Este comando es solo para propietarios del bot.',
    'm',
    '• *',
    ' *',
    'Formato incorrecto',
    '\n\nUso: *',
    '<link> | <emoji>',
    '.', // <-- Índice 9, que causaba problemas al dividir
    'split',
    '|', // <-- Índice 11, el separador correcto
    'map',
    'trim',
    'length',
    '• Formato incorrecto',
    'whatsapp.com/channel/',
    'wa.me/channel/',
    'includes',
    '• El enlace debe ser de un canal de WhatsApp.',
    'filter',
    '• Debes proporcionar entre 1 y 3 emojis como máximo.',
    '• *Enviando 1k reacciones al canal...*',
    'join',
    'Arlette-Xz',
    'encodeURIComponent',
    'https://api-adonix.ultraplus.click/tools/react?',
    'apikey=',
    '&post_link=',
    '&reacts=',
    'post_link=',
    '&apikey=',
    'fetch',
    'GET',
    'headers',
    'User-Agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept',
    'application/json',
    'Origin',
    'https://api-adonix.ultraplus.click',
    'Referer',
    'ok',
    'json',
    'status',
    'exitosamente',
    'message',
    'toLowerCase',
    'success',
    'success===!0',
    'sendMessage',
    'text',
    '• *¡Reacciones de ',
    ' enviadas exitosamente!*',
    'edit',
    'key',
    '• *No se pudo enviar las reacciones*',
    '\n\nPosibles causas:\n• API Key expirada\n• Enlace no válido\n• API fuera de servicio\n• Límite de uso alcanzado',
    'console',
    'error',
    'Error:',
    '• *Error al procesar la solicitud*',
    '\n\n'
];

// Función de decodificación simplificada
const decodeString = (index) => strings[index];

const handler = async (message, {
    conn,
    text,
    isOwner,
    usedPrefix,
    command
}) => {
    // 1. Verificación de Propietario
    if (!isOwner) {
        return conn.reply(message.chat, decodeString(2), message);
    }

    // 2. Verificación de Argumentos
    if (!text || !text.includes(decodeString(11))) { // Comprueba si el texto tiene el separador '|'
        return conn.reply(message.chat, decodeString(4) + decodeString(5) + conn.user.name + decodeString(6) + decodeString(7) + usedPrefix + command + ' ' + decodeString(8), message);
    }
    
    // --- CAMBIO CLAVE AQUÍ: Usamos '|' (índice 11) como separador principal ---
    const args = text.split(decodeString(11)) // Split por '|'
        .map(item => item.trim());

    // Debe tener exactamente 2 partes: [0] = link/cifra, [1] = rawEmojis
    if (2 !== args[decodeString(14)]) { // Si la longitud no es 2
        return conn.reply(message.chat, decodeString(15) + decodeString(7) + usedPrefix + command + ' ' + decodeString(8), message);
    }
    
    // Asignación de variables
    const [linkArg, rawEmojis] = args;
    
    // El linkArg ahora contiene la cifra y el link (ej: '1k https://link')
    // Necesitamos separar el link de la cifra. 
    // Buscamos la primera palabra (la cifra) y el resto es el link.
    const linkParts = linkArg.split(/\s+/).filter(p => p.length > 0); // Separar por uno o más espacios
    
    if (linkParts.length < 2) {
         return conn.reply(message.chat, decodeString(15) + '\n• Faltan la cifra y/o el enlace.', message);
    }
    
    // La cifra y el link son las partes separadas por el primer espacio.
    const cifraRaw = linkParts[0]; // Ej: '1k', '#5k', '.1k'
    const link = linkParts.slice(1).join(' '); // El resto es el enlace

    // --- CÓDIGO DE MANEJO DE EMOJIS (No modificado, solo reestructurado) ---
    const emojis = rawEmojis.split(',')
        .map(item => item.trim())
        .filter(emoji => emoji);

    // 3. Validación de Enlace (WhatsApp Channel)
    if (!link.includes(decodeString(16)) && !link.includes(decodeString(17))) {
        return conn.reply(message.chat, decodeString(19), message); // Usamos 19, que es 'El enlace debe ser...'
    }

    // 4. Validación de Emojis
    if (0 === emojis[decodeString(14)] || emojis[decodeString(14)] > 3) {
        return conn.reply(message.chat, decodeString(21), message); 
    }
    // NOTA: El código original estaba incompleto en esta línea. Lo completé con '> 3'
    
    // --- LÓGICA DE MANEJO DE CIFRA (Simulando la lógica que te di en Python) ---
    let cantidad = 0;
    try {
        let cifra_str = cifraRaw.toLowerCase();
        // Limpiamos los prefijos comunes antes de analizar 'k'
        cifra_str = cifra_str.replace(/^[#.$]/, ''); 
        
        if (cifra_str.endsWith('k')) {
            const base = parseFloat(cifra_str.slice(0, -1));
            cantidad = parseInt(base * 1000);
        } else {
            cantidad = parseInt(cifra_str);
        }
        
        if (isNaN(cantidad) || cantidad <= 0 || cantidad > 5000) {
            return conn.reply(message.chat, `⚠️ Error: La cantidad de emojis es inválida o supera el límite de 5000.`, message);
        }

    } catch (e) {
        return conn.reply(message.chat, `⚠️ Error: La cifra '${cifraRaw}' no es un número válido.`, message);
    }
    
    // --- Continuación de la Lógica de la API (DEBES COMPLETAR ESTA PARTE) ---
    // 5. Envío de Mensaje de Espera
    const m = await conn.reply(message.chat, decodeString(22), message); // Mensaje 'Enviando 1k reacciones...'
    
    // 6. Preparación de la Solicitud
    const reactsEncoded = decodeString(25)(emojis.join(',')); // encodeURIComponent(emojis)
    const postLinkEncoded = decodeString(25)(link);
    const API_KEY = 'TU_API_KEY_AQUI'; // ¡REEMPLAZA ESTO CON TU CLAVE REAL!

    const URL = decodeString(26) + decodeString(27) + API_KEY + decodeString(28) + postLinkEncoded + decodeString(29) + reactsEncoded;

    try {
        const response = await fetch(URL, {
            method: decodeString(33), // 'GET'
            headers: {
                [decodeString(34)]: decodeString(35), // User-Agent
                [decodeString(36)]: decodeString(37), // Accept
                [decodeString(38)]: decodeString(39), // Origin
                [decodeString(40)]: decodeString(39) // Referer
            }
        });

        // 7. Manejo de la Respuesta de la API
        if (response[decodeString(41)]) { // response.ok
            const data = await response[decodeString(42)](); // response.json()
            
            // Asumiendo que la respuesta exitosa tiene un campo 'status' o 'success'
            // NOTA: El código original usaba decodeString(51) 'success===!0' para la validación
            if (data.status === decodeString(45) || data[decodeString(50)][decodeString(48)]() === decodeString(49)) { 
                
                await conn.edit(m[decodeString(56)][decodeString(57)], decodeString(53) + cantidad + decodeString(54));
                
            } else {
                // Si la API responde OK pero el status interno es fallo
                await conn.edit(m[decodeString(56)][decodeString(57)], decodeString(55) + '\n\nRespuesta API: ' + (data[decodeString(47)] || 'Mensaje no disponible'));
            }
        } else {
            // Si el código de estado HTTP no es 200 (ej: 404, 500)
             await conn.edit(m[decodeString(56)][decodeString(57)], decodeString(55));
        }
        
    } catch (e) {
        // Error de red o en el proceso de fetch
        console[decodeString(59)](decodeString(60), e);
        await conn.edit(m[decodeString(56)][decodeString(57)], decodeString(61) + decodeString(62));
    }
};

// ... (El resto del módulo export va aquí)
