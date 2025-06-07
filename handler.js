import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    this.uptime = this.uptime || Date.now()
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()

    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.exp = 0
m.coin = false
try {
let user = global.db.data.users[m.sender]
if (typeof user !== 'object')

global.db.data.users[m.sender] = {}
if (user) {
if (!isNumber(user.exp))
user.exp = 0
if (!isNumber(user.coin))
user.coin = 10
if (!isNumber(user.joincount))
user.joincount = 1
if (!isNumber(user.diamond))
user.diamond = 3
if (!isNumber(user.lastadventure))
user.lastadventure = 0
if (!isNumber(user.lastclaim))
user.lastclaim = 0
if (!isNumber(user.health))
user.health = 100
if (!isNumber(user.crime))
user.crime = 0
if (!isNumber(user.lastcofre))
user.lastcofre = 0
if (!isNumber(user.lastdiamantes))
user.lastdiamantes = 0
if (!isNumber(user.lastpago))
user.lastpago = 0
if (!isNumber(user.lastcode))
user.lastcode = 0
if (!isNumber(user.lastcodereg))
user.lastcodereg = 0
if (!isNumber(user.lastduel))
user.lastduel = 0
if (!isNumber(user.lastmining))
user.lastmining = 0
if (!('muto' in user))
user.muto = false
if (!('premium' in user))
user.premium = false
if (!user.premium)
user.premiumTime = 0
if (!('registered' in user))
user.registered = false
if (!('genre' in user))
user.genre = ''
if (!('birth' in user))
user.birth = ''
if (!('marry' in user))
user.marry = ''
if (!('description' in user))
user.description = ''
if (!('packstickers' in user))
user.packstickers = null
if (!user.registered) {
if (!('name' in user))
user.name = m.name
if (!isNumber(user.age))
user.age = -1
if (!isNumber(user.regTime))
user.regTime = -1
}
if (!isNumber(user.afk))
user.afk = -1
if (!('afkReason' in user))
user.afkReason = ''
if (!('role' in user))
user.role = 'Nuv'
if (!('banned' in user))
user.banned = false
if (!('useDocument' in user))
user.useDocument = false
if (!isNumber(user.level))
user.level = 0
if (!isNumber(user.bank))
user.bank = 0
if (!isNumber(user.warn))
user.warn = 0
} else
                global.db.data.users[m.sender] = {
exp: 0,
coin: 50,
joincount: 1,
diamond: 3,
lastadventure: 0,
health: 100,
lastclaim: 0,
lastcofre: 0,
lastdiamantes: 0,
lastcode: 0,
lastduel: 0,
lastpago: 0,
lastmining: 0,
lastcodereg: 0,
muto: false,
registered: false,
genre: '',
birth: '',
marry: '',
description: '',
packstickers: null,
name: m.name,
age: -1,
regTime: -1,
afk: -1,
afkReason: '',
banned: false,
useDocument: false,
bank: 0,
level: 0,
role: 'Nuv',
premium: false,
premiumTime: 0,                 
}
let chat = global.db.data.chats[m.chat]
if (typeof chat !== 'object')
global.db.data.chats[m.chat] = {}
if (chat) {
if (!('isBanned' in chat))
chat.isBanned = false
if (!('sAutoresponder' in chat))
chat.sAutoresponder = ''
if (!('welcome' in chat))
chat.welcome = true
if (!('autolevelup' in chat))
chat.autolevelup = false
if (!('autoAceptar' in chat))
chat.autoAceptar = false
if (!('autosticker' in chat))
chat.autosticker = false
if (!('autoRechazar' in chat))
chat.autoRechazar = false
if (!('autoresponder' in chat))
chat.autoresponder = false
if (!('detect' in chat))
chat.detect = true
if (!('antiBot' in chat))
chat.antiBot = false
if (!('antiBot2' in chat))
chat.antiBot2 = false
if (!('modoadmin' in chat))                     
chat.modoadmin = false   
if (!('antiLink' in chat))
chat.antiLink = true
if (!('reaction' in chat))
chat.reaction = false
if (!('nsfw' in chat))
chat.nsfw = false
if (!('antifake' in chat))
chat.antifake = false
if (!('delete' in chat))
chat.delete = false
if (!isNumber(chat.expired))
chat.expired = 0
if (!('antiLag' in chat))
chat.antiLag = false
if (!('per' in chat))
chat.per = []
} else
global.db.data.chats[m.chat] = {
isBanned: false,
sAutoresponder: '',
welcome: true,
autolevelup: false,
autoresponder: false,
delete: false,
autoAceptar: false,
autoRechazar: false,
detect: true,
antiBot: false,
antiBot2: false,
modoadmin: false,
antiLink: true,
antifake: false,
reaction: false,
nsfw: false,
expired: 0, 
antiLag: false,
per: [],
}
        var settings = global.db.data.settings[this.user.jid]
        if (typeof settings !== 'object')
            global.db.data.settings[this.user.jid] = {}
        if (settings) {
            if (!('self' in settings))
                settings.self = false
            if (!('restrict' in settings))
                settings.restrict = true
            if (!('jadibotmd' in settings))
                settings.jadibotmd = true
            if (!('antiPrivate' in settings))
                settings.antiPrivate = false
            if (!('autoread' in settings))
                settings.autoread = false
        } else
            global.db.data.settings[this.user.jid] = {
                self: false,
                restrict: true,
                jadibotmd: true,
                antiPrivate: false,
                autoread: false,
                status: 0
            }

    } catch (e) {
        console.error(e)
    }

    const mainBot = global.conn.user.jid
    const chat = global.db.data.chats[m.chat] || {}
    const isSubbs = chat.antiLag === true
    const allowedBots = chat.per || []
    if (!allowedBots.includes(mainBot))
        allowedBots.push(mainBot)
    const isAllowed = allowedBots.includes(this.user.jid)
    if (isSubbs && !isAllowed)
        return

    if (opts['nyimak'])
        return
    if (m.isBaileys)
        return
    if (!m.fromMe && opts['self'])
        return
    if (opts['swonly'] && m.chat !== 'status@broadcast')
        return

    if (typeof m.text !== 'string')
        m.text = ''

    let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

    const sendNum = m.sender.replace(/[^0-9]/g, '')
    const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)]
        .map(v => v.replace(/[^0-9]/g, ''))
        .includes(sendNum)

    const isOwner = isROwner
    const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)

    if (opts['queque'] && m.text && !(isMods || isPrems)) {
        let queque = this.msgqueque, time = 1000 * 5
        const previousID = queque[queque.length - 1]
        queque.push(m.id || m.key.id)
        setInterval(async function () {
            if (queque.indexOf(previousID) === -1)
                clearInterval(this)
            await delay(time)
        }, time)
    }

    if (m.isBaileys)
        return
    m.exp += Math.ceil(Math.random() * 10)
    let usedPrefix
    const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
    const participants = (m.isGroup ? groupMetadata.participants : []) || []
    const normalizeJid = jid => jid?.replace(/[^0-9]/g, '')
    const cleanJid = jid => jid?.split(':')[0] || ''
    const senderNum = normalizeJid(m.sender)
    const botNums = [this.user.jid, this.user.lid].map(j => normalizeJid(cleanJid(j)))
    const user = m.isGroup ? participants.find(u => normalizeJid(u.id) === senderNum) : {}
    const bot = m.isGroup ? participants.find(u => botNums.includes(normalizeJid(u.id))) : {}
    const isRAdmin = user?.admin === 'superadmin'
    const isAdmin = isRAdmin || user?.admin === 'admin'
    const isBotAdmin = !!bot?.admin

    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
    for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin)
            continue
        if (plugin.disabled)
            continue
        const __filename = join(___dirname, name)
        if (typeof plugin.all === 'function') {
            try {
                await plugin.all.call(this, m, {
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                })
            } catch (e) {
                console.error(e)
            }
        }
        if (!opts['restrict'])
            if (plugin.tags && plugin.tags.includes('admin')) {
                continue
            }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
let match = (_prefix instanceof RegExp ? 
[[_prefix.exec(m.text), _prefix]] :
Array.isArray(_prefix) ?
_prefix.map(p => {
let re = p instanceof RegExp ?
p :
new RegExp(str2Regex(p))
return [re.exec(m.text), re]
}) :
typeof _prefix === 'string' ?
[[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
[[[], new RegExp]]
).find(p => p[1])
        if (typeof plugin.before === 'function') {
            if (await plugin.before.call(this, m, {
                match,
                conn: this,
                participants,
                groupMetadata,
                user,
                bot,
                isROwner,
                isOwner,
                isRAdmin,
                isAdmin,
                isBotAdmin,
                isPrems,
                chatUpdate,
                __dirname: ___dirname,
                __filename
            }))
                continue
        }
        if (typeof plugin !== 'function')
            continue
        if ((usedPrefix = (match[0] || '')[0])) {
            let noPrefix = m.text.replace(usedPrefix, '')
            let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
            args = args || []
            let _args = noPrefix.trim().split` `.slice(1)
            let text = _args.join` `
            command = (command || '').toLowerCase()
            let fail = plugin.fail || global.dfail
            let isAccept = plugin.command instanceof RegExp ? 
                plugin.command.test(command) :
                Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ? 
                        cmd.test(command) :
                        cmd === command) :
                typeof plugin.command === 'string' ?
                    plugin.command === command :
                false

            global.comando = command

            if ((m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20)))
                return

            if (!isAccept) {
                continue
            }
            m.plugin = name
            if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                let chat = global.db.data.chats[m.chat]
                let user = global.db.data.users[m.sender]
                if (!['grupo-unbanchat.js'].includes(name) && chat && chat.isBanned && !isROwner)
                    return
                if (name != 'grupo-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'grupo-delete.js' && chat?.isBanned && !isROwner)
                    return
                if (user.antispam > 2)
                    return
                if (m.text && user.banned && !isROwner) {
                    m.reply(`《✦》¡Oh no! Qué tragedia... ¡Estás baneado/a! No puedes usar comandos en este bot 🤭

✰ *Motivo:* ${user.bannedReason ? `${user.bannedReason}` : '¡Vaya! Ni siquiera se tomaron la molestia de decir por qué 😂'}

> ✧ Pero tranquilo/a, si *por algún milagro* este bot es oficial y tienes pruebas (de otro universo probablemente), puedes *intentar* hablar con un moderador. Suerte con eso. 😌`)
                    user.antispam++
                    return
                }

                if (user.antispam2 && isROwner)
                    return
                let time = global.db.data.users[m.sender].spam + 3000
                if (new Date - global.db.data.users[m.sender].spam < 3000)
                    return console.log(`[ SPAM ]`)
                global.db.data.users[m.sender].spam = new Date * 1
            }

            let extra = {
                match,
                usedPrefix,
                noPrefix,
                _args,
                args,
                command,
                text,
                conn: this,
                participants,
                groupMetadata,
                user,
                bot,
                isROwner,
                isOwner,
                isRAdmin,
                isAdmin,
                isBotAdmin,
                isPrems,
                chatUpdate,
                __dirname: ___dirname,
                __filename
            }
            try {
                await plugin.call(this, m, extra)
                if (!isPrems)
                    m.coin = m.coin || plugin.coin || false
            } catch (e) {
                m.error = e
                console.error(e)
                if (e) {
                    let text = format(e)
                    for (let key of Object.values(global.APIKeys))
                        text = text.replace(new RegExp(key, 'g'), 'Administrador')
                    m.reply(text)
                }
            } finally {
                if (typeof plugin.after === 'function') {
                    try {
                        await plugin.after.call(this, m, extra)
                    } catch (e) {
                        console.error(e)
                    }
                }
                if (m.coin)
                    conn.reply(m.chat, `❮✦❯ Utilizaste ${+m.coin} ${moneda}`, m)
}
break
}}
} catch (e) {
console.error(e)
} finally {
if (opts['queque'] && m.text) {
const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
}
let user, stats = global.db.data.stats
if (m) { let utente = global.db.data.users[m.sender]
if (utente.muto == true) {
let bang = m.key.id
let cancellazzione = m.key.participant
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: cancellazzione }})
}
if (m.sender && (user = global.db.data.users[m.sender])) {
user.exp += m.exp
user.coin -= m.coin * 1
}

let stat
if (m.plugin) {
let now = +new Date
if (m.plugin in stats) {
stat = stats[m.plugin]
if (!isNumber(stat.total))
stat.total = 1
if (!isNumber(stat.success))
stat.success = m.error != null ? 0 : 1
if (!isNumber(stat.last))
stat.last = now
if (!isNumber(stat.lastSuccess))
stat.lastSuccess = m.error != null ? 0 : now
} else
stat = stats[m.plugin] = {
total: 1,
success: m.error != null ? 0 : 1,
last: now,
lastSuccess: m.error != null ? 0 : now
}
stat.total += 1
stat.last = now
if (m.error == null) {
stat.success += 1
stat.lastSuccess = now
}}}

try {
if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
} catch (e) { 
console.log(m, m.quoted, e)}
let settingsREAD = global.db.data.settings[this.user.jid] || {}  
if (opts['autoread']) await this.readMessages([m.key])

if (db.data.chats[m.chat].reaction && m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|yuki|a|s)/gi)) {
let emot = pickRandom(["🍟", "😃", "😄", "😁", "😆", "🍓", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "🌺", "🌸", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🌟", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "💫", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤖", "🍭", "🤫", "🫠", "🤥", "😶", "📇", "😐", "💧", "😑", "🫨", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👺", "🧿", "🌩", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🫶", "👍", "✌️", "🙏", "🫵", "🤏", "🤌", "☝️", "🖕", "🙏", "🫵", "🫂", "🐱", "🤹‍♀️", "🤹‍♂️", "🗿", "✨", "⚡", "🔥", "🌈", "🩷", "❤️", "🧡", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🚩", "👊", "⚡️", "💋", "🫰", "💅", "👑", "🐣", "🐤", "🐈"])
if (!m.fromMe) return this.sendMessage(m.chat, { react: { text: emot, key: m.key }})
}
function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]}
}}

global.dfail = (type, m, conn) => {
const msg = {
  rowner: '「✖」No tienes autorización para usar esta función.

Está reservada únicamente para nevi-dev.  
No es cuestión de capacidad... es cuestión de jerarquía.

> No intentes lo que está fuera de tu alcance.',
  owner: '「✖」Acceso denegado.

Este comando está restringido al Creador y al núcleo de desarrollo.  
Tu intento ha sido registrado... y será recordado.

> No repitas este error. Algunos sistemas no perdonan.',
  mods: '「✖」Función restringida.

Este módulo solo responde a los desarrolladores autorizados.  
Cualquier intento externo será considerado una anomalía.

> No interfieras con lo que no te corresponde.',
  premium: '「🔥」¿Qué crees que haces? ¡Esta función es SOLO para usuarios Premium!  

¿No eres premium? Pues más te vale ponerte las pilas y conseguirlo YA.  

> Usa *.comprarpremium <días>* y deja de molestar.',
  group: '「⚠️」¿En serio? Este comando solo funciona en grupos.  
No en chats privados, ¿qué parte no entendiste?

> Deja de perder el tiempo y únete a un grupo si quieres usarlo.',
  private: '「⚠️」¿Privado? Sí, solo aquí, nada de andar esparciendo esto por ahí.  
Este comando es exclusivo para chats privados, no para otros lados.

> No intentes usarlo donde no debes, ¿entendido?',
  admin: '「⚠️」Solo los admin tienen derecho a usar esta mierda.  
Si no estás en esa lista, cállate y deja de molestar.

> No eres nadie aquí, aprende a respetar los límites.',
  botAdmin: '「⚠️」¿Quieres que este comando funcione? Fácil: hazme admin.  
Aunque claro, entiendo que pedirte que hagas algo útil es mucho para ti.

> Así que, o me haces admin, o sigue soñando con resultados.',
  unreg: `「⚠️」¿En serio? Todavía no estás registrado.  
No puedo hacer magia con alguien que ni siquiera se presentó.

> Regístrate ya con:  
  */reg nombre.edad*  
O sigue perdiendo el tiempo esperando que algo pase.

— Ejemplo para que no seas tan inútil:  
  */reg nevi.15*`,
  restrict: '「📵」 *¡Ouh~! Esta función está dormida por ahora~* 💤'
}[type];
if (msg) return conn.reply(m.chat, msg, m, rcanal).then(_ => m.react('✖️'))}
const file = global.__filename(import.meta.url, true);

// NO TOCAR
watchFile(file, async () => {
unwatchFile(file);
console.log(chalk.green('Actualizando "handler.js"'));
// if (global.reloadHandler) console.log(await global.reloadHandler());

if (global.conns && global.conns.length > 0 ) {
const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
for (const userr of users) {
userr.subreloadHandler(false)
}}});