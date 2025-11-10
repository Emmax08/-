import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import axios from 'axios';
import { getDevice } from '@whiskeysockets/baileys'; 
import { promises } from 'fs';
import { join } from 'path';

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

// 🌐 VARIABLE GLOBAL DE REDES 🌐
const redes = 'https://whatsapp.com/channel/0029Vb60E6xLo4hbOoM0NG3D'; 

// --- Definición de Categorías y Mapeo de Tags (USADO PARA GENERAR LA LISTA) ---
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
let handler = async (m, { conn, usedPrefix, args, __dirname }) => {
    // 1. Manejo de Enlaces Multimedia (db.json)
    let enlacesMultimedia;
    try {
        const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json'); 
        const dbRaw = fs.readFileSync(dbPath);
        enlacesMultimedia = JSON.parse(dbRaw).links;
    } catch (e) {
        console.error("Error al leer o parsear src/database/db.json:", e);
        enlacesMultimedia = { video: ['https://example.com/error.mp4'], imagen: ['https://example.com/error.jpg'] };
    }

    if (m.quoted?.id && m.quoted?.fromMe) return;

    const idChat = m.chat;
    
    // 2. Obtener Datos del Bot y Usuario
    let _package;
    try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf8');
        _package = JSON.parse(packageJsonRaw);
    } catch (error) {
        _package = {};
    }

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
    
    // Lógica de hora y fecha (Lima/Perú)
    const lugarFecha = moment().tz('America/Lima'); 
    const formatoFecha = {
        weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    };
    lugarFecha.locale('es', formatoFecha);
    const horarioFecha = lugarFecha.format('dddd, DD [de] MMMM [del] YYYY || HH:mm A').replace(/^\w/, (c) => c.toUpperCase());
    
    const videoGif = enlacesMultimedia.video[Math.floor(Math.random() * enlacesMultimedia.video.length)];
    const miniaturaRandom = enlacesMultimedia.imagen[Math.floor(Math.random() * enlacesMultimedia.imagen.length)];
    
    const totalChatsBanned = Object.entries(global.db?.data?.chats || {}).filter((chat) => chat[1].isBanned).length;
    const totalUsersBanned = Object.entries(global.db?.data?.users || {}).filter((user) => user[1].banned).length;
    const rtotalreg = Object.values(global.db?.data?.users || {}).filter((u) => u.registered == true).length;


    // 3. Lógica de Versión
    let localVersion = 'N/A', serverVersion = 'N/A', updateStatus = 'Desconocido';
    try {
        localVersion = _package.version || 'N/A';
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

    // 4. Encabezado del Menú (Datos de Gata integrados)
    const encabezado = `
*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*
*│ 👑 | 𝐌𝐀𝐑𝐈𝐀 𝐊𝐎𝐉𝐔𝐎 𝐁𝐎𝐓 | 🪽*
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*
⎔ \`\`\`${horarioFecha}\`\`\`
*├┈───────┈─┈──┈─┈──┈─┈*
*│ 🚀 V E R S I Ó N Y E S T A D O*
*│* ➡️ *Local:* ${localVersion}
*│* ➡️ *Servidor:* ${serverVersion}
*│* 📊 *Estado:* ${updateStatus}
*├┈───────┈─┈──┈─┈──┈─┈*
*│ 📊 I N F O R M A C I Ó N*
*│* 📦 *Comandos:* ${totalComandos}
*│* ⏱️ *Actividad:* ${tiempoActividad}
*│* 👥 *Regis. Usuarios:* ${rtotalreg}/${totalRegistros}
*│* 🚫 *Chats Bloqueados:* ${totalChatsBanned}
*│* 🚫 *Usuarios Bloqueados:* ${totalUsersBanned}
*│* 👑 *Dueño:* Emmax
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*
`.trim();

    // 5. ContextInfo para Reutilizar
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

    // 6. Lógica para manejar la subcategoría (submenú de texto si se pasa un argumento)
    const selectedCategory = args[0]?.toLowerCase();
    
    // Bloque de Submenú (6a) - Se mantiene la funcionalidad para generar el submenú de texto
    if (selectedCategory && selectedCategory !== 'menu') {
        let categoryData;
        
        for (const [name, data] of Object.entries(CATEGORIES)) {
            const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (normalizedName === selectedCategory || data.tags.includes(selectedCategory)) {
                categoryData = [name, data];
                break;
            }
        }
        
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
            
            const textoComandos = comandos.length > 0
                ? comandos.map(cmd => `> ${cmd}`).join('\n')
                : 'No hay comandos disponibles en esta categoría por ahora.';
            
            const textoFinal = `
*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*
*│* ${data.emoji} *C A T E G O R Í A: ${name.toUpperCase()}*
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*
*│*
${textoComandos}
*│*
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*
*${packname}*
            `.trim();

            try {
                await conn.sendMessage(idChat, {
                    video: { url: videoGif },
                    gifPlayback: true,
                    caption: `*${data.emoji} Abriste la categoría ${name.toUpperCase()}*`,
                    contextInfo: { ...contextInfo, mentionedJid: [m.sender] }
                }, { quoted: m });
                
                await conn.reply(idChat, textoFinal, m, { contextInfo });

            } catch (e) {
                console.error("Error al enviar el submenú con video:", e);
                await conn.reply(idChat, textoFinal, m, { contextInfo });
            }
            return;
        }
    }


    // 6b. Mostrar el Menú Principal (List Message) - GENERADO POR CATEGORIES (TU LISTA)

    const infoBot = `
*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*
*│ 🤖 E S T A D O S D E L B O T*
*├┈───────┈─┈──┈─┈──┈─┈*
*│* 👑 *Bot:* ${esPrincipal ? 'Principal' : 'Sub-Bot'}
*│* 🔗 *Principal:* wa.me/${numeroPrincipal}
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*

*Selecciona una categoría de la lista para ver los comandos:*
    `.trim();

    let secciones = [];
    const tagsCategorizadas = new Set(Object.values(CATEGORIES).flatMap(c => c.tags));
    
    // Crear secciones para el List Message usando el objeto CATEGORIES
    for (const [name, data] of Object.entries(CATEGORIES)) {
        if (name === 'Otros') continue; // Se añade "Otros" al final
        
        const categoriaNombre = `${data.emoji} ${name.toUpperCase()}`;
        const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix);

        if (comandos.length > 0) {
            // Usamos el primer tag como rowId para disparar el submenú de texto (Sección 6a)
            const rowIdTag = data.tags.length > 0 ? data.tags[0] : name.toLowerCase().replace(/[^a-z0-9]/g, '');
            secciones.push({
                title: categoriaNombre,
                rows: [
                    {
                        title: `Abrir ${name}`,
                        description: `Comandos: ${comandos.length}`,
                        rowId: `${usedPrefix}menu ${rowIdTag}`
                    }
                ]
            });
        }
    }

    // Añadir la categoría 'Otros' dinámicamente
    const todosLosTagsNoCategorizados = Object.keys(global.plugins || {})
        .flatMap(key => global.plugins[key].tags || [])
        .filter(tag => !tagsCategorizadas.has(tag) && tag.length > 0);

    const comandosOtrosLength = getCommandsByTags(global.plugins, todosLosTagsNoCategorizados, usedPrefix).length;
    
    if (comandosOtrosLength > 0) {
        secciones.push({
            title: '📂 OTROS COMANDOS',
            rows: [{
                title: `Abrir Otros Comandos`,
                description: `Comandos: ${comandosOtrosLength}`,
                rowId: `${usedPrefix}menu otros`
            }]
        });
    }
    
    if (secciones.length === 0) {
        return conn.reply(idChat, `${encabezado}\n\n❌ No se encontraron comandos clasificados.`, m);
    }

    // 8. Preparar List Message
    const listMessage = {
        text: encabezado + '\n' + infoBot,
        footer: `*${packname}*`,
        title: "✅ MENÚ INTERACTIVO 👑",
        buttonText: "VER CATEGORÍAS",
        sections: secciones,
        listType: 1,
        contextInfo: { ...contextInfo, mentionedJid: [m.sender] } 
    };
    
    // 9. Enviar el mensaje (GIF primero, luego ListMessage)
    try {
        await conn.sendMessage(idChat, {
            video: { url: videoGif },
            gifPlayback: true,
            caption: '¡Hola! Soy María Kojuo. 👋\n\nPresiona *VER CATEGORÍAS* para navegar por mis funciones.',
            contextInfo: { ...contextInfo, mentionedJid: [m.sender] }
        }, { quoted: m });
        
        await conn.sendMessage(idChat, listMessage, { quoted: m });

    } catch (e) {
        console.error("Error al enviar el GIF o el ListMessage:", e);
        
        // Fallback a menú de texto simple si falla
        const fallbackText = `${encabezado}\n${infoBot}\n\n*MENÚ POR CATEGORÍAS (Texto)*\n\n${secciones.flatMap(sec => sec.rows).map(row => 
            `> ${row.title}: ${row.rowId}`
        ).join('\n')}\n\n*${packname}*`;
        
        await conn.reply(idChat, fallbackText, m, { contextInfo });
    }
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
