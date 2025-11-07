creado por ঔৣ⃟▒𝐄𝐌𝐌𝐀𝐗ღೋ

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

// 🗂️ CONSOLIDACIÓN DE DATOS: Define la lista de creadores una sola vez.
const creatorsList = [
    { 
      id: 'owner1',
      name: 'インマヌエル', 
      number: '5217225305296',
      rango: 'Fundador Principal'
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
    acc[creator.id] = creator
    return acc
}, {})


let handler = async (m, { conn }) => {
  try {
    const isGroup = m.chat.endsWith('@g.us')
    
    if (isGroup) {
      // 👥 En grupos: enviar todos los contactos directamente
      
      await conn.sendMessage(m.chat, {
        text: `*📞 CONTACTOS DE CREADORES*\n\nEnviando ${creatorsList.length} contactos...`
      }, { quoted: m })
      
      // Enviar cada contacto
      for (const creator of creatorsList) {
        await conn.sendMessage(m.chat, {
          contacts: {
            contacts: [{
              displayName: creator.name,
              vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${creator.name}\nTEL;type=CELL;type=VOICE;waid=${creator.number}:+${creator.number}\nEND:VCARD`
            }]
          }
        })
        
        // Pausa entre contactos (reducida a 500ms para acelerar un poco)
        await new Promise(resolve => setTimeout(resolve, 500)) 
      }
      
    } else {
      // 💬 En privado: enviar con botones interactivos (funciona correctamente)
      const menuText = `*LISTA - CREADORES*\n\n> Selecciona un creador para contactar`

      // Mapea la lista de creadores para crear los botones automáticamente
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

      await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
    }

  } catch (e) {
    console.error('❌ Error en el comando owner:', e)
    
    // 🛡️ SOLUCIÓN DE RESPALDO (si falla el envío de contactos o botones)
    const backupText = `*❌ Ocurrió un error al enviar los contactos. Usa los siguientes enlaces de contacto directo:*\n\n` +
      creatorsList.map(c => `• *${c.name}* (${c.rango}): https://wa.me/${c.number}`).join('\n')
    
    await conn.sendMessage(m.chat, { 
      text: backupText
    }, { quoted: m })
  }
}

// ⚙️ MANEJADOR DE RESPUESTA A BOTONES (handler.before)
// Este código se ejecuta cuando un usuario presiona un botón del bot.
handler.before = async (m, { conn }) => {
  try {
    const isGroup = m.chat.endsWith('@g.us')
    if (isGroup) return // Solo funciona en privado

    // Obtener el ID del botón presionado de forma segura y concisa
    let buttonId = 
        m.message?.buttonsResponseMessage?.selectedButtonId || 
        m.message?.interactiveResponseMessage?.selectedButtonId
    
    // Si no es una respuesta de botón, ignorar
    if (!buttonId) return
    
    const creator = creatorsMap[buttonId]
    
    if (creator) {
      // Enviar mensaje de rango (antes del contacto)
      await conn.sendMessage(m.chat, { 
        text: `*✅ Contacto Seleccionado*\n\nRango: ${creator.rango}`
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