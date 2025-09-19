/* © nevi-dev
    Este código está diseñado para expulsar a todos
    los miembros de un grupo de WhatsApp, excepto
    al propietario del bot, el propietario del grupo
    y los administradores del grupo.
*/

var handler = async (m, { conn, participants, usedPrefix, command }) => {
    // Validar si el usuario que ejecuta el comando es un administrador.
    if (!m.isGroup) {
        return; // Detener la ejecución si no es un grupo
    }

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`@s.whatsapp.net`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    let usersToKick;
    let attempts = 0;
    const maxAttempts = 5; // Número de reintentos para asegurar que no queden usuarios

    // Bucle para reintentar la expulsión hasta que no queden usuarios no protegidos
    while (attempts < maxAttempts) {
        attempts++;
        
        // Obtener la lista actualizada de participantes en cada iteración
        const updatedParticipants = await conn.groupMetadata(m.chat).then(meta => meta.participants);
        const admins = updatedParticipants.filter(p => p.admin).map(p => p.id);

        // Obtener la lista de participantes a expulsar
        usersToKick = updatedParticipants
            .filter(user => 
                !admins.includes(user.id) && 
                user.id !== ownerGroup && 
                user.id !== ownerBot && 
                user.id !== conn.user.jid
            )
            .map(user => user.id);

        // Si no hay usuarios para expulsar, sal del bucle
        if (usersToKick.length === 0) {
            break;
        }

        // Iterar sobre la lista y expulsar a cada usuario
        for (const user of usersToKick) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            } catch (error) {
                console.error(`Error al expulsar a ${user}:`, error);
            }
        }
        
        // Pequeña pausa para evitar colapsar la API de WhatsApp
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Mensaje final basado en si quedaron o no usuarios
    if (usersToKick.length === 0) {
        conn.reply(m.chat, `✅ *¡Todos los miembros no-administradores han sido expulsados!*`, m);
    } else {
        conn.reply(m.chat, `⚠️ *¡Atención!* Después de ${attempts} intentos, aún quedan ${usersToKick.length} usuarios que no se pudieron expulsar. Es posible que haya un problema con la API de WhatsApp.`, m);
    }
};

handler.help = ['kickall'];
handler.tags = ['grupo'];
handler.command = ['kickall'];
handler.group = true;
handler.botAdmin = true;
handler.rowner = true;

export default handler;
