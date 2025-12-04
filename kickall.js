let handler = async (m, { conn, participants, usedPrefix, command }) => {
    // --- INICIO DEL TRY...CATCH GENERAL DE PROTECCIÓN ---
    try {
        // 1. Validar la cita
        if (!m.quoted) {
            return conn.reply(m.chat, `⚠️ Por favor, cita el mensaje de la persona que deseas expulsar y borrar su historial de 15 minutos.`, m);
        }

        let userToKick = m.quoted.sender; 
        const TIME_THRESHOLD = Date.now() - (15 * 60 * 1000); 
        const MAX_MESSAGES_TO_SEARCH = 200; 
        

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

        // --- 2. Buscar y Eliminar Mensajes (Sección de alto riesgo de error) ---
        conn.reply(m.chat, `⏳ Buscando y eliminando los mensajes de ${userToKick.split('@')[0]} enviados en los últimos 15 minutos...`, m);

        try {
            // !!! RECUERDA: conn.fetchMessages debe ser un método válido. Si falla, el catch lo manejará.
            let messages = await conn.fetchMessages(m.chat, { 
                limit: MAX_MESSAGES_TO_SEARCH, 
                before: m.id 
            });

            let deletedCount = 0;
            
            for (let msg of messages) {
                const isRecent = msg.messageTimestamp >= TIME_THRESHOLD;
                
                if (msg.key && msg.key.participant === userToKick && isRecent) {
                    await conn.sendMessage(m.chat, { 
                        delete: msg.key 
                    });
                    deletedCount++;
                }
            }

            conn.reply(m.chat, `✅ Se eliminaron ${deletedCount} mensajes de ${userToKick.split('@')[0]} enviados en los últimos 15 minutos.`, m);
            
        } catch (e) {
            console.error("Error al buscar/eliminar mensajes (Sección 2):", e);
            // El bot continúa con la expulsión aunque falle el borrado masivo
            conn.reply(m.chat, `⚠️ Hubo un error al intentar eliminar los mensajes por tiempo. Procediendo solo con la expulsión.`, m); 
        }

        // --- 3. Ejecutar Expulsión ---
        await conn.groupParticipantsUpdate(m.chat, [userToKick], 'remove');

        // --- 4. Confirmación Final ---
        conn.reply(m.chat, `🚫 ¡Usuario ${userToKick.split('@')[0]} expulsado con éxito!`, m);

    } catch (e) {
        // --- FIN DEL TRY...CATCH GENERAL ---
        console.error("Error fatal en kickall1 (Sección 1):", e);
        // Si todo falla, al menos informa al usuario y al administrador
        conn.reply(m.chat, `❌ ¡Error fatal! No se pudo ejecutar el comando KickAll1. Un error interno ha sido registrado.`, m);
    }
};

handler.help = ['kickall1'];
handler.tags = ['grupo'];
handler.command = ['kickall1'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
