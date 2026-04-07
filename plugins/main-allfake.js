import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m

handler.all = async function (m) {

global.getBuffer = async function getBuffer(url, options) {
  try {
    options ? options : {}
    var res = await axios({
      method: "get",
      url,
      headers: {
        'DNT': 1,
        'User-Agent': 'GoogleBot',
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    })
    return res.data
  } catch (e) {
    console.log(`Error : ${e}`)
  }
}

// Lista de iconos
const iconUrls =[
"https://files.catbox.moe/ghhsou.jpg", "https://files.catbox.moe/uggt0h.jpg", "https://files.catbox.moe/bsii3i.jpg", "https://files.catbox.moe/qwrn19.jpg"
]

// Función para elegir y descargar un icono aleatorio
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const iconUrl = pickRandom(iconUrls)
global.icono = await getBuffer(iconUrl)

//creador y otros
global.creador = '268998834966688@lid'
global.ofcbot = `${conn.user.jid.split('@')[0]}`
global.asistencia = 'Wa.me/5217225305296'
global.namechannel = '*mᥲríᥲ k᥆ȷᥙ᥆-BOT-CHANNEL*'
global.namechannel2 = '*mᥲríᥲ k᥆ȷᥙ᥆-BOT-CHANNEL*'
global.namegrupo = '*mᥲríᥲ k᥆ȷᥙ᥆-BOT-OFICIAL*'
global.namecomu = '*mᥲríᥲ k᥆ȷᥙ᥆-BOT-COMMUNITY*'
global.listo = '👑 *Aquí tienes ฅ^•ﻌ•^ฅ*'
global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')

//Ids channel
global.canalIdM = ["120363401893800327@newsletter", "120363401893800327@newsletter"]
global.canalNombreM = ["⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice", "⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice"]
global.channelRD = await getRandomChannel()

//fechas
global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('es', {month: 'long'})
global.año = d.toLocaleDateString('es', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

//Reacciones De Comandos
global.rwait = '🕒'
global.done = '✅'
global.error = '✖️'
global.msm = '⚠︎'

//Emojis Maria kojuo 
global.emoji = '👑'
global.emoji2 = '👑'
global.emoji3 = '👑'
global.emoji4 = '👑'
global.emoji5 = '👑'
global.emojis = pickRandom([emoji, emoji2, emoji3, emoji4])

//Espera
global.wait = '⚘𖠵⃕❖𖥔 𝑪𝒂𝒓𝒈𝒂𝒏𝒅𝒐...ꪶꪾ❍̵̤̂ꫂ\n❝ 𝐴𝑔𝑢𝑎𝑟𝑑𝑒 𝑢𝑛 𝑚𝑜𝑚𝑒𝑛𝑡𝑜 ❞';

//Enlaces
var canal = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D'
let canal2 = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D'
var git = 'https://github.com/Emmax08' 
var github = 'https://github.com/nevi-dev/mᥲríᥲ k᥆ȷᥙ᥆-Bot-MX' 
let correo = 'nevijose4@gmail.com'
global.redes = [canal, canal2, git, github, correo].getRandom()

//Imagen aleatoria
let category = "imagen"
const db = './src/database/db.json'
const db_ = JSON.parse(fs.readFileSync(db))
const random = Math.floor(Math.random() * db_.links[category].length)
const randomlink = db_.links[category][random]
const response = await fetch(randomlink)
const rimg = await response.buffer()
global.icons = rimg

// Saludo por hora
var ase = new Date(); var hour = ase.getHours();
switch(hour){
  case 0: case 1: case 2: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;
  case 3: case 4: case 5: case 6: case 8: case 9: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break;
  case 7: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅'; break;
  case 10: case 11: case 12: case 13: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break;
  case 14: case 15: case 16: case 17: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break;
  default: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'
}
global.saludo = hour

//tags
global.nombre = m.pushName || 'Anónimo'
global.taguser = '@' + m.sender.split("@")[0]
var more = String.fromCharCode(8206)
global.readMore = more.repeat(850)

global.packsticker = `°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n🪽 Usuario: ${nombre}\n🪽 Bot: ${botname}\n🪽 Fecha: ${fecha}\n🪽 Hora: ${tiempo}`;

// rcanaɭ con icono como buffer
global.rcanal = {
  contextInfo: {
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id,
      serverMessageId: 100,
      newsletterName: channelRD.name,
    },
    externalAdReply: {
      showAdAttribution: true,
      title: botname,
      body: dev,
      mediaUrl: null,
      description: null,
      previewType: "PHOTO",
      thumbnail: global.icono,
      sourceUrl: global.redes,
      mediaType: 1,
      renderLargerThumbnail: false
    },
  }
}

}

export default handler

async function getRandomChannel() {
  let randomIndex = Math.floor(Math.random() * canalIdM.length)
  let id = canalIdM[randomIndex]
  let name = canalNombreM[randomIndex]
  return { id, name }
}
