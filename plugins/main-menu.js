import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import axios from 'axios';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'; // Necesario para el List Message

// --- Configuración del Bot y Estilo ---
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';
const packname = '˚mᥲríᥲ k᥆ȷᥙ᥆-bot';

const GITHUB_REPO_OWNER = 'Emmax08';
const GITHUB_REPO_NAME = '-';
const GITHUB_BRANCH = 'main';

// --- Definición de Categorías y Mapeo de Tags ---
const CATEGORIES = {
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
    'Otros': { emoji: '📂', tags: ['otros', 'misc'] }, // Categoría placeholder para comandos sin tag definido
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
    // 1. Manejo de Enlaces Multimedia (db.json)
    let enlacesMultimedia;
    try {
        const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');
        const dbRaw = fs.readFileSync(dbPath);
        enlacesMultimedia = JSON.parse(dbRaw).links;
    } catch (e) {
        console.error("Error al leer src/database/db.json:", e);
        return conn.reply(m.chat, 'Error al leer la base de datos de medios.', m);
    }

    if (m.quoted?.id && m.quoted?.fromMe) return;

    // Cooldown eliminado completamente.

    const idChat = m.chat;
    const ahora = Date.now();
    
    // 3. Obtener Datos del Bot y Usuario
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

    const videoGif = enlacesMultimedia.video[Math.floor(Math.random() * enlacesMultimedia.video.length)];
    const miniaturaRandom = enlacesMultimedia.imagen[Math.floor(Math.random() * enlacesMultimedia.imagen.length)];
    const redes = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D';
    
    // 4. Lógica de Versión
    let localVersion = 'N/A', serverVersion = 'N/A', updateStatus = 'Desconocido';
    try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonRaw);
        localVersion = packageJson.version || 'N/A';
    } catch (error) { localVersion = 'Error'; }

    try {
        const githubPackageJsonUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/package.json`;
        const response = await axios.get(githubPackageJsonUrl);
        serverVersion = response.data.version || 'N/A';

        if (localVersion !== 'N/A' && serverVersion !== 'N/A') {
            updateStatus = (localVersion === serverVersion)
                ? '✅ En última versión'
                : `⚠️ Actualización disponible. Actualiza con *${usedPrefix}update*`;
        }
    } catch (error) {
        serverVersion = 'Error';
        updateStatus = '❌ No se pudo verificar la actualización';
    }

    // 5. Encabezado del Menú
    const encabezado = `
👑 |--- *mᥲríᥲ k᥆ȷᥙ᥆-Bot* | 🪽
| 👤 *Usuario:* ${nombre}
| 🌎 *Hora CDMX:* ${horaCDMX}
|-------------------------------------------|
| 🚀 *VERSION DEL BOT*
| ➡️ *Local:* ${localVersion}
| ➡️ *Servidor:* ${serverVersion}
| 📊 *Estado:* ${updateStatus}
|-------------------------------------------|
| 🤖 *Bot:* ${esPrincipal ? 'Principal' : `Sub-Bot | Principal: wa.me/${numeroPrincipal}`}
| 📦 *Comandos:* ${totalComandos}
| ⏱️ *Tiempo Activo:* ${tiempoActividad}
| 👥 *Usuarios Reg:* ${totalRegistros}
| 👑 *Dueño:* se quito por spam
|-------------------------------------------|
`.trim();

    // 6. Lógica para manejar la subcategoría
    const selectedCategory = args[0]?.toLowerCase();
    
    // 6a. Si se seleccionó una subcategoría (ej: .menu Ajustes)
    if (selectedCategory && selectedCategory !== 'menu') {
        let categoryData;
        
        // Buscar por nombre de categoría o por cualquiera de sus tags
        for (const [name, data] of Object.entries(CATEGORIES)) {
            const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (normalizedName === selectedCategory || data.tags.includes(selectedCategory)) {
                categoryData = [name, data];
                break;
            }
        }
        
        // Manejar la categoría "Otros" por defecto si se solicita
        if (!categoryData && selectedCategory === 'otros') {
            const tagsCategorizadas = new Set(Object.values(CATEGORIES).flatMap(c => c.tags));
            const todosLosTags = Object.keys(global.plugins || {})
                .flatMap(key => global.plugins[key].tags || [])
                .filter(tag => !tagsCategorizadas.has(tag) && tag.length > 0);
            
            categoryData = ['Otros Comandos', { emoji: '📂', tags: todosLosTags }];
        }

        if (categoryData) {
            const [name, data] = categoryData;
            const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix);
            
            const textoCategoria = comandos.length > 0
                ? comandos.map(cmd => `> ${cmd}`).join('\n')
                : 'No hay comandos disponibles en esta categoría por ahora.';
            
            const mensajeFinal = `*${data.emoji} ${name.toUpperCase()}*\n\n${textoCategoria}\n\n*${packname}*`;

            await conn.reply(idChat, mensajeFinal, m, { 
                contextInfo: {
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
                        body: name,
                        thumbnailUrl: miniaturaRandom,
                        sourceUrl: redes,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            // Cooldown no aplicado
            return;
        }
    }

    // 6b. Mostrar el Menú Principal (List Message)

    let secciones = [];
    const tagsCategorizadas = new Set(Object.values(CATEGORIES).flatMap(c => c.tags));
    let comandosOtrosLength = 0;

    // Iterar sobre las categorías predefinidas para crear las secciones de la lista
    for (const [name, data] of Object.entries(CATEGORIES)) {
        // Excluir la categoría 'Otros' por ahora, se maneja al final
        if (name === 'Otros') continue; 
        
        const categoriaNombre = `${data.emoji} ${name.toUpperCase()}`;
        const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix);

        if (comandos.length > 0) {
            // Usamos el primer tag como identificador para el submenú
            const rowIdTag = data.tags.length > 0 ? data.tags[0] : name.toLowerCase().replace(/[^a-z0-9]/g, '');
            secciones.push({
                title: categoriaNombre,
                rows: [
                    {
                        title: `Abrir ${name}`,
                        description: `Ver los ${comandos.length} comandos de ${name}`,
                        rowId: `${usedPrefix}menu ${rowIdTag}`
                    }
                ]
            });
        }
    }

    // Encontrar y añadir la categoría 'Otros' dinámicamente
    const todosLosTagsNoCategorizados = Object.keys(global.plugins || {})
        .flatMap(key => global.plugins[key].tags || [])
        .filter(tag => !tagsCategorizadas.has(tag) && tag.length > 0);

    const comandosOtros = getCommandsByTags(global.plugins, todosLosTagsNoCategorizados, usedPrefix);
    comandosOtrosLength = comandosOtros.length;
    
    if (comandosOtrosLength > 0) {
        secciones.push({
            title: '📂 OTROS COMANDOS',
            rows: [{
                title: `Abrir Otros Comandos`,
                description: `Ver los ${comandosOtrosLength} comandos no clasificados`,
                rowId: `${usedPrefix}menu otros`
            }]
        });
    }
    
    if (secciones.length === 0) {
        return conn.reply(idChat, `${encabezado}\n\n❌ No se encontraron comandos clasificados.`, m);
    }

    // 7. Preparar List Message
    const listMessage = {
        text: encabezado,
        footer: `Selecciona una categoría de la lista para ver los comandos.\n\n*${packname}*`,
        title: "✅ MENÚ INTERACTIVO 👑",
        buttonText: "VER CATEGORÍAS",
        sections: secciones,
        listType: 1
    };
    
    // 8. Enviar List Message con Video/GIF y Newsletter Context
    
    const interactiveMsg = generateWAMessageFromContent(idChat, {
        viewOnceMessage: {
            message: {
                listMessage: listMessage
            }
        }
    }, { userJid: idChat, quoted: m });
    
    // 9. Enviar el mensaje
    try {
        await conn.relayMessage(idChat, interactiveMsg.message, { messageId: interactiveMsg.key.id });
    } catch (e) {
        console.error("Error al enviar el menú interactivo:", e);
        // Fallback a menú de texto simple si falla el interactivo
        const fallbackText = `${encabezado}\n\n*MENÚ POR CATEGORÍAS (Texto)*\n\n${secciones.map(sec => 
            `> ${sec.title}: ${sec.rows[0].rowId}`
        ).join('\n')}\n\n*${packname}*`;
        
        await conn.reply(idChat, fallbackText, m, { 
            contextInfo: {
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
            }
        });
    }

    // Cooldown no aplicado
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
