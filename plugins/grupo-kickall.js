let handler = async (m, { conn, participants, usedPrefix, command }) => {
    // 1. Validar la cita
    if (!m.quoted) {
        return conn.reply(m.chat, `⚠️ Por favor, cita el mensaje de la persona que deseas expulsar y borrar su historial.`, m);
    }

    let userToKick = m.quoted.sender; // Remitente del mensaje citado
    const MESSAGES_TO_DELETE = 50; // Cantidad de mensajes a buscar y eliminar

    // --- Protecciones y Validación de usuario ---
    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    
    // CORRECCIÓN: Definición segura del propietario del bot
    // Si global.owner no está definido o tiene un formato incorrecto, ownerBot será una cadena vacía ('').
    const ownerBot = (global.owner?.[0]?.[0] || '') + '@s.whatsapp.net'; 

    if (userToKick === conn.user.jid) {
        return conn.reply(m.chat, `❌ No puedo eliminar el bot del grupo.`, m);
    }
    // No permite expulsar al propietario del grupo ni al propietario del bot.
    if (userToKick === ownerGroup || (ownerBot !== '@s.whatsapp.net' && userToKick === ownerBot)) {
        return conn.reply(m.chat, `❌ No puedo eliminar al propietario del grupo ni al propietario del bot.`, m);
    }
    // -----------------------------------------------------------------

    // --- 2. Buscar y Eliminar Mensajes (Lógica con Placeholder) ---
    conn.reply(m.chat, `⏳ Buscando y eliminando los últimos ${MESSAGES_TO_DELETE} mensajes enviados por ${userToKick.split('@')[0]}...`, m);

    try {
        // !!! ADVERTENCIA: 'conn.fetchMessages' debe ser un método válido de tu librería de bot.
        // Si el bot no tiene acceso al historial, esta parte fallará.
        let messages = await conn.fetchMessages(m.chat, { 
            limit: MESSAGES_TO_DELETE * 2, 
            before: m.id 
        });

        let deletedCount = 0;
        
        for (let msg of messages) {
            // Verifica que el mensaje sea del usuario objetivo
            if (msg.key && msg.key.participant === userToKick) {
                // Intenta eliminar el mensaje
                await conn.sendMessage(m.chat, { 
                    delete: msg.key 
                });
                deletedCount++;

                if (deletedCount >= MESSAGES_TO_DELETE) break;
            }
        }

        conn.reply(m.chat, `✅ Se eliminaron ${deletedCount} mensajes de ${userToKick.split('@')[0]}.`, m);
        
    } catch (e) {
        console.error("Error al buscar/eliminar mensajes:", e);
        conn.reply(m.chat, `⚠️ Hubo un error al intentar eliminar los mensajes. Procediendo solo con la expulsión.`, m);
    }

    // --- 3. Ejecutar Expulsión ---
    await conn.groupParticipantsUpdate(m.chat, [userToKick], 'remove');

    // --- 4. Confirmación Final ---
    conn.reply(m.chat, `🚫 ¡Usuario ${userToKick.split('@')[0]} expulsado con éxito!`, m);
};

handler.help = ['kickall1'];
handler.tags = ['grupo'];
handler.command = ['kickall1'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
