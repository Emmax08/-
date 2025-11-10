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

// Las variables globales deben ser declaradas una vez.
// Usaremos "global" para que sean accesibles en toda la ejecución del bot.

// 🚨 Cargar datos al objeto global del bot.
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
const redes = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D';


// --- Carga de Datos Estáticos (Fuera del Handler) ---

// 1. Cargar DB Multimedia
try {
    const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');
    const dbRaw = fs.readFileSync(dbPath);
    global.enlacesMultimedia = JSON.parse(dbRaw).links; // Asignar a global
} catch (e) {
    console.error("❌ Error al leer o parsear src/database/db.json:", e);
}

// 2. Cargar Versión Local
try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf8');
    global.localVersion = JSON.parse(packageJsonRaw).version || 'N/A'; // Asignar a global
} catch (error) { 
    console.error("❌ Error al cargar package.json local:", error);
    global.localVersion = 'Error';
}

// Función asíncrona para verificar la versión del servidor al inicio
async function checkServerVersion() {
    try {
        const githubPackageJsonUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/package.json`;
        const response = await axios.get(githubPackageJsonUrl);
        global.serverVersion = response.data.version || 'N/A'; // Asignar a global

        if (global.localVersion !== 'N/A' && global.serverVersion !== 'N/A') {
            global.updateStatus = (global.localVersion === global.serverVersion) // Usar global
                ? '✅ En última versión'
                : `⚠️ Actualización disponible. Actualiza con *\${usedPrefix}update*`;
        }
    } catch (error) {
        global.serverVersion = 'Error';
        global.updateStatus = '❌ No se pudo verificar la actualización';
        console.error("❌ Error al verificar versión en GitHub:", error.message);
    }
}

// Llamar a la función para que la versión se verifique al cargar el módulo
checkServerVersion();


// --- Definición de Categorías y Mapeo de Tags (Sin cambios) ---
const CATEGORIES = {
    // ... (Tu objeto CATEGORIES sin cambios) ...
};

// Función para obtener todos los comandos asociados a un conjunto de tags (Sin cambios)
function getCommandsByTags(plugins, tags, usedPrefix) {
    // ... (Tu función sin cambios) ...
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
    
    // ... (Tu código handler) ...
    
    // NOTA CLAVE: Dentro del handler, *debes* usar global.variable

    if (m.quoted?.id && m.quoted?.fromMe) return;

    const idChat = m.chat;
    
    // 2. Obtener Datos del Bot y Usuario
    let nombre;
    try {
        nombre = await conn.getName(m.sender);
    } catch {
        nombre = 'Usuario';
    }
    // ... (resto de variables sin cambios) ...
    const esPrincipal = conn.user.jid === global.conn.user.jid;
    const numeroPrincipal = global.conn?.user?.jid?.split('@')[0] || "Desconocido";
    const totalComandos = Object.keys(global.plugins || {}).length;
    const tiempoActividad = clockString(process.uptime() * 1000);
    const totalRegistros = Object.keys(global.db?.data?.users || {}).length;
    const horaCDMX = moment().tz("America/Mexico_City").format('h:mm A');

    // 👇 USAR GLOBAL.ENLACESMULTIMEDIA
    const videoGif = global.enlacesMultimedia.video[Math.floor(Math.random() * global.enlacesMultimedia.video.length)];
    const miniaturaRandom = global.enlacesMultimedia.imagen[Math.floor(Math.random() * global.enlacesMultimedia.imagen.length)];
    
    // 3. Encabezado del Menú (Usar variables globales)
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
// ... (resto del encabezado sin cambios) ...

    `.trim();

    // ... (El resto del handler, incluyendo la lógica del sub-menú, permanece igual) ...

    // 6. Generación de Secciones...
    
    // ... (Tu lógica de secciones y envío final sin cambios) ...
    
    // Si necesitas el código completo, por favor indícalo, pero la clave era la palabra 'global'
    // en la declaración y uso de las variables de datos estáticos.
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help'];

export default handler;

function clockString(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
