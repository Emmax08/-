import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

const packname = '˚mᥲríᥲ k᥆ȷᥙ᥆-bot';
const redes = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D';

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
};

function getCommandsByTags(plugins, tags, usedPrefix) {
    let commands = [];
    for (const plugin of Object.values(plugins)) {
        if (plugin.tags && plugin.help) {
            const hasMatchingTag = plugin.tags.some(tag => tags.includes(tag));
            if (hasMatchingTag) {
                for (const help of plugin.help) {
                    if (!/^\$|^=>|^>/.test(help)) commands.push(`${usedPrefix}${help}`);
                }
            }
        }
    }
    return [...new Set(commands)].sort((a, b) => a.localeCompare(b));
}

let handler = async (m, { conn, usedPrefix, args }) => {
    let enlaces;
    try {
        const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');
        enlaces = JSON.parse(fs.readFileSync(dbPath, 'utf-8')).links;
    } catch (e) {
        enlaces = { 
            video: ["https://raw.githubusercontent.com/danielalejandrobasado-glitch/Yotsuba-MD-Premium/main/uploads/fa3f90a6d1d5c9dd.mp4"], 
            imagen: ["https://raw.githubusercontent.com/danielalejandrobasado-glitch/Yotsuba-MD-Premium/main/uploads/23e7f3919e8839a3.jpg"] 
        };
    }

    const videoGif = enlaces.video[Math.floor(Math.random() * enlaces.video.length)];
    const miniaturaRandom = enlaces.imagen[Math.floor(Math.random() * enlaces.imagen.length)];
    const horarioFecha = moment().tz('America/Mexico_City').format('dddd, DD [de] MMMM [del] YYYY || HH:mm A');

    const encabezado = `*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*\n*│ 👑 | 𝐌𝐀𝐑𝐈𝐀 𝐊𝐎𝐉𝐔𝐎 𝐁𝐎𝐓 | 🪽*\n*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*\n⎔ \`\`\`${horarioFecha}\`\`\``.trim();

    const selectedCategory = args[0]?.toLowerCase();

    if (selectedCategory && isNaN(selectedCategory)) {
        let categoryEntry = Object.entries(CATEGORIES).find(([name, data]) => 
            data.tags.includes(selectedCategory) || name.toLowerCase().includes(selectedCategory)
        );
        
        if (categoryEntry) {
            const [name, data] = categoryEntry;
            const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix);
            return await conn.sendMessage(m.chat, {
                video: { url: videoGif },
                gifPlayback: true, // <--- AQUÍ ESTÁ EL CAMBIO
                caption: `*${data.emoji} CATEGORÍA: ${name.toUpperCase()}*\n\n${comandos.map(cmd => `> ${cmd}`).join('\n')}\n\n${packname}`,
                contextInfo: { 
                    externalAdReply: { title: packname, body: name, thumbnailUrl: miniaturaRandom, sourceUrl: redes, mediaType: 1 }
                }
            }, { quoted: m });
        }
    }

    const allCategories = Object.entries(CATEGORIES);
    const totalPages = Math.ceil(allCategories.length / 3);
    let page = (args[0] && !isNaN(args[0])) ? parseInt(args[0]) : 1;
    if (page < 1) page = 1; if (page > totalPages) page = totalPages;

    const currentCategories = allCategories.slice((page - 1) * 3, page * 3);
    let buttons = currentCategories.map(([name, data]) => ({
        buttonId: `${usedPrefix}menu ${data.tags[0]}`,
        buttonText: { displayText: `${data.emoji} ${name}` },
        type: 1
    }));

    if (page > 1) buttons.push({ buttonId: `${usedPrefix}menu ${page - 1}`, buttonText: { displayText: '⏪ Anterior' }, type: 1 });
    if (page < totalPages) buttons.push({ buttonId: `${usedPrefix}menu ${page + 1}`, buttonText: { displayText: '⏩ Siguiente' }, type: 1 });

    const buttonMessage = {
        video: { url: videoGif },
        gifPlayback: true, // <--- AQUÍ TAMBIÉN PARA EL MENÚ PRINCIPAL
        caption: encabezado + readMore + `\n\n*Selecciona una categoría (Pág. ${page}/${totalPages}):*`,
        footer: packname,
        buttons: buttons,
        headerType: 4,
        viewOnce: true,
        contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: { title: 'MENU PRINCIPAL', body: packname, thumbnailUrl: miniaturaRandom, sourceUrl: redes, mediaType: 1 }
        }
    };

    return await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu','help','menú']

export default handler;
