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

    // Botón de Canal (Se usa en todos los envíos)
    const buttons = [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: 'Menú Principal' }, type: 1 },
        { buttonId: `url`, buttonText: { displayText: 'Ver Canal' }, type: 1, url: redes }
    ]

    let finalTexto = ''
    let titleHeader = '👑 MENU 🪽'

    // --- 1. LÓGICA MENU COMPLETO ---
    if (command === 'menucompleto' || command === 'allmenu') {
        finalTexto = `*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*\n*│ 👑 | 𝐌𝐀𝐑𝐈𝐀 𝐊𝐎𝐉𝐔𝐎 𝐁𝐎𝐓 | 🪽*\n*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*\n⎔ \`\`\`MENÚ TOTAL | ${horarioFecha}\`\`\`${readMore}\n\n`
        for (const [name, data] of Object.entries(CATEGORIES)) {
            const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix)
            if (comandos.length > 0) {
                finalTexto += `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n*│ ${data.emoji} ${name.toUpperCase()}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n`
                finalTexto += comandos.map(cmd => `*│* ${cmd}`).join('\n')
                finalTexto += `\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n\n`
            }
        }
        titleHeader = 'FULL LIST'
    } 

    // --- 2. LÓGICA POR SECCIÓN ---
    else if (command.replace('menu', '').toLowerCase() || args[0]) {
        let categoryKey = command.replace('menu', '').toLowerCase() || args[0]?.toLowerCase()
        let categoryEntry = Object.entries(CATEGORIES).find(([name, data]) => 
            data.tags.includes(categoryKey) || name.toLowerCase() === categoryKey
        )
        
        if (categoryEntry) {
            const [name, data] = categoryEntry
            const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix)
            finalTexto = `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n*│ ${data.emoji} SECCIÓN: ${name.toUpperCase()}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n`
            finalTexto += comandos.map(cmd => `*│* ${cmd}`).join('\n')
            finalTexto += `\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n\n${packname}`
            titleHeader = `SECCIÓN: ${name}`
        }
    }

    // --- 3. MENU DE INICIO (Si no hubo match arriba) ---
    if (!finalTexto) {
        finalTexto = `*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*\n*│ 👑 | 𝐌𝐀𝐑𝐈𝐀 𝐊𝐎𝐉𝐔𝐎 𝐁𝐎𝐓 | 🪽*\n*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*\n⎔ \`\`\`${horarioFecha}\`\`\`\n*├┈───────┈─┈──┈─┈──┈─┈*\n*│* 💡 *Uso:* \`${usedPrefix}menu <sección>\`\n*│* 📜 *Todo:* \`${usedPrefix}menucompleto\`\n*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*\n\n*SECCIONES DISPONIBLES:*\n${Object.keys(CATEGORIES).map(cat => `*│* ${usedPrefix}menu ${cat.toLowerCase()}`).join('\n')}`
        titleHeader = 'HELP CENTER'
    }

    // ENVÍO FINAL CON EL BOTÓN DE CANAL
    return await conn.sendMessage(m.chat, {
        video: { url: videoMenu },
        gifPlayback: true,
        caption: finalTexto.trim(),
        footer: 'Haz clic abajo para ver el canal oficial',
        buttons: buttons,
        headerType: 4,
        contextInfo: {
            externalAdReply: { 
                title: titleHeader, 
                body: packname, 
                thumbnailUrl: imagenMenu, 
                sourceUrl: redes, 
                mediaType: 1 
            }
        }
    }, { quoted: m })
}

handler.help = ['menu', 'menucompleto']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú', 'menucompleto', 'allmenu', 'menunsfw', 'menuaia', 'menudescargas']

export default handler
