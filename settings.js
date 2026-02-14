import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = '' //Ejemplo: 573218138672

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
  ['18096758983', '⟆⃝༉⃟⸙ ᯽ N͙e͙v͙i͙-D͙e͙v͙ ⌗⚙️࿐', true],
  ['5217223004357', '👑 𓅓𝙀𝙈𝙈𝘼𝙓-𝙓 ☣ ࿐', true],
  ['18294868853', '⏤͟͞ू⃪ ፝͜⁞𝘿𝙞𝙤𝙣𝙚𝙞𝙗𝙞-ʳⁱᵖ ִֶ ࣪˖ ִֶָ🐇་༘', true],
  ['573135180876', '⏤͟͞ू⃪ 𝐃𝐮𝐚𝐫𝐭𝐞𝐗𝐕 ፝͜⁞ ⌗⚡࿐', true],
  ['573114910796', 'Arlette-Xz-🦇', true],
  ['40875757428882', 'Emmax', true],
  ['260081845334105', 'nevi', true],
  ['200141197844495', 'Dioneibi', true],
  ['177266856313074', 'Arlette-Xz-🦇', true]
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = ['527225305296']
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16'
global.languaje = 'Español'
global.vs = '2.2.0'
global.nameqr = 'mᥲríᥲ k᥆ȷᥙ᥆-bot'
global.namebot = 'ᯓ★ mᥲríᥲ k᥆ȷᥙ᥆ 𝑩𝒐𝒕 ִֶָ ࣪ ִֶָ🪽་༘࿐'
global.Mariasessions = 'MariaSessions'
global.jadi = 'MariaJadiBots'
global.MariaJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.fkontak = {
	key: {
		participant: '0@s.whatsapp.net',
		remoteJid: 'status@broadcast'
	},
	message: {
		contactMessage: {
			displayName: `mᥲríᥲ k᥆ȷᥙ᥆ Bot`,
			vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;mᥲríᥲ k᥆ȷᥙ᥆ Bot;;;\nFN:mᥲríᥲ k᥆ȷᥙ᥆ Bot\nitem1.TEL;waid=1234567890:1234567890\nitem1.X-ABLabel:Bot\nEND:VCARD`
		}
	}
};

// Define APIKeys como un objeto vacío para evitar el segundo error.
// Esto es necesario aunque no uses API keys.
global.APIKeys = {};
//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '👑⟶꯭̽mᥲríᥲ k᥆ȷᥙ᥆⎯̽―̥ '
global.botname = '⏤͟͟͞͞⸙ְ̻࠭🪽 mᥲríᥲ k᥆ȷᥙ᥆ 𝘽𝙤𝙩 𝙈X 𑂘⃘۪〬🫐ᩙ⸙ְ̻࠭'
global.wm = '🌹⟶꯭̽mᥲríᥲ k᥆ȷᥙ᥆ 𝐁𝐨࡙ͫ𝐭꯭͠⎯̽―̥ 𝐌X 🌹'
global.author = '𐔌 Emmax-kun ❝ 𝗠𝗮𝗱𝗲 𝗪𝗶𝘁𝗵 𝗟𝗼𝘃𝗲 ❞ 𓆩 ͡꒱'
global.dev = '⚙️ ⌬ 𝙲𝚞𝚜𝚝𝚘𝚖 𝙼𝚘𝚍𝚜 𝙱𝚢 𐔌Emmax-kun 💻🛠️'
global.textbot = '⏤͟͞ू⃪ mᥲríᥲ k᥆ȷᥙ᥆-𝑩𝒐𝒕🌸⃝𖤐 • 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 emmax-kun'
global.etiqueta = 'ˑ 𓈒 𐔌 Emmax-kun ꒱ ۫'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = 'Wones'
global.welcom1 = '❍ Edita Con El Comando setwelcome'
global.welcom2 = '❍ Edita Con El Comando setbye'
global.banner = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1747289219876.jpeg'
global.avatar = 'https://files.catbox.moe/d2b1e8.jpg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/C5mcdeiWkO8DkcCAR7GZJM'
global.comunidad1 = 'https://chat.whatsapp.com/KQC4pmJF2IvHfVbvUZS2XO?mode=ac_t'
global.channel = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D'
global.channel2 = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D'
global.md = 'https://github.com/Dioneibi-rip/Ruby-Hoshino-Bot'
global.correo = 'nevijose4@gmail.com'
global.cn ='https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D';

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363401893800327@newsletter',
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

global.rpg = {
  emoticon(string) {
    string = string.toLowerCase();
    const emot = {
      level: '🌟 Nivel',
      coin: '💸 Coin',
      exp: '✨ Experiencia',
      bank: '🏦 Banco',
      diamond: '💎 Diamante',
      health: '❤️ Salud',
      kyubi: '🌀 Magia',
      joincount: '💰 Token',
      emerald: '♦️ Esmeralda',
      stamina: '⚡ Energía',
      role: '⚜️ Rango',
      premium: '🎟️ Premium',
      pointxp: '📧 Puntos Exp',
      gold: '👑 Oro',
      iron: '⛓️ Hierro',
      coal: '🌑 Carbón',
      stone: '🪨 Piedra',
      potion: '🥤 Poción',
    };
    const results = Object.keys(emot).map((v) => [v, new RegExp(v, 'gi')]).filter((v) => v[1].test(string));
    if (!results.length) return '';
    else return emot[results[0][0]];
  }};
global.rpgg = { 
  emoticon(string) {
    string = string.toLowerCase();
    const emott = {
      level: '🌟',
      coin: '💸',
      exp: '✨',
      bank: '🏦',
      diamond: '💎',
      health: '❤️',
      kyubi: '🌀',
      joincount: '💰',
      emerald: '♦️',
      stamina: '⚡',
      role: '⚜️',
      premium: '🎟️',
      pointxp: '📧',
      gold: '👑',
      iron: '⛓️',
      coal: '🌑',
      stone: '🪨',
      potion: '🥤',
    };
    const results = Object.keys(emott).map((v) => [v, new RegExp(v, 'gi')]).filter((v) => v[1].test(string));
    if (!results.length) return '';
    else return emott[results[0][0]];
  }};  
//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.APIs = {
xyro: { url: "https://xyro.site", key: null },
yupra: { url: "https://api.yupra.my.id", key: null },
vreden: { url: "https://api.vreden.web.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
zenzxz: { url: "https://api.zenzxz.my.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null }
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
