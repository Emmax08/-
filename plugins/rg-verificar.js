import { createHash } from 'crypto'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text }) {
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)

  if (user.registered === true) throw `*『✦』Ya estás registrado. Para volver a registrarte usa: #unreg*`
  if (!Reg.test(text)) throw `*『✦』Formato incorrecto.*\nUsa:\n#reg Nombre.edad\n\nEjemplo:\n#reg Masha.18`

  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw '*『✦』El nombre es obligatorio.*'
  if (!age) throw '*『✦』La edad es obligatoria.*'
  if (name.length >= 30) throw '*『✦』El nombre no debe superar 30 caracteres.*'

  age = parseInt(age)
  if (age > 100) throw '*『😏』Viejo/a sabroso/a*'
  if (age < 5) throw '*『🍼』Ven aquí, te adoptare!!*'

  // Guardar en DB
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true
  global.db.data.users[m.sender].money += 600
  global.db.data.users[m.sender].estrellas += 10
  global.db.data.users[m.sender].exp += 245
  global.db.data.users[m.sender].joincount += 5

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)
  m.react('📩')

  let regbot = `👤 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗢 👤
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「💭」𝗡𝗼𝗺𝗯𝗿𝗲: ${name}
「✨️」𝗘𝗱𝗮𝗱: ${age} años
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「🎁」𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
• 15 Estrellas 🌟
• 5 monedas 🪙
• 245 Exp 💸
• 12 Tokens 💰
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
${global.packname || ''}`

  const imagenRegistro = 'https://files.catbox.moe/qwrn19.jpg'

  await conn.sendMessage(m.chat, {
    text: '⊱『✅ 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗗𝗢(𝗔) ✅』⊰\n\n' + regbot,
    contextInfo: {
      externalAdReply: {
        title: 'Maria Kujou Bot',
        body: 'Registro exitoso',
        thumbnailUrl: imagenRegistro,
        sourceUrl: global.redes || 'https://github.com/Dioneibi-rip',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler
