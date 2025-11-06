import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

    const menuText = `*LISTA - CREADORES*\n\n> Selecciona un creador para contactar:\n\n• *インマヌエル* - @527225305296\n• *FÉLIX OFC* - @573235915041\n• *Dioneibi-rip* - @18294868853\n• *Arlette Xz* - @573114910796\n• *Nevi Dev* - @18096758983`

    const buttons = [
      {
        buttonId: 'owner1',
        buttonText: { displayText: '📞 インマヌエル' },
        type: 1
      },
      {
        buttonId: 'owner2',
        buttonText: { displayText: '📞 FÉLIX OFC' },
        type: 1
      },
      {
        buttonId: 'owner3',
        buttonText: { displayText: '📞 Dioneibi-rip' },
        type: 1
      },
      {
        buttonId: 'owner4',
        buttonText: { displayText: '📞 Arlette Xz' },
        type: 1
      },
      {
        buttonId: 'owner5',
        buttonText: { displayText: '📞 Nevi Dev' },
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

  } catch (e) {
    console.error('❌ Error en el comando owner:', e)
    
    const backupText = `*LISTA - CREADORES*

• *インマヌエル*: https://wa.me/527225305296
• *FÉLIX OFC*: https://wa.me/573235915041
• *Dioneibi-rip*: https://wa.me/18294868853
• *Arlette Xz*: https://wa.me/573114910796
• *Nevi Dev*: https://wa.me/18096758983

Selecciona un contacto`
    
    await conn.sendMessage(m.chat, { 
      text: backupText,
      contextInfo: {
        externalAdReply: {
          title: 'Contacta a los Creadores',
          body: 'Lista de contactos',
          thumbnailUrl: 'https://files.catbox.moe/d2b1e8.jpg',
          sourceUrl: 'https://wa.me/573114910796',
          mediaType: 1
        }
      }
    }, { quoted: m })
  }
}

// Manejador para los botones - cuando el usuario toca un botón
handler.before = async (m, { conn }) => {
  // Verificar si es una respuesta a botones
  if (!m.message?.buttonsResponseMessage) return
  
  const buttonId = m.message.buttonsResponseMessage.selectedButtonId
  const creators = {
    'owner1': { 
      name: 'インマヌエル', 
      number: '527225305296',
      link: 'https://wa.me/527225305296'
    },
    'owner2': { 
      name: 'FÉLIX OFC', 
      number: '573235915041',
      link: 'https://wa.me/573235915041'
    },
    'owner3': { 
      name: 'Dioneibi-rip', 
      number: '18294868853',
      link: 'https://wa.me/18294868853'
    },
    'owner4': { 
      name: 'Arlette Xz', 
      number: '573114910796',
      link: 'https://wa.me/573114910796'
    },
    'owner5': { 
      name: 'Nevi Dev', 
      number: '18096758983',
      link: 'https://wa.me/18096758983'
    }
  }
  
  const creator = creators[buttonId]
  if (creator) {
    // Enviar mensaje con la información del contacto
    const contactInfo = `*👤 INFORMACIÓN DE CONTACTO*

*Nombre:* ${creator.name}
*Número:* +${creator.number}
*Enlace directo:* ${creator.link}

_Haz clic en el enlace para iniciar conversación_`

    await conn.sendMessage(m.chat, { 
      text: contactInfo
    }, { quoted: m })

    // Opcional: También enviar el contacto como tarjeta VCard
    await conn.sendMessage(m.chat, {
      contacts: {
        contacts: [{
          displayName: creator.name,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${creator.name}\nTEL;type=CELL;type=VOICE;waid=${creator.number}:+${creator.number}\nEND:VCARD`
        }]
      }
    }, { quoted: m })
  }
}

handler.help = ['owner', 'creador']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'contacto', 'creadora']

export default handler
