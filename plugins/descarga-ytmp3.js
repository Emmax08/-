import fetch from 'node-fetch';

// --- Constantes de Configuración ---
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';
const emoji = '🎵';

// --- El objeto global.APIs debe estar definido en tu entorno ---
// Ejemplo de cómo se verían (no tienes que incluirlos si ya están en global)
// global.APIs = {
//   zenzxz: { url: 'https://api.zenzxz.xyz', key: '...' },
//   yupra: { url: 'https://api.yupra.xyz', key: '...' },
//   vreden: { url: 'https://api.vreden.xyz', key: '...' },
//   xyro: { url: 'https://api.xyro.xyz', key: '...' }
// };

var handler = async (m, { conn, args, usedPrefix, command }) => {
    const name = conn.getName(m.sender);
    
    // Configuración para la vista previa del mensaje en WhatsApp.
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
            title: 'mᥲríᥲ k᥆ȷᥙ᥆: Pista localizada. 👑',
            body: `Procesando solicitud para el/la Proxy ${name}...`,
            thumbnail: global.icono, // Asegúrate de que 'global.icono' esté definido
            sourceUrl: global.redes, // Asegúrate de que 'global.redes' esté definido
            mediaType: 1,
            renderLargerThumbnail: false
        }
    };

    if (!args[0]) {
        return conn.reply(
            m.chat,
            `${emoji} *Rastro frío, Proxy ${name}.* Necesito un identificador de audio para proceder. Dame el enlace.\n\n_Ejemplo: ${usedPrefix + command} https://youtu.be/KHgllosZ3kA`,
            m, {
                contextInfo,
                quoted: m
            }
        );
    }

    const youtubeUrl = args[0];

    try {
        // Validación de URL
        if (!youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/)) {
            return conn.reply(
                m.chat,
                `❌ *¡Rayos! Ese no parece un enlace de YouTube válido, Proxy ${name}.*\nPor favor, proporciona un enlace correcto.`,
                m, {
                    contextInfo,
                    quoted: m
                }
            );
        }

        await conn.reply(
            m.chat,
            `🔄 *Decodificando la señal de audio, Proxy ${name}.* Aguarda. El flujo de datos está siendo asegurado con múltiples servidores.`,
            m, {
                contextInfo,
                quoted: m
            }
        );
        
        // --- Uso de la cadena de APIs de respaldo ---
        const result = await getAud(youtubeUrl);
        
        if (result && result.url) {
            // El resultado de la API que funcionó (result.api) se usa aquí.
            const downloadURL = result.url;
            
            // *NOTA*: Como no tenemos los metadatos completos (título, duración) 
            // del comando original, usaremos un título genérico. 
            // Idealmente, la función getAud debería devolver más info.
            const filename = `Audio_Descargado_${result.api}.mp3`;
            const title = `Audio de YouTube (Fuente: ${result.api})`;
            
            // Caption adaptado para mostrar qué API funcionó
            const caption = ` 
╭━━━━[ 𝚈𝚃𝙼𝙿𝟹 𝙳𝚎𝚌𝚘𝚍𝚎𝚍: 𝙵𝚕𝚞𝚓𝚘 𝙰𝚞𝚍𝚒𝚘 𝚂𝚎𝚐𝚞𝚛𝚘 ]━━━━⬣ 
📌 *Designación de Audio:* ${title}
👑 *API Usada:* ${result.api}
📄 *Manifiesto de Carga:* Enlace de descarga asegurado.
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣`;

            // Enviar audio directamente desde la URL de descarga
            await conn.sendMessage(
                m.chat, {
                    audio: { url: downloadURL }, 
                    mimetype: 'audio/mpeg',
                    fileName: filename,
                    ptt: false,
                    caption
                }, {
                    contextInfo,
                    quoted: m
                }
            );
            await m.react("🎧"); // Reacción de éxito

        } else {
            throw new Error(`Ninguna de las APIs de respaldo pudo asegurar la carga de audio.`);
        }
    } catch (e) {
        console.error(e);
        await m.react("❌"); // Reacción de error
        await conn.reply(
            m.chat,
            `⚠️ *Anomalía detectada, Proxy ${name}.*\nNo pude asegurar la carga de audio. Repórtalo si persiste.\nDetalles: ${e.message}`,
            m, {
                contextInfo,
                quoted: m
            }
        );
    }
};

// --- Funciones extraídas y adaptadas del código de respaldo ---

// Función para probar múltiples APIs de audio
async function getAud(url) {
    // Asegúrate de que global.APIs exista y tenga las claves correctas
    if (!global.APIs) {
        throw new Error("El objeto global.APIs no está definido en el entorno.");
    }

    const apis = [
        { api: 'ZenzzXD', endpoint: `${global.APIs.zenzxz.url}/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download_url, timeout: 8000 },
        { api: 'ZenzzXD v2', endpoint: `${global.APIs.zenzxz.url}/downloader/ytmp3v2?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download_url, timeout: 8000 },
        { api: 'Yupra', endpoint: `${global.APIs.yupra.url}/api/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.link, timeout: 8000 },
        { api: 'Vreden', endpoint: `${global.APIs.vreden.url}/api/v1/download/youtube/audio?url=${encodeURIComponent(url)}&quality=128`, extractor: res => res.result?.download?.url, timeout: 8000 },
        { api: 'Vreden v2', endpoint: `${global.APIs.vreden.url}/api/v1/download/play/audio?query=${encodeURIComponent(url)}`, extractor: res => res.result?.download?.url, timeout: 8000 },
        { api: 'Xyro', endpoint: `${global.APIs.xyro.url}/download/youtubemp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download, timeout: 8000 }
    ];
    
    return await fetchFromApisOptimized(apis);
}

// Función para ejecutar las llamadas a la API en paralelo y tomar la primera exitosa
async function fetchFromApisOptimized(apis) {
    const promises = apis.map(async ({ api, endpoint, extractor, timeout }) => {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), timeout)
            
            const res = await fetch(endpoint, { signal: controller.signal }).then(r => r.json())
            
            clearTimeout(timeoutId)
            const link = extractor(res)
            
            if (link) {
                // Devolvemos el enlace y el nombre de la API que funcionó
                return { url: link, api: api }; 
            }
        } catch (e) {
            // El error se maneja de forma silenciosa para probar la siguiente API
            return null; 
        }
        return null; // Aseguramos que la promesa resuelva a null si no hay link
    });

    const results = await Promise.allSettled(promises);
    
    // Iteramos sobre los resultados y devolvemos el primero exitoso
    for (const result of results) {
        if (result.status === 'fulfilled' && result.value && result.value.url) {
            return result.value;
        }
    }
    
    // Si ninguna API funcionó
    return null; 
}


handler.help = ['ytmp3'].map(v => v + ' ');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'mp3'];
handler.register = true;
handler.limit = true;
handler.coin = 2;
// Se puede dejar handler.prefix si tu framework lo requiere, pero se omite aquí por defecto
// handler.prefix = /^[./#]/;

export default handler;