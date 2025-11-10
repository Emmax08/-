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

// 1. Inicialización de variables globales
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

// 2. Cargar DB Multimedia
try {
    const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');
    const dbRaw = fs.readFileSync(dbPath);
    global.enlacesMultimedia = JSON.parse(dbRaw).links;
} catch (e) {
    console.error("❌ Error al leer o parsear src/database/db.json:", e);
}

// 3. Cargar Versión Local
try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf8');
    global.localVersion = JSON.parse(packageJsonRaw).version || 'N/A';
} catch (error) { 
    console.error("❌ Error al cargar package.json local:", error);
    global.localVersion = 'Error';
}

// 4. Función asíncrona para verificar la versión del servidor
async function checkServerVersion() {
    try {
        const githubPackageJsonUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/package.json`;
        const response = await axios.get(githubPackageJsonUrl);
        global.serverVersion = response.data.version || 'N/A';

        if (global.localVersion !== 'N/A' && global.serverVersion !== 'N/A') {
            global.updateStatus = (global.localVersion === global.serverVersion)
                ? '✅ En última versión'
                : '⚠️ Actualización disponible. Actualiza con `\${usedPrefix}update`';
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
