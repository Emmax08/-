let handler = async (m, { conn, usedPrefix, command }) => {
    // --- Verificaciones Iniciales ---
    if (!m.isGroup) {
        return conn.reply(m.chat, `🛡️ Este comando solo se puede usar en grupos.`, m);
    }
    if (!m.quoted) {
        return conn.reply(m.chat, `🛡️ Debes citar el mensaje de un usuario para usar este comando.\n\n*Ejemplo:*\n${usedPrefix + command}`, m);
    }

    const isDebugMode = m.text.includes('-debug on');

    try {
        // --- Obtener Metadatos y Roles ---
        const groupMetadata = await conn.groupMetadata(m.chat);
        const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        
        // --- SOLUCIÓN DEFINITIVA: OBTENER EL ID DEL ESTADO DE AUTENTICACIÓN ---
        // Esta es la forma más confiable de obtener el JID del bot, ya que viene directamente de la sesión.
        const botId = conn.authState.creds.me.id;
        
        const botIsAdmin = groupAdmins.includes(botId);
        const userIsAdmin = groupAdmins.includes(m.sender);

        if (isDebugMode) {
            const debugMessage = `*--- 🐞 MODO DEBUG ACTIVADO 🐞 ---*

*🔍 Verificación de ID del Bot (Método AuthState):*
- *ID del Bot (desde credenciales):* \`${botId}\`

*🔑 Verificación de Permisos:*
- *¿El Bot es Admin?:* ${botIsAdmin ? '✅ Sí' : '❌ No'}
- *¿El Usuario es Admin?:* ${userIsAdmin ? '✅ Sí' : '❌ No'}

*📋 Admins Detectados en el Grupo:*
\`\`\`${JSON.stringify(groupAdmins, null, 2)}\`\`\`
----------------------------------`;
            await conn.reply(m.chat, debugMessage, m);
        }

        // --- Verificaciones de Permisos ---
        if (!botIsAdmin) {
            return conn.reply(m.chat, `❌ El bot necesita ser administrador para usar este comando.`, m);
        }
        if (!userIsAdmin) {
            return conn.reply(m.chat, `❌ Solo los administradores pueden usar este comando.`, m);
        }

        // --- Identificar y verificar al Usuario Objetivo ---
        let targetUser = m.quoted.sender;
        const targetIsAdmin = groupAdmins.includes(targetUser);
        const ownerGroup = groupMetadata.owner || '';
        const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

        if (targetUser === botId) {
            return conn.reply(m.chat, `😂 No me puedo auto-expulsar.`, m);
        }
        if (targetUser === ownerGroup) {
            return conn.reply(m.chat, `🛡️ No puedo eliminar al propietario del grupo.`, m);
        }
        if (targetUser === ownerBot) {
            return conn.reply(m.chat, `🛡️ No puedo eliminar a mi propietario.`, m);
        }
        if (targetIsAdmin) {
            return conn.reply(m.chat, `🛡️ No puedo eliminar a otro administrador.`, m);
        }

        // --- Ejecutar Acciones ---
        const userMention = `@${targetUser.split('@')[0]}`;
        
        await conn.sendMessage(m.chat, { delete: m.quoted.vM.key });
        await conn.groupParticipantsUpdate(m.chat, [targetUser], 'remove');
        await conn.reply(m.chat, `✅ ¡Hecho! El mensaje de ${userMention} fue eliminado y el usuario fue expulsado.`, m, { mentions: [targetUser] });

    } catch (e) {
        console.error(e);
        const errorDebug = `*Error Detallado (Debug):*\n\`\`\`${e}\`\`\`
        await conn.reply(m.chat, `❌ Ocurrió un error al ejecutar la acción.\n\n${errorDebug}`, m);
    }
};

handler.help = ['kickdel'];
handler.tags = ['grupo'];
handler.command = ['kickdel'];

export default handler;
