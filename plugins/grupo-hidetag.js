import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

var handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {

    // 1. Validar que haya texto o una cita.
    let emoji = '⚠️'; 
    if (!m.quoted && !text) {
        return conn.reply(m.chat, `${emoji} Debes enviar un texto para hacer un tag o citar un mensaje/media.`, m);
    }

    // 2. Preparar la lista de menciones (JIDs)
    let users = participants.map(u => conn.decodeJid(u.id));
    
    // 3. Obtener el mensaje citado o el mensaje actual
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || '';
    let isMedia = /image|video|sticker|audio/.test(mime);
    
    // 4. Determinar el texto a enviar:
    let htextos = '';
    
    if (text) {
        // PRIORIDAD 1: Si el usuario escribió un texto con el comando.
        htextos = text;
    } else if (m.quoted) {
        // PRIORIDAD 2: Si citó un mensaje, usar el texto/caption de la cita.
        htextos = quoted.text || quoted.caption || "*Mensaje citado reenviado!*";
    }
    
    // Fallback
    if (!htextos) {
        htextos = "*Hola, grupo!*";
    }
    
    // 5. ¡IMPORTANTE! Eliminamos las variables `more` y `masss` para evitar el espacio largo.

    // 6. Enviar el mensaje con el tag a todos
    try {
        if (isMedia && m.quoted) {
            // Manejo de Media (Imagen, Video, Audio, Sticker)
            var mediax = await quoted.download?.();
            
            if (quoted.mtype === 'imageMessage') {
                await conn.sendMessage(m.chat, { image: mediax, caption: htextos, mentions: users }, { quoted: null });
            } else if (quoted.mtype === 'videoMessage') {
                await conn.sendMessage(m.chat, { video: mediax, mimetype: 'video/mp4', caption: htextos, mentions: users }, { quoted: null });
            } else if (quoted.mtype === 'audioMessage') {
                await conn.sendMessage(m.chat, { audio: mediax, mimetype: 'audio/mp4', fileName: `Hidetag.mp3`, mentions: users }, { quoted: null });
            } else if (quoted.mtype === 'stickerMessage') {
                await conn.sendMessage(m.chat, { sticker: mediax, mentions: users }, { quoted: null });
            }
        } else {
            // Manejo de Texto: Enviar el texto directamente CON las menciones.
            
            // Usamos un simple sendMessage con el texto y el array de menciones.
            await conn.sendMessage(m.chat, { text: htextos, mentions: users }, { quoted: m });
        }

    } catch (e) {  
        console.error(e);
        await conn.reply(m.chat, `⚠️ Error al intentar hacer el tag general: ${e.message}`, m);
    }

}

handler.help = ['hidetag'];
handler.tags = ['grupo'];
handler.command = ['hidetag', 'notificar', 'notify', 'tag'];
handler.group = true;
handler.admin = true;
handler.register = true;

export default handler;
