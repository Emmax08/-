let handler = async (m, { conn, args, text, participants, usedPrefix, command }) => {
  let user = m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.quoted
    ? m.quoted.sender
    : m.sender

  let lid = user.replace(/@s\.whatsapp\.net$/, '') + ''

  let caption = `
┏ׅ〘 *🌸 𝙇𝙞𝘿 𝙙𝙚𝙡 𝙪𝙨𝙪𝙖𝙧𝙞𝙤* 〙
┃✦ 𝙐𝙨𝙪𝙖𝙧𝙞𝙤: @${user.split('@')[0]}
┃✦ 𝙇𝙄𝘿: ${lid}
┗━━━━━━━━━━━━━━
`.trim()

  await conn.reply(m.chat, caption, m, {
    mentions: [user],
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: '🌸 LID Viewer',
        body: 'Consulta oficial de LID de WhatsApp',
        thumbnailUrl: icons,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: true,
        sourceUrl: 'https://github.com/Dioneibi-rip'
      }
    }
  })
}

handler.help = ['lid', 'lid @usuario']
handler.tags = ['tools']
handler.command = /^lid$/i
handler.group = false
handler.register = false
export default handler
