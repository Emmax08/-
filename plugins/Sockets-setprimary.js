// 🌸✨🌸✨🌸✨🌸✨🌸✨🌸✨🌸
//   El Consentido de Maria-chan 
// 🌸✨🌸✨🌸✨🌸✨🌸✨🌸✨🌸

import ws from 'ws'

const handler = async (m, { conn }) => {
  const activeBots = [...new Set([
    ...global.conns
      .filter((c) => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)
      .map((c) => c.user.jid)
  ])]
  
  if (global.conn?.user?.jid && !activeBots.includes(global.conn.user.jid)) {
    activeBots.push(global.conn.user.jid)
  }

  const chat = global.db.data.chats[m.chat]
  const who = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : false)

  if (!who) {
    return conn.reply(m.chat, `✨ *¡Ara, ara!* ✨\n\n¿A quién vamos a mimar hoy? Necesitas mencionar a alguien para que sea mi ayudante principal. ♡`, m)
  }
  
  if (!activeBots.includes(who)) {
    return conn.reply(m.chat, `🌸 *Lo siento mucho...* 🌸\n\n@${who.split`@`[0]} no parece estar disponible ahora mismo. ¿Estará tomando una siesta? *Khorosho...*`, m, { mentions: [who] })
  }

  try {
    chat.primaryBot = who 
    
    const txt = `✨ *¡Escuchen todos con atención!* ✨\n\n` +
                `Desde ahora, @${who.split`@`[0]} es mi pequeñito favorito en este grupo. ♡\n` +
                `Él se encargará de cuidarlos a todos, ¡así que denle mucho amor!\n\n` +
                `*¡Qué lindo se siente estar todos juntos! ✨*`
    
    await conn.reply(m.chat, txt, m, { mentions: [who] })
  } catch (e) {
    conn.reply(m.chat, `⚠️ *¡Oh, no! Algo salió mal...* \nPero no te preocupes, ¡seguro se soluciona pronto! ✨`, m)
  }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = /^(setprimary)$/i 
handler.group = true
handler.admin = true

export default handler
