// ... (Código anterior sin cambios en imports y configuración) ...

// Función para obtener todos los comandos asociados a un conjunto de tags
function getCommandsByTags(plugins, tags, usedPrefix) {
    let commands = [];
    // ... (Misma implementación) ...
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
    // 1. Carga de datos estáticos y verificación de versión (ASUMIMOS QUE ESTÁ FUERA DEL HANDLER AHORA)
    // Usamos las variables globales: enlacesMultimedia, localVersion, serverVersion, updateStatus, redes, etc.
    
    // ... (Lógica de carga de datos omitida por brevedad, asumiendo que funciona) ...
    if (enlacesMultimedia.video.length === 0 || enlacesMultimedia.imagen.length === 0) {
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

    const videoGif = enlacesMultimedia.video[Math.floor(Math.random() * enlacesMultimedia.video.length)];
    const miniaturaRandom = enlacesMultimedia.imagen[Math.floor(Math.random() * enlacesMultimedia.imagen.length)];
    
    // 3. Encabezado del Menú (La estructura de texto)
    // Usamos el estado de versión y la información del bot dentro del texto principal
    const encabezado = `
*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*
*│ 👑 | 𝐌𝐀𝐑𝐈𝐀 𝐊𝐎𝐉𝐔𝐎 𝐁𝐎𝐓 | 🪽*
*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*
*│* 👤 *Usuario:* ${nombre}
*│* 🌎 *Hora CDMX:* ${horaCDMX}
*├┈───────┈─┈──┈─┈──┈─┈*
*│ 🚀 V E R S I Ó N*
*│* ➡️ *Local:* ${localVersion}
*│* ➡️ *Servidor:* ${serverVersion}
*│* 📊 *Estado:* ${updateStatus.replace(usedPrefix, `\`${usedPrefix}`)}*
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

    // 4. ContextInfo para Reutilizar (Media + Buttons)
    const contextInfo = {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 999,
        // Mantener info de Newsletter si es relevante
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
            mediaType: 1, // 1 para imagen, 2 para video/gif
            renderLargerThumbnail: false
        }
    };
    
    // 5. Lógica para Sub-menú (No necesita cambios, ya funciona)
    // ... (Sub-menú original con GIF y List Message) ...
    // ... (Se omite por brevedad, asumiendo que el código de sub-menú es funcional) ...
    const selectedCategory = args[0]?.toLowerCase();
    
    if (selectedCategory && selectedCategory !== 'menu') {
        // ... (Tu lógica original para sub-menú) ...
        // Este bloque ya funciona con GIF y el contenido del sub-menú.
        // Lo mantendremos sin cambios.
        
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
                    caption: textoFinal,
                    contextInfo
                }, { quoted: m });
            } catch (e) {
                console.error("Error al enviar el menú con video:", e);
                await conn.reply(idChat, textoFinal, m, { contextInfo });
            }
            return;
        }
    }
    
    // 6. Generación de Secciones (No necesita cambios)
    let secciones = [];
    const tagsCategorizadas = new Set(Object.values(CATEGORIES).flatMap(c => c.tags));
    
    for (const [name, data] of Object.entries(CATEGORIES)) {
        if (name === 'Otros') continue; 
        
        const categoriaNombre = `${data.emoji} ${name.toUpperCase()}`;
        const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix);

        if (comandos.length > 0) {
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

    // 7. Preparar List Message (El mensaje interactivo con botón)
    
    const messageContent = {
        listMessage: {
            text: encabezado, // Contiene toda la información del bot
            footer: `*${packname}*\n\n_Selecciona una categoría para ver los comandos._`,
            title: "✅ MENÚ INTERACTIVO 👑",
            buttonText: "VER CATEGORÍAS", // Este es el botón que el usuario presiona
            sections: secciones,
            listType: 1
        }
    };
    
    // 8. Enviar el List Message combinado con el GIF como encabezado (MEJORA CLAVE)
    
    try {
        await conn.sendMessage(idChat, {
            video: { url: videoGif },
            gifPlayback: true,
            caption: '¡Hola! Soy María Koju. 👋\n\nPresiona el botón *VER CATEGORÍAS* para navegar.',
            ...messageContent, // Combina el ListMessage en el mismo objeto
            contextInfo: { ...contextInfo, mentionedJid: [m.sender], isForwarded: undefined, forwardingScore: undefined } // Ajuste de ContextInfo para combinar con video
        }, { quoted: m });

    } catch (e) {
        console.error("Error al enviar el menú interactivo combinado:", e);
        // Fallback a menú de texto simple si falla
        const fallbackText = `${encabezado}\n\n*MENÚ POR CATEGORÍAS (Texto)*\n\n${secciones.map(sec => 
            `> ${sec.title}: ${sec.rows[0].rowId}`
        ).join('\n')}\n\n*${packname}*`;
        
        await conn.reply(idChat, fallbackText, m, { contextInfo });
    }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help'];

export default handler;

// ... (clockString function) ...

function clockString(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
