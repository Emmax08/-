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
    'key', 'AdonixKey8hig531055'
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
    if (!text) {
        return conn.reply(message.chat, decodeString(4) + decodeString(5) + conn.user.name + decodeString(6) + decodeString(7) + usedPrefix + command + ' ' + decodeString(8), message);
    }

    const args = text.split(decodeString(9))
        .map(item => item.trim());

    if (2 !== args[decodeString(14)]) {
        return conn.reply(message.chat, decodeString(15) + decodeString(7) + usedPrefix + command + ' ' + decodeString(8), message);
    }

    const [link, rawEmojis] = args;
    const emojis = rawEmojis.split(',')
        .map(item => item.trim())
        .filter(emoji => emoji);

    // 3. Validación de Enlace (WhatsApp Channel)
    if (!link.includes(decodeString(16)) && !link.includes(decodeString(17))) {
        return conn.reply(message.chat, decodeString(18), message);
    }

    // 4. Validación de Emojis
    if (0 === emojis[decodeString(14)] || emojis