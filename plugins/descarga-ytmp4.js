import fetch from 'node-fetch';

// --- Constantes de Configuración ---
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';
const emoji = '🎵';

// --- Configuración de la Nueva API (XFARR) ---
// ⚠️ SEGURIDAD: Se recomienda usar process.env.XFARR_API_KEY
const XFARR_API_KEY = 'Maria-Kojuo'; 
const XFARR_API_URL = 'https://api.xfarr.com/api/ytmp3'; 

// --- El objeto global.APIs debe estar definido en tu entorno ---
// Ejemplo de cómo se verían (no tienes que incluirlos si ya están en global)
// global.APIs = { 
// zenzxz: { url: 'https://api.zenzxz.xyz', key: '...' }, 
// yupra: { url: 'https://api.yupra.xyz', key: '...' }, 
// vreden: { url: 'https://api.vreden.xyz', key: '...' }, 
// xyro: { url: 'https://api.xyro.xyz', key: '...' } 
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
            thumbnail: global.icono, 
            sourceUrl: global.redes, 
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
            const downloadURL = result.url;
            const apiUsed = result.api;

            // --- Extracción de Metadatos ---
            let title = `Audio de YouTube (Fuente: ${apiUsed})`;
            let filename = `Audio_Descargado_${apiUsed}.mp3`;
            let shortDescription = 'Enlace de descarga asegurado. (Metadatos genéricos)';
            let duration = 'Desconocida';
            let size = 'Desconocido';
            let uploaded = 'Desconocida';
            let views = '0';

            // Comprobar si la API exitosa fue XFARR (la que trae metadatos ricos)
            if (apiUsed === 'XFARR' && result.fullResponse?.result) {
                const xfarrResult = result.fullResponse.result;
                title = xfarrResult.title || title;
                filename = `${title}.mp4`;
                duration = xfarrResult.duration || duration;
                size = xfarrResult.size || size;
                uploaded = xfarrResult.uploaded || uploaded;
                views = xfarrResult.views?.toLocaleString() || views;

                const desc = xfarrResult.desc;
                shortDescription = desc 
                    ? desc.substring(0, 500) + (desc.length > 500 ? '...' : '')
                    : 'Sin descripción disponible.';
            }

            // Caption adaptado
            const caption = ` 
╭━━━━[ 𝚈𝚃𝙼𝙿𝟹 𝙳𝚎𝚌𝚘𝚍𝚎𝚍: 𝙵𝚕𝚞𝚓𝚘 𝙰𝚞𝚍𝚒𝚘 𝚂𝚎𝚐𝚞𝚛𝚘 ]━━━━⬣
📌 *Designación de Audio:* ${title}
👑 *API Usada:* ${apiUsed}
⏱️ *Duración del Flujo:* ${duration}
📂 *Tamaño del Archivo:* ${size}
📅 *Fecha de Registro:* ${uploaded}
👁️ *Registros de Observación:* ${views}
📄 *Manifiesto de Carga (Descripción):* ${shortDescription}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣`;

            // Enviar audio directamente desde la URL de descarga
            await conn.sendMessage(
                m.chat, {
                    audio: {
                        url: downloadURL
                    },
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
    
    const xfarrUrl = `${XFARR_API_URL}?url=${encodeURIComponent(url)}&apikey=${XFARR_API_KEY}`;
    
    // Cadena de APIs con XFARR al inicio
    const apis = [
        // 1. API Principal con metadatos ricos
        { 
            api: 'XFARR', 
            endpoint: xfarrUrl, 
            extractor: res => res.result?.download?.mp3, 
            timeout: 10000, 
            richMetadata: true
        },
        // 2. APIs de Respaldo (solo extraen el enlace de descarga)
        { api: 'ZenzzXD', endpoint: `${global.APIs.zenzxz.url}/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download_url, timeout: 8000, richMetadata: false },
        { api: 'ZenzzXD v2', endpoint: `${global.APIs.zenzxz.url}/downloader/ytmp3v2?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download_url, timeout: 8000, richMetadata: false },
        { api: 'Yupra', endpoint: `${global.APIs.yupra.url}/api/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.link, timeout: 8000, richMetadata: false },
        { api: 'Vreden', endpoint: `${global.APIs.vreden.url}/api/v1/download/youtube/audio?url=${encodeURIComponent(url)}&quality=128`, extractor: res => res.result?.download?.url, timeout: 8000, richMetadata: false },
        { api: 'Vreden v2', endpoint: `${global.APIs.vreden.url}/api/v1/download/play/audio?query=${encodeURIComponent(url)}`, extractor: res => res.result?.download?.url, timeout: 8000, richMetadata: false },
        { api: 'Xyro', endpoint: `${global.APIs.xyro.url}/download/youtubemp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download, timeout: 8000, richMetadata: false }
    ];
    
    return await fetchFromApisOptimized(apis);
}

// Función para ejecutar las llamadas a la API en paralelo y tomar la primera exitosa
async function fetchFromApisOptimized(apis) {
    const promises = apis.map(async (config) => {
        const { api, endpoint, extractor, timeout } = config;
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), timeout)
            const res = await fetch(endpoint, { signal: controller.signal }).then(r => r.json())
            clearTimeout(timeoutId)
            
            const link = extractor(res)
            
            if (link) {
                // Devolvemos el enlace, el nombre de la API, la respuesta completa y la configuración
                return { 
                    url: link, 
                    api: api, 
                    fullResponse: res, 
                    metadataConfig: config 
                };
            }
        } catch (e) {
            // El error se maneja de forma silenciosa para probar la siguiente API
            console.error(`[API FALLBACK FAILED] ${api}: ${e.message}`);
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

handler.help = ['ytmp4'].map(v => v + ' ');
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'ytaudio', 'mp4'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;