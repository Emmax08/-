import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import axios from 'axios';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'; 

// --- Configuración del Bot y Estilo ---
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';
const packname = '˚mᥲríᥲ k᥆ȷᥙ᥆-bot';

const GITHUB_REPO_OWNER = 'Emmax08';
const GITHUB_REPO_NAME = '-';
const GITHUB_BRANCH = 'main';

const redes = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D';


// --- Carga de Datos Estáticos al Objeto Global (Ejecución Única) ---
// La clave para el rendimiento y la ausencia de ReferenceError es usar 'global'
// en todo el archivo.

if (typeof global.enlacesMultimedia === 'undefined') {
    global.enlacesMultimedia = { video: [], imagen: [] };
}
if (typeof global.localVersion === 'undefined') {
    global.localVersion = 'N/A';
}
if (typeof global.serverVersion === 'undefined') {
    global.serverVersion = 'N/A';
}
if (typeof global.updateStatus === 'undefined') {
    global.updateStatus = 'Desconocido';
}

// 1. Cargar DB Multimedia
try {
    const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');
    const dbRaw = fs.readFileSync(dbPath);
    global.enlacesMultimedia = JSON.parse(dbRaw).links;
} catch (e) {
    console.error("❌ Error al leer o parsear src/database/db.json:", e);
}

// 2. Cargar Versión Local
try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf8');
    global.localVersion = JSON.parse(packageJsonRaw).version || 'N/A';
} catch (error) { 
    console.error("❌ Error al cargar package.json local:", error);
    global.localVersion = 'Error';
}

// Función asíncrona para verificar la versión del servidor al inicio
async function checkServerVersion() {
    try {
        const githubPackageJsonUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/package.json`;
        const response = await axios.get(githubPackageJsonUrl);
        global.serverVersion = response.data.version || 'N/A';

        if (global.localVersion !== 'N/A' && global.serverVersion !== 'N/A') {
            global.updateStatus = (global.localVersion === global.serverVersion)
                ? '✅ En última versión'
                : `⚠️ Actualización disponible. Actualiza con \`\${usedPrefix}update\``;
        }
    } catch (error) {
        global.serverVersion = 'Error';
        global.updateStatus = '❌ No se pudo verificar la actualización';
        console.error("❌ Error al verificar versión en GitHub:", error.message);
    }
}

// Llamar a la función para que la versión se verifique al cargar el módulo
checkServerVersion();


// --- Definición de Categorías y Mapeo de Tags ---
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

// Función para obtener todos los comandos asociados a un conjunto de tags
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

// Handler principal
let handler = async (m, { conn, usedPrefix, args }) => {
    
    if (global.enlacesMultimedia.video.length === 0 || global.enlacesMultimedia.imagen.length === 0) {
        return conn.reply(m.chat, 'Error: No se pudieron cargar los datos multimedia.', m);
    }
    
    if (m.quoted?.id && m.quoted?.fromMe) return;

    const idChat = m.chat;
    
    // 2. Obtener Datos del Bot y Usuario
    let nombre;
    try {
        nombre = await conn.getName(m.sender);
    } catch {
        nombre = 'Usuario';
    }

    const esPrincipal = conn.user.jid === global.conn.user.jid;
    const numeroPrincipal = global.conn?.user?.jid?.split('@')[0] || "Desconocido";
    const totalComandos = Object.keys(global.plugins || {}).length;
    const tiempoActividad = clockString(process.uptime() * 1000);
    const totalRegistros = Object.keys(global.db?.data?.users || {}).length;
    const horaCDMX = moment().tz("America/Mexico_City").format('h:mm A');

    // USANDO VARIABLES GLOBALES CORREGIDAS
    const videoGif = global.enlacesMultimedia.video[Math.floor(Math.random() * global.enlacesMultimedia.video.length)];
    const miniaturaRandom = global.enlacesMultimedia.imagen[Math.floor(Math.random() * global.enlacesMultimedia.imagen.length)];
    
    // 3. Encabezado del Menú
    const encabezado = `
*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*
*│ 👑 | 𝐌𝐀𝐑𝐈𝐀 𝐊𝐎𝐉𝐔𝐎 𝐁𝐎𝐓 | 🪽*
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*
*│* 👤 *Usuario:* ${nombre}
*│* 🌎 *Hora CDMX:* ${horaCDMX}
*├┈───────┈─┈──┈─┈──┈─┈*
*│ 🚀 V E R S I Ó N*
*│* ➡️ *Local:* ${global.localVersion}
*│* ➡️ *Servidor:* ${global.serverVersion}
*│* 📊 *Estado:* ${global.updateStatus.replace(usedPrefix, `\`${usedPrefix}`)}*
*├┈───────┈─┈──┈─┈──┈─┈*
*│ 📊 I N F O R M A C I Ó N*
*│* 📦 *Comandos:* ${totalComandos}
*│* ⏱️ *Actividad:* ${tiempoActividad}
*│* 👥 *Regis. Usuarios:* ${totalRegistros}
*│* 👑 *Dueño:* Emmax
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*
*🤖 E S T A D O S D E L B O T*
*├┈───────┈─┈──┈─┈──┈─┈*
*│* 👑 *Bot:* ${esPrincipal ? 'Principal' : 'Sub-Bot'}
*│* 🔗 *Principal:* wa.me/${numeroPrincipal}
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*
    `.trim();

    // 4. ContextInfo para Reutilizar
    const contextInfo = {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid,
            newsletterName,
            serverMessageId: -1
        },
        externalAdReply: {
            title: packname,
            body: '👑 Menú de Comandos | mᥲríᥲ k᥆ȷᥙ᥆-Bot 🪽',
            thumbnailUrl: miniaturaRandom,
            sourceUrl: redes,
            mediaType: 1, 
            renderLargerThumbnail: false
        }
    };

    // 5. Lógica para Sub-menú
    const selected
