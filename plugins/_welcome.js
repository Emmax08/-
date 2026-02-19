const handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata }) {
    // Si no es un evento de sistema (stub), ignorar
    if (!m.messageStubType || !m.isGroup) return !0

    const chat = global.db.data.chats[m.chat]
    if (!chat?.welcome) return !0

    const who = m.messageStubParameters?.[0]
    if (!who) return !0

    const taguser = `@${who.split('@')[0]}`
    const botname = global.author || 'Maria Bot'
    const background = 'https://raw.githubusercontent.com/danielalejandrobasado-glitch/Yotsuba-MD-Premium/main/uploads/23e7f3919e8839a3.jpg'
    
    let profile
    try {
        profile = await conn.profilePictureUrl(who, 'image')
    } catch {
        profile = 'https://raw.githubusercontent.com/danielalejandrobasado-glitch/Yotsuba-MD-Premium/main/uploads/23e7f3919e8839a3.jpg'
    }

    // --- BIENVENIDA ---
    if (m.messageStubType === 27) {
        const welcomeImg = `https://api.siputzx.my.id/api/canvas/welcomev4?avatar=${encodeURIComponent(profile)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(taguser)}`
        
        await conn.sendMessage(m.chat, {
            product: {
                productImage: { url: welcomeImg },
                productId: 'welcome-001',
                title: '─ W E L C O M E ─ 👑',
                currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1
            },
            businessOwnerJid: '0@s.whatsapp.net',
            caption: `*¡Bienvenido/a al grupo!*\n\n> Usuario: ${taguser}\n> Miembros: *${groupMetadata?.participants?.length || '---'}*\n\nDisfruta tu estadía.`,
            footer: `© ${botname}`,
            mentions: [who]
        }, { quoted: fkontak() }) // Usamos una función interna para el fake contacto
    }

    // --- DESPEDIDA ---
    if (m.messageStubType === 28 || m.messageStubType === 32) {
        const goodbyeImg = `https://api.siputzx.my.id/api/canvas/goodbyev4?avatar=${encodeURIComponent(profile)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(taguser)}`
        
        await conn.sendMessage(m.chat, {
            product: {
                productImage: { url: goodbyeImg },
                productId: 'goodbye-001',
                title: '─ Ａ Ｄ Ｉ Ō Ｓ ─ 🕊️',
                currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1
            },
            businessOwnerJid: '0@s.whatsapp.net',
            caption: `> Usuario: ${taguser}\n\n*Ha salido del grupo.*`,
            footer: `© ${botname}`,
            mentions: [who]
        }, { quoted: fkontak() })
    }
    return !0
}

// Función para el contacto falso dentro del mismo archivo para evitar errores
function fkontak() {
  return { key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'MariaBot' }, message: { contactMessage: { displayName: global.author, vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${global.author}\nEND:VCARD` } } }
}

export default handler
