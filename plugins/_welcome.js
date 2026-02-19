export async function before(m, { conn, usedPrefix }) {
  if (!m.isGroup) return
  if (!m.messageStubType) return

  const who = m.messageStubParameters?.[0]
  if (!who) return

  const taguser = `@${who.split('@')[0]}`
  const botname = global.author || 'Maria Bot'

  const metadata = await conn.groupMetadata(m.chat)
  const totalMembers = metadata.participants.length
  const date = new Date().toLocaleDateString('es-ES', { timeZone: "America/Mexico_City" })

  // FONDO PERMANENTE DESDE GITHUB
  const background = 'https://raw.githubusercontent.com/danielalejandrobasado-glitch/Yotsuba-MD-Premium/main/uploads/23e7f3919e8839a3.jpg'

  const fkontak = {
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'MariaBot' },
    message: { contactMessage: { displayName: botname, vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${botname}\nORG:${botname};\nTEL;type=CELL;type=VOICE;waid=0:+0\nEND:VCARD` } }
  }

  let profile
  try {
    profile = await conn.profilePictureUrl(who, 'image')
  } catch {
    // Foto por defecto estable si el usuario no tiene perfil
    profile = 'https://raw.githubusercontent.com/danielalejandrobasado-glitch/Yotsuba-MD-Premium/main/uploads/23e7f3919e8839a3.jpg'
  }

  // --- BIENVENIDA (Stub 27) ---
  if (m.messageStubType === 27) {
    const welcomeImg = `https://api.siputzx.my.id/api/canvas/welcomev4?avatar=${encodeURIComponent(profile)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(taguser)}`

    await conn.sendMessage(m.chat, {
        product: {
          productImage: { url: welcomeImg },
          productId: 'welcome-001',
          title: `─ W E L C O M E ─ 👑`,
          currencyCode: 'USD',
          priceAmount1000: '0',
          retailerId: 1677,
          productImageCount: 1
        },
        businessOwnerJid: '0@s.whatsapp.net',
        caption: `*¡Bienvenido/a al grupo!*\n\n> Usuario: ${taguser}\n> Miembros: *${totalMembers}*\n> Fecha: ${date}\n\nDisfruta tu estadía.`.trim(),
        footer: `© ${botname} · Welcome`,
        mentions: [who]
      }, { quoted: fkontak })
  }

  // --- DESPEDIDA (Stub 28 o 32) ---
  if (m.messageStubType === 28 || m.messageStubType === 32) {
    const goodbyeImg = `https://api.siputzx.my.id/api/canvas/goodbyev4?avatar=${encodeURIComponent(profile)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(taguser)}`

    await conn.sendMessage(m.chat, {
        product: {
          productImage: { url: goodbyeImg },
          productId: 'goodbye-001',
          title: '─ Ａ Ｄ Ｉ Ō Ｓ ─ 🕊️',
          currencyCode: 'USD',
          priceAmount1000: '0',
          retailerId: 1677,
          productImageCount: 1
        },
        businessOwnerJid: '0@s.whatsapp.net',
        caption: `> Usuario: ${taguser}\n> Fecha: ${date}\n\n*Ha salido del grupo.*`.trim(),
        footer: `© ${botname} · Goodbye`,
        mentions: [who]
      }, { quoted: fkontak })
  }
}
