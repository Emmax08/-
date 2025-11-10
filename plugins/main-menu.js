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

// 1. Inicialización de variables globales (Si no existen, las crea)
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
} catch (
