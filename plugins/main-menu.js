import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import axios from 'axios';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'; // Necesario para el List Message

const cooldowns = new Map();
const ultimoMenuEnviado = new Map();

// --- Configuración del Bot y Estilo ---
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';
const packname = '˚mᥲríᥲ k᥆ȷᥙ᥆-bot';

const GITHUB_REPO_OWNER = 'Emmax08';
const GITHUB_REPO_NAME = '-';
const GITHUB_BRANCH = 'main';

// --- Definición de Categorías y Mapeo de Tags ---
const CATEGORIES = {
    'Ajustes & Config': { emoji: '⚙️', tags: ['nable', 'owner', 'mods', 'setting'] }, // Incluye 'owner' y 'mods'
    'Herramientas & Stickers': { emoji: '🛠️', tags: ['tools', 'transformador', 'herramientas', 'sticker', 'sticker'] },
    'Grupos & Admin': { emoji: '👥', tags: ['grupo', 'group', 'admin'] },
    'Inteligencia Artificial (AI)': { emoji: '🧠', tags: ['ai', 'image', 'ia', 'openai'] },
    'Diversión & Juegos': { emoji: '🕹️', tags: ['games', 'game', 'fun'] },
    'Anime & Emociones': { emoji: '✨', tags: ['anime', 'emox', 'waifus', 'gacha'] }, // Se consolidó 'gacha' aquí
    'Información': { emoji: 'ℹ️', tags: ['info'] },
    'Principal': { emoji: '🏠', tags: ['main'] },
    'Economía & RPG': { emoji: '💰', tags: ['rpg', 'economia', 'economy'] },
    'Descargas & Buscadores': { emoji: '⬇️', tags: ['descargas', 'buscador', 'dl', 'internet', 'search'] }, // Se incluyó 'internet' y 'search'
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
                    // Excluir comandos internos/privados
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

    // 2. Cooldown
    const idChat = m.chat;
    const ahora = Date.now();
    const tiempoEspera = 5 * 60 * 1000;
    const ultimoUso = cooldowns.get(idChat) || 0;

    if (ahora - ultimoUso < tiempoEspera) {
        const tiempoRestanteMs = tiempoEspera - (ahora - ultimoUso);
        const minutos = Math.floor(tiempoRestanteMs / 60000);
        const segundos = Math.floor((tiempoRestanteMs % 60000) / 1000);
        const ultimo = ultimoMenuEnviado.get(idChat);
        return await conn.reply(
            idChat,
            `@${m.sender.split('@')[0]} cálmate amigo! 👑 Debes esperar para volver a usar el menú.\nTiempo restante: *${minutos}m ${segundos}s*`,
            ultimo?.message || m,
            { mentions: [m.sender] }
        );
    }
    
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
| 👑 *Dueño:* se quito por el spam xd
|-------------------------------------------|
`.trim();

    // 6. Lógica para manejar la subcategoría
    const selectedCategory = args[0]?.toLowerCase();
    
    // 6a. Si se seleccionó una subcategoría (ej: .menu Ajustes)
    if (selectedCategory && selectedCategory !== 'menu') {
        const categoryData = Object.entries(CATEGORIES).find(([name, data]) => 
            name.toLowerCase().replace(/[^a-z0-9]/g, '') === selectedCategory.toLowerCase() || 
            data.tags.includes(selectedCategory.toLowerCase())
        );

        if (categoryData) {
            const [name, data] = categoryData;
            const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix);
            
            const textoCategoria = comandos.length > 0
                ? comandos.map(cmd => `> ${cmd}`).join('\n')
                : 'No hay comandos disponibles en esta categoría por ahora.';
            
            const mensajeFinal = `*${data.emoji} ${name.toUpperCase()}*\n\n${textoCategoria}\n\n*${packname}*`;

            const msgEnviado = await conn.reply(idChat, mensajeFinal, m, { 
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
            cooldowns.set(idChat, ahora);
            ultimoMenuEnviado.set(idChat, { timestamp: ahora, message: msgEnviado });
            return;
        }
    }

    // 6b. Si no se seleccionó una subcategoría o la selección fue inválida, mostrar el Menú Principal (List Message)

    let secciones = [];
    const categoriaOtros = { title: 'OTROS COMANDOS', rows: [] };
    const tagsCategorizadas = new Set(Object.values(CATEGORIES).flatMap(c => c.tags));

    // Iterar sobre las categorías predefinidas para crear las secciones de la lista
    for (const [name, data] of Object.entries(CATEGORIES)) {
        const categoriaNombre = `${data.emoji} ${name.toUpperCase()}`;
        const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix);

        if (comandos.length > 0) {
            secciones.push({
                title: categoriaNombre,
                rows: [
                    {
                        title: `Abrir ${name}`,
                        description: `Ver los ${comandos.length} comandos de ${name}`,
                        // Usamos un comando oculto para que el bot pueda procesar la respuesta
                        rowId: `${usedPrefix}menu ${data.tags[0]}`
                    }
                ]
            });
        }
    }

    // Encontrar comandos en la categoría 'Otros'
    const todosLosTags = Object.keys(global.plugins || {})
        .flatMap(key => global.plugins[key].tags || [])
        .filter(tag => !tagsCategorizadas.has(tag) && tag.length > 0);

    const comandosOtros = getCommandsByTags(global.plugins, todosLosTags, usedPrefix);
    
    if (comandosOtros.length > 0) {
        categoriaOtros.rows.push({
            title: `Abrir Otros Comandos`,
            description: `Ver los ${comandosOtros.length} comandos no clasificados`,
            rowId: `${usedPrefix}menu otros`
        });
        secciones.push(categoriaOtros);
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
    
    // Usamos el GIF/Video como cuerpo del mensaje principal
    const content = {
        video: { url: videoGif },
        gifPlayback: true,
        caption: encabezado, // El encabezado en el caption
        footer: `Selecciona una categoría para ver los comandos\n\n*${packname}*`,
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
        },
        buttons: [
            {buttonId: `${usedPrefix}menu Ajustes`, buttonText: {displayText: `⚙️ Ajustes & Config`}, type: 1},
            {buttonId: `${usedPrefix}menu Herramientas`, buttonText: {displayText: `🛠️ Herramientas & Stickers`}, type: 1},
            {buttonId: `${usedPrefix}menu Grupos`, buttonText: {displayText: `👥 Grupos & Admin`}, type: 1},
        ]
    };

    // Si quieres usar List Message, debes enviarlo con un wrapper.
    const interactiveMsg = generateWAMessageFromContent(idChat, {
        viewOnceMessage: {
            message: {
                listMessage: listMessage // Opción 1: List Message (más categorías)
                // Usar botones de respuesta rápida si prefieres un diseño más simple (máx. 3 botones)
                /*
                templateMessage: {
                    hydratedFourRowTemplate: {
                        ...content,
                        templateButtons: [
                            { index: 1, urlButton: { displayText: 'Canal Oficial', url: redes } },
                            { index: 2, callButton: { displayText: 'Llamar al Dueño', phoneNumber: '+17225305296' } },
                            { index: 3, quickReplyButton: { displayText: '🤖 Info del Bot', id: `${usedPrefix}infobot` } },
                        ]
                    }
                }
                */
            }
        }
    }, { userJid: idChat, quoted: m });
    
    // 9. Enviar el mensaje
    let msgEnviado;
    try {
        msgEnviado = await conn.relayMessage(idChat, interactiveMsg.message, { messageId: interactiveMsg.key.id });
    } catch (e) {
        console.error("Error al enviar el menú interactivo:", e);
        // Fallback a menú de texto simple si falla el interactivo
        const fallbackText = `${encabezado}\n\n*MENÚ POR CATEGORÍAS (Texto)*\n\n${Object.entries(CATEGORIES).map(([name, data]) => 
            `> ${data.emoji} *${name}*: ${usedPrefix}menu ${data.tags[0]}`
        ).join('\n')}\n\n*${packname}*`;
        msgEnviado = await conn.reply(idChat, fallbackText, m, { contextInfo: content.contextInfo });
    }

    // 10. Aplicar Cooldown
    cooldowns.set(idChat, ahora);
    ultimoMenuEnviado.set(idChat, {
        timestamp: ahora,
        message: interactiveMsg // Guarda la referencia del mensaje interactivo para el cooldown
    });
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
