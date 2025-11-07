// Credits: ঔৣ⃟▒𝐄𝐌𝐌𝐀𝐗ღೋ

import fs from 'fs'
import { WAMessageStubType } from '@whiskeysockets/baileys'

function calcularDiasEnGrupo(participant, groupMetadata) {
    // La propiedad 'date' debe ser un número (timestamp)
    if (!participant || typeof participant.date !== 'number') return 0
    
    const fechaIngreso = new Date(participant.date * 1000)
    const fechaActual = new Date()
    const diferencia = fechaActual.getTime() - fechaIngreso.getTime()
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    
    return Math.max(1, dias)
}

function obtenerFechaCreacion(groupMetadata) {
    if (!groupMetadata.creation) return 'Fecha desconocida'
    
    const fechaCreacion = new Date(groupMetadata.creation * 1000)
    return fechaCreacion.toLocaleDateString("es-ES", {
        // ZONA HORARIA CDMX APLICADA
        timeZone: "America/Mexico_City", 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
    const username = `@${userId.split('@')[0]}`
    const nombreUsuario = userId.split('@')[0] 
    
    const avatar = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/b75b29441bbd967deda4365441497221.jpg')
    
    const background = 'https://qu.ax/YrVNX.jpg'
    const descripcion = `${username}`
    
    const apiUrl = `https://api.siputzx.my.id/api/canvas/welcomev4?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(descripcion)}`
    
    // NOTA: Esta variable 'fecha' no se usa en el caption final, pero se mantiene por si se usara.
    const fecha = new Date().toLocaleDateString("es-ES", { 
        // ZONA HORARIA CDMX APLICADA
        timeZone: "America/Mexico_City", 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    })
    
    const groupSize = groupMetadata.participants.length
    const fechaCreacion = obtenerFechaCreacion(groupMetadata)
    const desc = groupMetadata.desc?.toString() || 'Sin descripción'
    
    const audioBienvenida = 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/welcome-audio.mp3'
    
    const infoGrupo = `
📋 INFORMACIÓN DEL GRUPO:
├─ 🗓️ Creado: ${fechaCreacion}
├─ 👥 Miembros: ${groupSize} participantes
├─ 📝 Descripción:
${desc}

📜 REGLAS DEL GRUPO:
${chat.sRules || `1. Respetar a todos los miembros
2. No spam ni contenido inapropiado
3. Mantener el orden y la cordialidad
4. Usar el grupo para su propósito designado
5. Seguir las indicaciones de los administradores

 Personaliza las reglas usando: */setrules*`}`
    
    const mensaje = (chat.sWelcome || infoGrupo)
        .replace(/{usuario}/g, `${username}`)
        .replace(/{grupo}/g, `*${groupMetadata.subject}*`)
        .replace(/{desc}/g, `${desc}`)
        .replace(/{fechaCreacion}/g, `${fechaCreacion}`)
        .replace(/{miembros}/g, `${groupSize}`)
    
    const caption = `
╭───·˚ 🐝 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 🐝 ·˚───╮

  𐔌՞. .՞𐦯 ¡Hola, ${username}  
  Te damos la bienvenida a: *${groupMetadata.subject}*

${mensaje}

╰──·˚ 🌷 ¡Disfruta tu estadía! ˚·──╯`

    return { 
        imageUrl: apiUrl, 
        caption, 
        mentions: [userId],
        audioUrl: audioBienvenida
    }
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
    const username = `@${userId.split('@')[0]}`
    const nombreUsuario = userId.split('@')[0]
    
    const participantInfo = groupMetadata.participants.find(p => p.id === userId)
    const diasEnGrupo = calcularDiasEnGrupo(participantInfo, groupMetadata)
    
    const avatar = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/b75b29441bbd967deda4365441497221.jpg')
    
    const background = 'https://qu.ax/YrVNX.jpg'
    const descripcion = `${username}`
    
    const apiUrl = `https://api.siputzx.my.id/api/canvas/goodbyev4?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(descripcion)}`
    
    const fecha = new Date().toLocaleDateString("es-ES", { 
        // ZONA HORARIA CDMX APLICADA
        timeZone: "America/Mexico_City", 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    })
    
    const groupSize = groupMetadata.participants.length - 1
    const desc = groupMetadata.desc?.toString() || 'Sin descripción'
    
    const infoDespedida = `
📊 ESTADÍSTICAS:
├─ 👥 Miembros restantes: ${groupSize}
├─ 📅 Tiempo en el grupo: ${diasEnGrupo} día${diasEnGrupo !== 1 ? 's' : ''}
├─ 🗓️ Fecha de salida: ${fecha}`
    
    const mensaje = (chat.sBye || infoDespedida)
        .replace(/{usuario}/g, `${username}`)
        .replace(/{grupo}/g, `${groupMetadata.subject}`)
        .replace(/{desc}/g, `*${desc}*`)
        .replace(/{dias}/g, `${diasEnGrupo}`)
        .replace(/{miembros}/g, `${groupSize}`)
        .replace(/{fechaSalida}/g, `${fecha}`)
    
    const caption = `
╭───·˚ 🐝 𝐆𝐎𝐎𝐃 𝐁𝐘𝐄 🐝 ·˚───╮

  𐔌՞. .՞𐦯 – ${username}  
  Se fue de: *${groupMetadata.subject}*

${mensaje}

╰───·˚  🌷 ¡Hasta pronto!  ˚·───╯`

    return { 
        imageUrl: apiUrl, 
        caption, 
        mentions: [userId] 
    }
}

// Handler principal para el comando /setrules
let handler = async function (m, { conn, isAdmin, isOwner, isROwner }) {
    if (!m.isGroup || !m.text) return
    
    const args = m.text.split(' ')
    const command = args[0].toLowerCase()
    
    if (command === 'setrules' || command === 'setreglas') {
        if (!isAdmin && !isOwner && !isROwner) return m.reply('❌ Solo los administradores pueden cambiar las reglas del grupo.')
        
        const rulesText = m.text.slice(command.length + 1).trim()
        if (!rulesText) return m.reply('❌ Por favor, proporciona las nuevas reglas.\nEjemplo: .setrules 1. Respetar a todos\\n2. No spam...')
        
        // Se asegura que la estructura del chat exista en la DB
        if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
        global.db.data.chats[m.chat].sRules = rulesText
        
        await m.reply('✅ *Reglas del grupo actualizadas correctamente.*\n\nLas nuevas reglas se mostrarán en los mensajes de bienvenida.')
    }
}

// Configuración del handler para el comando /setrules
handler.command = /^(setrules|setreglas)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

// *** LÓGICA DE BIENVENIDA Y DESPEDIDA (EVENTOS STUB) ***
// Esta es la única función handler.before.
handler.before = async function (m, { conn, groupMetadata }) {
    // 1. Verificar si es un evento Stub y de Grupo
    if (!m.messageStubType || !m.isGroup) return !0
    
    // 2. Comprobación de Bot Primario
    const primaryBot = global.db.data.chats[m.chat]?.primaryBot
    if (primaryBot && conn.user.jid !== primaryBot) return !1
    
    const chat = global.db.data.chats[m.chat]
    const userId = m.messageStubParameters[0]

    // 3. Lógica de Bienvenida (ADD)
    if (chat?.welcome && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        const { imageUrl, caption, mentions, audioUrl } = await generarBienvenida({ 
            conn, 
            userId, 
            groupMetadata, 
            chat 
        })
        
        try {
            // Envío de Imagen/Texto (más robusto)
            await conn.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: caption,
                mentions: mentions
            }, { quoted: null })
            
        } catch (error) {
            console.error('Error enviando bienvenida (Imagen):', error)
            // Respaldo: Envía solo el texto si la imagen falla
            await conn.sendMessage(m.chat, {
                text: caption,
                mentions: mentions
            }, { quoted: null })
        }
        
        // Envío de Audio (manejo separado de errores)
        try {
            await conn.sendMessage(m.chat, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg'
            }, { quoted: null })
        } catch (audioError) {
            console.error('Error enviando audio de bienvenida:', audioError)
        }
    }
    
    // 4. Lógica de Despedida (REMOVE/LEAVE)
    if (chat?.welcome && (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {
        const { imageUrl, caption, mentions } = await generarDespedida({ 
            conn, 
            userId, 
            groupMetadata, 
            chat 
        })
        
        const messageOptions = {
            image: { url: imageUrl },
            caption: caption,
            mentions: mentions
        }
        
        await conn.sendMessage(m.chat, messageOptions, { quoted: null })
    }
}


export { generarBienvenida, generarDespedida, calcularDiasEnGrupo, obtenerFechaCreacion }
export default handler