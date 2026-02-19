import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const packname = '˚mᥲríᥲ k᥆ȷᥙ᥆-bot'
const redes = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D'

const CATEGORIES = {
    'Sub-Bot': { emoji: '🤖', tags: ['serbot'] },
    'Ajustes': { emoji: '⚙️', tags: ['nable', 'owner', 'mods', 'setting'] },
    'Herramientas': { emoji: '🛠️', tags: ['tools', 'transformador', 'herramientas', 'sticker'] },
    'Grupos': { emoji: '👥', tags: ['grupo', 'group', 'admin'] },
    'IA': { emoji: '🧠', tags: ['ai', 'image', 'ia', 'openai'] },
    'Juegos': { emoji: '🕹️', tags: ['games', 'game', 'fun'] },
    'Anime': { emoji: '✨', tags: ['anime', 'emox', 'waifus', 'gacha'] },
    'Info': { emoji: 'ℹ️', tags: ['info'] },
    'Principal': { emoji: '🏠', tags: ['main'] },
    'Economia': { emoji: '💰', tags: ['rpg', 'economia', 'economy'] },
    'Descargas': { emoji: '⬇️', tags: ['descargas', 'buscador', 'dl', 'internet', 'search'] },
    'Nsfw': { emoji: '🔞', tags: ['+18', 'nsfw'] },
}

function getCommandsByTags(plugins, tags, usedPrefix) {
    let commands = []
    for (const plugin of Object.values(plugins)) {
        if (plugin.tags && plugin.help) {
            const hasMatchingTag = plugin.tags.some(tag => tags.includes(tag))
            if (hasMatchingTag) {
                for (const help of plugin.help) {
                    if (!/^\$|^=>|^>/.test(help)) commands.push(`${usedPrefix}${help}`)
                }
            }
        }
    }
    return [...new Set(commands)].sort((a, b) => a.localeCompare(b))
}

let handler = async (m, { conn, usedPrefix, command, args }) => {
    const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json')
    const json = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
    const videoMenu = json.links.video[0]
    const imagenMenu = json.links.imagen[0]
    const horarioFecha = moment().tz('America/Mexico_City').format('HH:mm A')

    // --- 1. COMANDO .menucompleto ---
    if (command === 'menucompleto' || command === 'allmenu') {
        let menuCompleto = `*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*\n*│ 👑 | 𝐌𝐀𝐑𝐈𝐀 𝐊𝐎𝐉𝐔𝐎 𝐁𝐎𝐓 | 🪽*\n*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*\n⎔ \`\`\`MENÚ TOTAL | ${horarioFecha}\`\`\`${readMore}\n\n`
        for (const [name, data] of Object.entries(CATEGORIES)) {
            const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix)
            if (comandos.length > 0) {
                menuCompleto += `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n*│ ${data.emoji} ${name.toUpperCase()}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n`
                menuCompleto += comandos.map(cmd => `*│* ${cmd}`).join('\n')
                menuCompleto += `\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n\n`
            }
        }
        return await conn.sendMessage(m.chat, { video: { url: videoMenu }, gifPlayback: true, caption: menuCompleto.trim(), contextInfo: { externalAdReply: { title: '👑 FULL LIST 🪽', body: packname, thumbnailUrl: imagenMenu, sourceUrl: redes, mediaType: 1 }}}, { quoted: m })
    }

    // --- 2. COMANDOS POR SECCIÓN (ej: .menunsfw o .menu nsfw) ---
    // Si el comando es "menunsfw", forzamos que busque la categoría "nsfw"
    let categoryKey = command.replace('menu', '').toLowerCase() || args[0]?.toLowerCase()

    if (categoryKey) {
        let categoryEntry = Object.entries(CATEGORIES).find(([name, data]) => 
            data.tags.includes(categoryKey) || name.toLowerCase() === categoryKey
        )
        
        if (categoryEntry) {
            const [name, data] = categoryEntry
            const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix)
            let textoCat = `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n*│ ${data.emoji} SECCIÓN: ${name.toUpperCase()}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n`
            textoCat += comandos.map(cmd => `*│* ${cmd}`).join('\n')
            textoCat += `\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n\n${packname}`

            return await conn.sendMessage(m.chat, { video: { url: videoMenu }, gifPlayback: true, caption: textoCat, contextInfo: { externalAdReply: { title: `SECCIÓN: ${name}`, body: packname, thumbnailUrl: imagenMenu, sourceUrl: redes, mediaType: 1 }}}, { quoted: m })
        }
    }

    // --- 3. MENÚ DE INICIO (.menu solo) ---
    let helpTexto = `*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*\n*│ 👑 | 𝐌𝐀𝐑𝐈𝐀 𝐊𝐎𝐉𝐔𝐎 𝐁𝐎𝐓 | 🪽*\n*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*\n⎔ \`\`\`${horarioFecha}\`\`\`\n*├┈───────┈─┈──┈─┈──┈─┈*\n*│* 💡 *Uso:* \`${usedPrefix}menu <sección>\`\n*│* 📜 *Todo:* \`${usedPrefix}menucompleto\`\n*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*\n\n*SECCIONES DISPONIBLES:*\n${Object.keys(CATEGORIES).map(cat => `*│* ${usedPrefix}menu ${cat.toLowerCase()}`).join('\n')}`

    return await conn.sendMessage(m.chat, { video: { url: videoMenu }, gifPlayback: true, caption: helpTexto, contextInfo: { externalAdReply: { title: 'HELP CENTER', body: packname, thumbnailUrl: imagenMenu, sourceUrl: redes, mediaType: 1 }}}, { quoted: m })
}

handler.help = ['menu', 'menucompleto']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú', 'menucompleto', 'allmenu', 'menunsfw', 'menuaia', 'menudescargas'] // Agrega aquí los que quieras directos

export default handler
