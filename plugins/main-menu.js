import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const packname = '˚mᥲríᥲ k᥆ȷᥙ᥆-bot'
const redes = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D'

const CATEGORIES = {
    'Sub-Bot': { emoji: '🤖', tags: ['serbot'] },
    'Ajustes & Config': { emoji: '⚙️', tags: ['nable', 'owner', 'mods', 'setting'] },
    'Herramientas & Stickers': { emoji: '🛠️', tags: ['tools', 'transformador', 'herramientas', 'sticker'] },
    'Grupos & Admin': { emoji: '👥', tags: ['grupo', 'group', 'admin'] },
    'Inteligencia Artificial (AI)': { emoji: '🧠', tags: ['ai', 'image', 'ia', 'openai'] },
    'Diversión & Juegos': { emoji: '🕹️', tags: ['games', 'game', 'fun'] },
    'Anime & Emociones': { emoji: '✨', tags: ['anime', 'emox', 'waifus', 'gacha'] },
    'Información': { emoji: 'ℹ️', tags: ['info'] },
    'Principal': { emoji: '🏠', tags: ['main'] },
    'Economía & RPG': { emoji: '💰', tags: ['rpg', 'economia', 'economy'] },
    'Descargas & Buscadores': { emoji: '⬇️', tags: ['descargas', 'buscador', 'dl', 'internet', 'search'] },
    '+18 / NSFW': { emoji: '🔞', tags: ['+18', 'nsfw'] },
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

let handler = async (m, { conn, usedPrefix }) => {
    // 1. IMPORTACIÓN ÚNICA DESDE EL JSON
    const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json')
    const json = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
    
    // Usamos los enlaces directamente del JSON que me pasaste
    const videoMenu = json.links.video[0]
    const imagenMenu = json.links.imagen[0]

    const horarioFecha = moment().tz('America/Mexico_City').format('DD/MM/YYYY || HH:mm A')

    // 2. Construcción del Menú Completo
    let menuTexto = `*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*
*│ 👑 | 𝐌𝐀𝐑𝐈𝐀 𝐊𝐎𝐉𝐔𝐎 𝐁𝐎𝐓 | 🪽*
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*
⎔ \`\`\`${horarioFecha}\`\`\`
*├┈───────┈─┈──┈─┈──┈─┈*
*│* 👤 *Usuario:* @${m.sender.split('@')[0]}
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*${readMore}\n\n`

    for (const [name, data] of Object.entries(CATEGORIES)) {
        const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix)
        if (comandos.length > 0) {
            menuTexto += `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n*│ ${data.emoji} ${name.toUpperCase()}*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n`
            menuTexto += comandos.map(cmd => `*│* ${cmd}`).join('\n')
            menuTexto += `\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n\n`
        }
    }

    menuTexto += `_Powered by Maria Kojuo Bot_`

    // 3. Envío usando las constantes que jalamos del JSON
    return await conn.sendMessage(m.chat, {
        video: { url: videoMenu },
        gifPlayback: true,
        caption: menuTexto.trim(),
        mentions: [m.sender],
        contextInfo: {
            externalAdReply: { 
                title: '👑 MENU COMPLETO 🪽', 
                body: '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice', 
                thumbnailUrl: imagenMenu, 
                sourceUrl: redes, 
                mediaType: 1
            }
        }
    }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú']

export default handler
