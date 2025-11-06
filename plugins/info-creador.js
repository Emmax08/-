import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  try {
    const isGroup = m.chat.endsWith('@g.us')
    
    if (isGroup) {
      // En grupos: enviar todos los contactos directamente
      const creators = [
        { 
          name: 'インマヌエル', 
          number: '5217225305296',
          rango: 'Fundador Principal'
        },
        { 
          name: 'FÉLIX OFC', 
          number: '573235915041',
          rango: 'Editor y Desarrollador'
        },
        { 
          name: 'Dioneibi-rip', 
          number: '18294868853',
          rango: 'Editor y Desarrollador'
        },
        { 
          name: 'Arlette Xz', 
          number: '573114910796',
          rango: 'Desarrolladora Principal y Corregidora de Errores'
        },
        { 
          name: 'Nevi Dev', 
          number: '18096758983',
          rango: 'Desarrollador Principal'
        }
      ]
      
      // Enviar mensaje inicial
      await conn.sendMessage(m.chat, {
        text: `*📞 CONTACTOS DE CREADORES*\n\nEnviando contactos...`
      }, { quoted: m })
      
      // Enviar cada contacto
      for (const creator of creators) {
        await conn.sendMessage(m.chat, {
          contacts: {
            contacts: [{
              displayName: creator.name,
              vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${creator.name}\nTEL;type=CELL;type=VOICE;waid=${creator.number}:+${creator.number}\nEND:VCARD`
            }]
          }
        })
        
        // Pequeña pausa entre contactos
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
    } else {
      // En privado: enviar con botones interactivos
      const menuText = `*LISTA - CREADORES*\n\n> Selecciona un creador para contactar`

      const buttons = [
        {
          buttonId: 'owner1',
          buttonText: { displayText: 'インマヌエル' },
          type: 1
        },
        {
          buttonId: 'owner2',
          buttonText: { displayText: 'FÉLIX OFC' },
          type: 1
        },
        {
          buttonId: 'owner3',
          buttonText: { displayText: 'Dioneibi-rip' },
          type: 1
        },
        {
          buttonId: 'owner4',
          buttonText: { displayText: 'Arlette Xz' },
          type: 1
        },
        {
          buttonId: 'owner5',
          buttonText: { displayText: 'Nevi Dev' },
          type: 1
        }
      ]

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
    
    const backupText = `*LISTA - CREADORES*

• *インマヌエル*: https://wa.me/5217225305296
• *FÉLIX OFC*: https://wa.me/573235915041
• *Dioneibi-rip*: https://wa.me/18294868853
• *Arlette Xz*: https://wa.me/573114910796
• *Nevi Dev*: https://wa.me/18096758983

Selecciona un contacto`
    
    await conn.sendMessage(m.chat, { 
      text: backupText
    }, { quoted: m })
  }
}

// Manejador para botones (solo en privado)
handler.before = async (m, { conn }) => {
  try {
    const isGroup = m.chat.endsWith('@g.us')
    if (isGroup) return // No procesar botones en grupos

    // Verificar si es una respuesta a botones
    const isButtonResponse = 
      m.message?.buttonsResponseMessage || 
      m.message?.interactiveResponseMessage
    
    if (!isButtonResponse) return
    
    // Obtener el ID del botón presionado
    let buttonId;
    if (m.message.buttonsResponseMessage) {
      buttonId = m.message.buttonsResponseMessage.selectedButtonId
    } else if (m.message.interactiveResponseMessage) {
      buttonId = m.message.interactiveResponseMessage.selectedButtonId
    } else {
      return
    }
    
    const creators = {
      'owner1': { 
        name: 'インマヌエル', 
        number: '5217225305296',
        rango: 'Fundador Principal'
      },
      'owner2': { 
        name: 'FÉLIX OFC', 
        number: '573235915041',
        rango: 'Editor y Desarrollador'
      },
      'owner3': { 
        name: 'Dioneibi-rip', 
        number: '18294868853',
        rango: 'Editor y Desarrollador'
      },
      'owner4': { 
        name: 'Arlette Xz', 
        number: '573114910796',
        rango: 'Desarrolladora Principal y Corregidora de Errores'
      },
      'owner5': { 
        name: 'Nevi Dev', 
        number: '18096758983',
        rango: 'Desarrollador Principal'
      }
    }
    
    const creator = creators[buttonId]
    if (creator) {
      // Enviar mensaje de rango
      await conn.sendMessage(m.chat, { 
        text: `Rango: ${creator.rango}`
      }, { 
        quoted: m 
      })

      // Enviar contacto
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
    console.error('Error en handler.before:', error)
  }
}

handler.help = ['owner', 'creador']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'contacto', 'creadora']

export default handler
