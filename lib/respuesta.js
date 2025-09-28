// --- VALORES NECESARIOS PARA LA NUEVA FUNCIONALIDAD ---
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';
const packname = '˚mᥲríᥲ k᥆ȷᥙ᥆';

const redes = 'https://Maria-kujou.com';

/**
 * Plugin centralizado para manejar todos los mensajes de error de permisos.
 * @param {string} type - El tipo de error (ej. 'admin', 'owner', 'unreg').
 * @param {object} conn - La conexión del bot.
 * @param {object} m - El objeto del mensaje.
 * @param {string} comando - El nombre del comando que se intentó usar.
 */
const handler = (type, conn, m, comando) => {
    // Objeto con todos los posibles mensajes de error.
    const msg = {
        rowner: `『👑』 ¿Intentando usar *${comando}* sin ser mi creador? Aww, qué pendejo... ¡pero no! ✋`,
        owner: `『🪽』Oh no~ ¿creíste que podías usar *${comando}*? Solo los desarrolladores, no los simples mortales como tú. 🙄`,
        mods: `『💮』*${comando}* es solo para mods, y tú... bueno, tú ni mod de tu propia vida. 😏`,
        premium: `『🐦‍🔥』¿Premium? Jajaja. ¿Tú? Ni regalado. *${comando}* es solo para los VIP, no para los del montón. 💅`,
        group: `『♨️』¿Tan solito estás que quieres usar *${comando}* en privado? Este comando es solo para grupos, baka~`,
        private: `『🌸』¿En serio intentas usar *${comando}* aquí? Este comando es solo para mi rinconcito privado, ¡fuera de aquí! 😒`,
        admin: `『🪷』*${comando}* es solo para admins. Tú solo eres decoración en este grupo. 💁‍♀️`,
        botAdmin: `『🌌』¿Y cómo quieres que ejecute *${comando}* si ni admin soy? ¡Hazme admin primero, imbecil! 🤨`,
        unreg: `『👑』¿Usar *${comando}* sin registrarte? ¡Qué descaro! Regístrate ya con: #reg Emmax-kun.19 o vete de aqui. 😒`,
        restrict: `🍂 Ooops~ Esta función está *desactivada*. Ni con magia podrás usarla ahora mismo, lo siento (no). 😜`
    }[type];

    if (msg) {
        const contextInfo = {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
                newsletterJid,
                newsletterName,
                serverMessageId: -1
            },
            externalAdReply: {
                title: packname,
                body: '🌺 ¡Acceso Denegado! 🐦‍🔥',
                thumbnailUrl: icons,
                sourceUrl: redes,
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };

        return conn.reply(m.chat, msg, m, { contextInfo })
            .then(_ => m.react?.('✖️')) // ✅ m.react opcional
            .catch(e => console.error('Error enviando mensaje de restricción:', e));
    }
    return true;
};

export default handler;
