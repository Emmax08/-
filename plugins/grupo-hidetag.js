import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

var handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {

    // 1. Validar que haya texto o una cita (quoted message)
    if (!m.quoted && !text) {
        // Asumiendo que 'emoji' e 'icons' están definidos globalmente o deberías reemplazarlos
        let emoji = '⚠️' 
        return conn.reply(m.chat, `${emoji} Debes enviar un texto para hacer un tag o citar un mensaje/media.`, m)
    }

    // 2. Preparar la lista de menciones (JIDs)
    let users = participants.map(u => conn.decodeJid(u.id))
    
    // 3. Obtener el mensaje citado o el mensaje actual (para texto/media)
    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted).mimetype || ''
    let isMedia = /image|video|sticker|audio/.test(mime)
    
    // 4. Preparar el texto (si existe) y los caracteres invisibles para el hidetag
    let htextos = text ? text : "*Hola, grupo!*" // Texto si se proporciona, o un saludo por defecto
    
    // Caracteres invisibles para "ocultar" el tag en algunos clientes
    let more = String.fromCharCode(8206)
    let masss = more.repeat(850)
    
    // 5. Enviar el mensaje con el tag a todos
    try {
        if (isMedia) {
            // Manejo de Media (Imagen, Video, Audio, Sticker)
            var mediax = await quoted.download?.()
            
            if (quoted.mtype === 'imageMessage') {
                await conn.sendMessage(m.chat, { image: mediax, caption: htextos, mentions: users }, { quoted: null })
            } else if (quoted.mtype === 'videoMessage') {
                await conn.sendMessage(m.chat, { video: mediax, mimetype: 'video/mp4', caption: htextos, mentions: users }, { quoted: null })
            } else if (quoted.mtype === 'audioMessage') {
                await conn.sendMessage(m.chat, { audio: mediax, mimetype: 'audio/mp4', fileName: `Hidetag.mp3`, mentions: users }, { quoted: null })
            } else if (quoted.mtype === 'stickerMessage') {
                // Las menciones en stickers a veces no funcionan bien, pero se intenta.
                await conn.sendMessage(m.chat, { sticker: mediax, mentions: users }, { quoted: null })
            }
        } else {
            // Manejo de Texto (el método robusto de hidetag por Extended Text)
            // Se usa el masss (caracteres invisibles) + el texto del usuario.
            // NOTA: Reemplaza 'icons' y 'redes' si no están definidos globalmente.
            let icons = 'https://ejemplo.com/icono.jpg' // Define esto si es necesario
            let redes = 'https://ejemplo.com/enlace'   // Define esto si es necesario
            
            await conn.relayMessage(m.chat, {
                extendedTextMessage:{
                    text: `${masss}\n${htextos}\n`,
                    contextInfo: { 
                        mentionedJid: users,
                        // Se mantiene el AdReply si quieres el thumbnail
                        externalAdReply: { 
                            thumbnail: icons, 
                            sourceUrl: redes 
                        }
                    }
                }
            }, {})
        }

    } catch (e) {  
        console.error(e)
        // Fallback simple si algo falla
        await conn.sendMessage(m.chat, { text: `⚠️ Error al intentar hacer el tag general:\n${e.message}`, mentions: users }, { quoted: m })
    }

}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'notificar', 'notify', 'tag']
handler.group = true
handler.admin = true
handler.register = true

export default handler
