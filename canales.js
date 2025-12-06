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
    '.', 
    'split',
    '|', 
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
    
    // --- LÍNEAS DE DEPURACIÓN AÑADIDAS AQUÍ ---
    console.log('--- DEBUG COMANDO INICIO ---');
    console.log('Comando recibido:', command);
    console.log('Texto de argumentos (text):', text);
    console.log('Prefijo usado:', usedPrefix);
    console.log('Propietario:', isOwner ? 'SÍ' : 'NO');
    console.log('------------------------------');
    // --- FIN LÍNEAS DE DEPURACIÓN ---


    // 1. Verificación de Propietario
    if (!isOwner) {
        return conn.reply(message.chat, decodeString(2), message);
    }

    // 2. Verificación de Argumentos
    // Comprueba si el texto existe y si tiene el separador '|'
    if (!text || !text.includes(decodeString(11))) { 
        return conn.reply(message.chat, decodeString(4) + decodeString(5) + conn.user.name + decodeString(6) + decodeString(7) + usedPrefix + command + ' ' + decodeString(8), message);
    }
    
    // Split por '|'
    const args = text.split(decodeString(11)) 
        .map(item => item.trim());

    // Debe tener exactamente 2 partes: [0] = cifra/link, [1] = rawEmojis
    if (2 !== args[decodeString(14)]) { 
        return conn.reply(message.chat, decodeString(15) + decodeString(7) + usedPrefix + command + ' ' + decodeString(8), message);
    }
    
    // Asignación de variables
    const [linkArg, rawEmojis] = args;
    
    // Separación de Cifra y Link por espacios
    const linkParts = linkArg.split(/\s+/).filter(p => p.length > 0); 
    
    if (linkParts.length < 2) {
         return conn.reply(message.chat, decodeString(15) + '\n• Faltan la cifra y/o el enlace.', message);
    }
    
    const cifraRaw = linkParts[0];
    const link = linkParts.slice(1).join(' ');

    // Validación de Emojis
    const emojis = rawEmojis.split(',')
        .map(item => item.trim())
        .filter(emoji => emoji);

    // 3. Validación de Enlace (WhatsApp Channel)
    if (!link.includes(decodeString(16)) && !link.includes(decodeString(17))) {
        return conn.reply(message.chat, decodeString(19), message);
    }

    // 4. Validación de Emojis: entre 1 y 3
    if (0 === emojis[decodeString(14)] || emojis[decodeString(14)] > 3) {
        return conn.reply(message.chat, decodeString(21), message); 
    }
    
    // --- LÓGICA DE MANEJO DE CIFRA ---
    let cantidad = 0;
    try {
        let cifra_str = cifraRaw.toLowerCase();
        // Limpiamos los prefijos comunes ('#', '.', '$')
        cifra_str = cifra_str.replace(/^[#.$]/, ''); 
        
        if (cifra_str.endsWith('k')) {
            const base = parseFloat(cifra_str.slice(0, -1));
            cantidad = parseInt(base *
