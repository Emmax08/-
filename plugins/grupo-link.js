var handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) throw '❌ Este comando solo funciona en grupos'
  if (!isBotAdmin) throw '❌ Necesito ser *administrador* para generar el link'
  if (!isAdmin) throw '❌ Solo los administradores pueden usar este comando'

  try {
    let group = m.chat
    let code = await conn.groupInviteCode(group)
    let link = 'https://chat.whatsapp.com/' + code
    await conn.reply(m.chat, `✿:･✧ 𝐋𝐢𝐧𝐤 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐨 ✧･:✿\n\n${link}`, m, { detectLink: true })
  } catch (e) {
    console.error(e)
    throw '❌ No pude obtener el link del grupo, revisa que el bot sea admin'
  }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler
