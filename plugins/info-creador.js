import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

// 🗂️ CONSOLIDACIÓN DE DATOS: Define la lista de creadores una sola vez.
const creatorsList = [
    { 
      id: 'owner1',
      name: '𓅓𝙀𝙈𝙈𝘼𝙓𝓈®', 
      number: '12892581751',
      rango: 'Creador de la bot'
    },
    { 
      id: 'owner2',
      name: 'FÉLIX OFC', 
      number: '573235915041',
      rango: 'Editor y Desarrollador'
    },
    { 
      id: 'owner3',
      name: 'Dioneibi-rip', 
      number: '18294868853',
      rango: 'Editor y Desarrollador'
    },
    { 
      id: 'owner4',
      name: 'Arlette Xz', 
      number: '573114910796',
      rango: 'Desarrolladora Principal y Corregidora de Errores'
    },
    { 
      id: 'owner5',
      name: 'Nevi Dev', 
      number: '18096758983',
      rango: 'Desarrollador Principal'
    }
]

// Crea un mapa para buscar por ID de botón rápidamente
const creatorsMap = creatorsList.reduce((acc, creator) => {
    // Mapea tanto por el ID como por el Nombre para la respuesta en grupo
    acc[creator.id] = creator
    acc[creator.name.toLowerCase()] = creator
    return acc
}, {})


let handler = async (m, { conn }) => {
  try {
    const isGroup = m.chat.endsWith('@g.us')
    
    // El texto del encabezado es igual para ambos
    const menuText = `*LISTA - CREADORES*\n\n> Selecciona un creador para contactar`
    
    // Mapea la lista de creadores para crear los botones automáticamente
    // Usamos el ID como buttonId y el Nombre como displayText
    const buttons = creatorsList.map(creator => ({
        buttonId: creator.id,
        buttonText: { displayText: creator.name },
        type: 1
    }))

    const buttonMessage = {
        text: menuText,
        footer: 'Selecciona un contacto',
        buttons: buttons,
        headerType: 4,
        image: { url: 'https://files.catbox.moe/d2b1e8.jpg' }
    }

    // Enviamos el mismo mensaje interactivo en ambos casos
    // En el grupo, si el bot tiene permisos, enviará el mensaje interactivo.
    // La diferencia de comportamiento se manejará en handler.before.
    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })

  } catch (e) {
    console.error('❌ Error en el comando owner:', e)
    
    // 🛡️ SOLUCIÓN DE RESPALDO
    const backupText = `*❌ Ocurrió un error al enviar los contactos. Usa los siguientes enlaces de contacto directo:*\n\n` +
      creatorsList.map(c => `• *${c.name}* (${c.rango}): https://wa.me/${c.number}`).join('\n')
    
    await conn.sendMessage(m.chat, { 
      text: backupText
    }, { quoted: m })
  }
}

// ⚙️ MANEJADOR DE RESPUESTA A BOTONES (handler.before)
handler.before = async (m, { conn }) => {
  try {
    const isGroup = m.chat.endsWith('@g.us')

    let buttonId = null
    
    // 1. Manejo en chat privado (Respuesta de Botón Nativa)
    if (!isGroup) {
        buttonId = m.message?.interactiveResponseMessage?.selectedButtonId || m.text
    } 
    
    // 2. Manejo en grupo (El texto del botón presionado aparece como mensaje de texto)
    // También funciona si m.text trae el buttonId
    if (isGroup) {
        // En grupos, el ID del botón a veces se envía como texto.
        // También podemos verificar si el texto del mensaje coincide con un nombre (displayText)
        const textLower = m.text.toLowerCase()
        if (creatorsMap[textLower] && m.isBot) { // Opcional: solo si es un mensaje de respuesta directa al bot
            buttonId = textLower
        } else if (creatorsMap[textLower]) {
             // Si el texto coincide con un nombre de creador, usamos ese nombre como "ID"
             buttonId = textLower
        } else {
             // Si el texto es el ID del botón
             buttonId = m.text
        }
    }


    // Si no es una respuesta de botón o no encontramos el creador, ignorar
    if (!buttonId) return
    
    const creator = creatorsMap[buttonId]
    
    if (creator) {
      // ⚠️ Validación crucial para evitar spam en grupos
      // Solo respondemos en grupos si el mensaje fue una respuesta al bot
      if (isGroup && m.mentionedJid?.includes(conn.user.jid) === false) {
           // Opcional: puedes ignorar si no fue una mención directa, o simplemente continuar.
           // Por ahora, continuamos ya que el ID/Nombre fue detectado
      }
        
      // Enviar mensaje de rango (antes del contacto)
      await conn.sendMessage(m.chat, { 
        text: `*✅ Contacto Seleccionado*\n\n👤 Nombre: ${creator.name}\n🎖️ Rango: ${creator.rango}`
      }, { 
        quoted: m 
      })

      // Enviar el contacto VCard
      await conn.sendMessage(m.chat, {
        contacts: {
          contacts: [{
            displayName: creator.name,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${creator.name}\nTEL;type=CELL;type=VOICE;waid=${creator.number}:+${creator.number}\nEND:VCARD`
          }]
        }
      }, { quoted: m })
    }
  } catch (error) {
    console.error('Error en handler.before (respuesta de botón):', error)
  }
}

handler.help = ['owner', 'creador']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'contacto', 'creadora']

export default handler