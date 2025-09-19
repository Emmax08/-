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
    
    // Obtener la lista de JID de los administradores del grupo
    const admins = participants.filter(p => p.admin).map(p => p.id);

    // Obtener la lista de participantes a expulsar
    const usersToKick = participants
        .filter(user => 
            !admins.includes(user.id) && // Excluye a los administradores
            user.id !== ownerGroup && 
            user.id !== ownerBot && 
            user.id !== conn.user.jid
        )
        .map(user => user.id);

    // Si no hay usuarios para expulsar, notifica y detén la ejecución
    if (usersToKick.length === 0) {
        return conn.reply(m.chat, `⚠️ *No hay usuarios para expulsar*. Todos los miembros restantes son administradores o usuarios protegidos.`, m);
    }
    
    // Iterar sobre la lista y expulsar a cada usuario
    for (const user of usersToKick) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
        } catch (error) {
            console.error(`Error al expulsar a ${user}:`, error);
        }
    }

    conn.reply(m.chat, `✅ *¡Todos los miembros no-administradores han sido expulsados!*`, m);
};

handler.help = ['kickall'];
handler.tags = ['grupo'];
handler.command = ['kickall'];
handler.group = true;
handler.botAdmin = true;
handler.rowner = true;

export default handler;
