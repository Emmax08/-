import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import axios from 'axios';

// Función readMore
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

// --- Configuración del Bot y Estilo ---
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';
const packname = '˚mᥲríᥲ k᥆ȷᥙ᥆-bot';

const GITHUB_REPO_OWNER = 'Emmax08';
const GITHUB_REPO_NAME = '-';
const GITHUB_BRANCH = 'main';

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
                    if (!/^\$|^=>|^>/.test(help)) {
                        commands.push(`${usedPrefix}${help}`);
                    }
                }
            }
        }
    }
    return [...new Set(commands)].sort((a, b) => a.localeCompare(b));
}

let handler = async (m, { conn, usedPrefix, args }) => {
    let enlacesMultimedia;
    try {
        const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');
        const dbRaw = fs.readFileSync(dbPath);
        enlacesMultimedia = JSON.parse(dbRaw).links;
    } catch (e) {
        enlacesMultimedia = { video: ['https://qu.ax/Yvpx.mp4'], imagen: ['https://qu.ax/Yvpx.jpg'] };
    }

    let _package;
    try {
        _package = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    } catch { _package = { version: '1.0.0' }; }

    const esPrincipal = conn.user.jid === global.conn.user.jid;
    const numeroPrincipal = global.conn?.user?.jid?.split('@')[0] || "Desconocido";
    const totalComandos = Object.keys(global.plugins || {}).length;
    const tiempoActividad = clockString(process.uptime() * 1000);
    const totalRegistros = Object.keys(global.db?.data?.users || {}).length;
    const rtotalreg = Object.values(global.db?.data?.users || {}).filter((u) => u.registered == true).length;

    const lugarFecha = moment().tz('America/Mexico_City');
    const horarioFecha = lugarFecha.format('dddd, DD [de] MMMM [del] YYYY || HH:mm A');

    const videoGif = enlacesMultimedia.video[Math.floor(Math.random() * enlacesMultimedia.video.length)];
    const miniaturaRandom = enlacesMultimedia.imagen[Math.floor(Math.random() * enlacesMultimedia.imagen.length)];

    let localVersion = _package.version || '1.0.0';
    let serverVersion = 'N/A';
    try {
        const res = await axios.get(`https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/package.json`);
        serverVersion = res.data.version;
    } catch { serverVersion = localVersion; }

    const encabezado = `
*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*
*│ 👑 | 𝐌𝐀𝐑𝐈𝐀 𝐊𝐎𝐉𝐔𝐎 𝐁𝐎𝐓 | 🪽*
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*
⎔ \`\`\`${horarioFecha}\`\`\`
*├┈───────┈─┈──┈─┈──┈─┈*
*│* ➡️ *Versión:* ${localVersion}
*│* 📦 *Comandos:* ${totalComandos}
*│* ⏱️ *Actividad:* ${tiempoActividad}
*│* 👥 *Usuarios:* ${rtotalreg}/${totalRegistros}
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*`.trim();

    const selectedCategory = args[0]?.toLowerCase();

    // --- Lógica de Sub-menú ---
    if (selectedCategory && isNaN(selectedCategory)) {
        let categoryData;
        for (const [name, data] of Object.entries(CATEGORIES)) {
            if (data.tags.includes(selectedCategory) || name.toLowerCase().includes(selectedCategory)) {
                categoryData = [name, data];
                break;
            }
        }

        if (categoryData) {
            const [name, data] = categoryData;
            const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix);
            const textoFinal = `*${data.emoji} CATEGORÍA: ${name.toUpperCase()}*\n\n${comandos.map(cmd => `> ${cmd}`).join('\n')}\n\n${packname}`;
            
            return await conn.sendMessage(m.chat, {
                video: { url: videoGif },
                gifPlayback: true,
                caption: textoFinal,
                contextInfo: { externalAdReply: { title: packname, body: name, thumbnailUrl: miniaturaRandom, sourceUrl: redes, mediaType: 1 }}
            }, { quoted: m });
        }
    }

    // --- Lógica de Paginación ---
    const allCategories = Object.entries(CATEGORIES);
    const totalPages = Math.ceil(allCategories.length / 3);
    let page = (args[0] && !isNaN(args[0])) ? parseInt(args[0]) : 1;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const startIndex = (page - 1) * 3;
    const currentCategories = allCategories.slice(startIndex, startIndex + 3);

    let buttons = [];
    currentCategories.forEach(([name, data]) => {
        buttons.push({
            buttonId: `${usedPrefix}menu ${data.tags[0]}`,
            buttonText: { displayText: `${data.emoji} ${name}` },
            type: 1
        });
    });

    if (page > 1) buttons.push({ buttonId: `${usedPrefix}menu ${page - 1}`, buttonText: { displayText: '⏪ Anterior' }, type: 1 });
    if (page < totalPages) buttons.push({ buttonId: `${usedPrefix}menu ${page + 1}`, buttonText: { displayText: '⏩ Siguiente' }, type: 1 });

    const buttonMessage = {
        video: { url: videoGif },
        gifPlayback: true,
        caption: encabezado + readMore + `\n\n*Selecciona una categoría (Pág. ${page}/${totalPages}):*`,
        footer: packname,
        buttons: buttons,
        headerType: 4,
        viewOnce: true,
        contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
                title: 'MENU PRINCIPAL',
                body: packname,
                thumbnailUrl: miniaturaRandom,
                sourceUrl: redes,
                mediaType: 1
            }
        }
    };

    return await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^(menu|help|menú)$/i;

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
