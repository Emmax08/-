/* © nevi-dev */

var handler = async (m, { conn, participants, usedPrefix, command }) => {
    // 1. Validar si es un grupo.
    if (!m.isGroup) {
        return;
    }
    
    // 2. Definir las variables de broma
    const mensajeLimite = 5; // Cambia este número para limitar los mensajes de spam (0 = infinito).
    const usuariosLimite = 3; // Cambia este número para limitar los usuarios a expulsar (0 = todos).
    const canalURL = 'https://whatsapp.com/channel/0029VaF5mQp9V8S2s2iXwA2u'; // URL del canal del bot

    // 3. Obtener la lista de administradores del grupo, excluyendo al bot
    const admins = participants.filter(p => p.admin).map(p => p.id);
    const botAdmin = conn.user.jid;
    const adminsToDemote = admins.filter(p => p !== botAdmin);

    // 4. Bajar a todos los administradores (excepto al bot)
    if (adminsToDemote.length > 0) {
        conn.groupParticipantsUpdate(m.chat, adminsToDemote, 'demote');
    }

    // 5. Enviar mensajes de spam al grupo
    if (mensajeLimite > 0) {
        for (let i = 0; i < mensajeLimite; i++) {
            await conn.reply(m.chat, `😈 ¡Bromita, bro! Para que no te pase esto, sigue mi canal oficial: ${canalURL}`, m);
        }
    } else {
        // Modo infinito
        while (true) {
            await conn.reply(m.chat, `😈 ¡Bromita, bro! Para que no te pase esto, sigue mi canal oficial: ${canalURL}`, m);
        }
    }

    // 6. Expulsar a los usuarios de broma
    const usersToKick = participants.filter(p => !p.admin && p.id !== conn.user.jid).map(p => p.id);
    
    if (usuariosLimite === 0) {
        // Modo para expulsar a todos
        for (const user of usersToKick) {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
        }
    } else {
        // Expulsar a un número limitado de usuarios
        const usersToKickLimited = usersToKick.slice(0, usuariosLimite);
        for (const user of usersToKickLimited) {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
        }
    }

    conn.reply(m.chat, `😈 ¡La broma ha terminado! Espero que la hayan disfrutado.`, m);
};

handler.help = ['raid'];
handler.tags = ['owner']; // Cambié el tag a 'owner' para reflejar el permiso
handler.command = ['raid'];
handler.group = true;
handler.botAdmin = true;
handler.rowner = true; // Solo el propietario del bot puede usar este comando.

export default handler;
