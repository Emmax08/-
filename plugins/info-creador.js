import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

    const menuText = `*LISTA - CREADORES*\n\n> Selecciona un creador para contactar:`

    const nativeButtons = [
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({ 
          display_text: 'インマヌエル', 
          url: 'https://wa.me/527225305296' 
        })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({ 
          display_text: 'FÉLIX OFC', 
          url: 'https://wa.me/573235915041' 
        })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({ 
          display_text: 'Dioneibi-rip', 
          url: 'https://wa.me/18294868853' 
        })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({ 
          display_text: 'Arlette Xz', 
          url: 'https://wa.me/573114910796' 
        })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({ 
          display_text: 'Nevi Dev', 
          url: 'https://wa.me/18096758983' 
        })
      }
    ]

    const header = proto.Message.InteractiveMessage.Header.fromObject({
      hasMediaAttachment: true,
      imageMessage: {
        url: 'https://files.catbox.moe/d2b1e8.jpg'
      }
    })

    const interactiveMessage = proto.Message.InteractiveMessage.fromObject({
      body: proto.Message.InteractiveMessage.Body.fromObject({ text: menuText }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: '> Arlette V2 🌸' }),
      header,
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: nativeButtons
      })
    })

    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { userJid: conn.user.jid, quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error('❌ Error en el comando owner:', e)
    await conn.sendMessage(m.chat, {
      text: `❌ *Error al cargar la información del creador*\n\n⚠️ *Error:* ${e.message}`
    }, { quoted: m })
  }
}

handler.help = ['owner', 'creador']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'contacto', 'creadora']

export default handler
