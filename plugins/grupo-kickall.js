let handler = async (m, { conn, participants, usedPrefix, command }) => {
    // 1. Validar la cita
    if (!m.quoted) {
        return conn.reply(m.chat, `⚠️ Por favor, cita el mensaje de la persona que deseas expulsar y borrar su historial de 15 minutos.`, m);
    }

    let userToKick = m.quoted.sender; // Remitente del mensaje citado
    
    // Calculamos el umbral de tiempo: Ahora - 15 minutos (en milisegundos)
    const TIME_THRESHOLD = Date.now() - (15 * 60 * 1000); 
    const MAX_MESSAGES_TO_SEARCH = 200; // Máximo de mensajes recientes a revisar
    

    // --- Protecciones y Validación de usuario ---
    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = (global.owner?.[0]?.[0] || '') + '@s.whatsapp.net'; 

    if (userToKick === conn.user.jid) {
        return conn.reply(m.chat, `❌ No puedo eliminar el bot del grupo.`, m);
    }
    if (userToKick === ownerGroup || (ownerBot !== '@s.whatsapp.net' && userToKick === ownerBot)) {
        return conn.reply(m.chat, `❌ No puedo eliminar al propietario del grupo ni al propietario del bot.`, m);
    }
    // -----------------------------------------------------------------

    // --- 2. Buscar y Eliminar Mensajes (Lógica de 15 minutos) ---
    conn.reply(m.chat, `⏳ Buscando y eliminando los mensajes de ${userToKick.split('@')[0]} enviados en los últimos 15 minutos...`, m);

    try {
        // !!! ATENCIÓN: Esta función 'conn.fetchMessages' es un PLACEHOLDER.
        // Debe ser reemplazada por el método real que tu librería use para obtener historial.
        // Se aumenta el límite para asegurar
