import axios from 'axios';
import fetch from 'node-fetch';

// --- Constantes y Configuración ---
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';

// --- Handler Principal (Sin cambios) ---
let handler = async (m, { conn, text, usedPrefix, command }) => {
    const name = conn.getName(m.sender);

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
            title: 'mᥲríᥲ k᥆ȷᥙ᥆: Frecuencia localizada. 📻',
            body: `Procesando solicitud para el/la Proxy ${name}...`,
            thumbnail: icons,
            sourceUrl: redes,
            mediaType: 1,
            renderLargerThumbnail: false
        }
    };

    if (!text) {
        return conn.reply(m.chat, `📻 *Estática en la línea, Proxy ${name}.* Necesito el nombre de una canción o artista de YouTube Music.`, m, { contextInfo, quoted: m });
    }

    try {
        m.react('🔄');
        conn.reply(m.chat, `🔄 *Iniciando protocolo de extracción de YT Music, Proxy ${name}.* Aguarda, la decodificación de audio está en curso.`, m, { contextInfo, quoted: m });

        const songData = await searchAndDownloadYTM(text);

        if (!songData) {
            await m.react('❌');
            throw `❌ *Fallo en la extracción, Proxy ${name}.*\nNo se encontró ninguna pista que coincida con "${text}" en YouTube Music.`;
        }

        const info = `
╭━━━━[ YT Music 𝙳𝚎𝚌𝚘𝚍𝚎𝚍: 𝙿𝚒𝚜𝚝𝚊 𝙰segurada ]━━━━⬣
🎵 *Designación de Pista:* ${songData.title}
👤 *Agente(s) Creador(es):* ${songData.artists}
💽 *Identificador de Álbum:* ${songData.album}
🔗 *Enlace de Origen:* ${songData.url}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⬣`;

        await conn.sendMessage(m.chat, {
            text: info,
            contextInfo: {
                forwardingScore: 9999999,
                isForwarded: false,
                externalAdReply: {
                    showAdAttribution: true,
                    containsAutoReply: true,
                    renderLargerThumbnail: true,
                    title: 'Ellen Joe: Pista asegurada. 📻',
                    body: `Reproduciendo: ${songData.title} - ${songData.artists}`,
                    mediaType: 1,
                    thumbnailUrl: songData.thumbnail,
                    sourceUrl: redes
                }
            }
        }, { quoted: m });

        conn.sendMessage(m.chat, { 
            audio: { url: songData.downloadUrl }, 
            fileName: `${songData.title}.mp3`, 
            mimetype: 'audio/mpeg', 
            ptt: false 
        }, { quoted: m });
        
        m.react('✅');

    } catch (e) {
        console.error("Error en la operación YT Music:", e);
        m.react('❌');
        conn.reply(m.chat, `⚠️ *Anomalía crítica en la operación YT Music, Proxy ${name}.*\nNo pude completar la extracción.\nDetalles: ${e.message || e}`, m, { contextInfo, quoted: m });
    }
};

handler.help = ['ytmusic <canción o artista>'];
handler.tags = ['downloader'];
handler.command = ['ytmusic'];
handler.group = true;
handler.register = true;

export default handler;

// --- Función Auxiliar con la API Corregida ---
async function searchAndDownloadYTM(query) {
    let currentStep = "Inicio";
    try {
        const TIMEOUT = 30000;

        // --- PASO 1: Buscar en la API de YouTube Music ---
        currentStep = "Búsqueda en YouTube Music";
        console.log(`[DIAGNÓSTICO] Iniciando Paso 1: ${currentStep} para "${query}"`);
        
        // ▼▼▼ EL ÚNICO CAMBIO ESTÁ EN ESTA LÍNEA ▼▼▼
        const ytmSearchUrl = `https://youtube-music-api.onrender.com/search?query=${encodeURIComponent(query)}`;
        // ▲▲▲ EL ÚNICO CAMBIO ESTÁ EN ESTA LÍNEA ▲▲▲

        const ytmResponse = await axios.get(ytmSearchUrl, { timeout: TIMEOUT });

        // La nueva API devuelve los resultados en ytmResponse.data.results
        const songs = ytmResponse.data.results.filter(item => item.type === 'song');
        if (songs.length === 0) {
            throw new Error('La búsqueda no arrojó ninguna canción en YouTube Music.');
        }
        const ytmTrack = songs[0];
        console.log(`[DIAGNÓSTICO] Paso 1 completado. Canción encontrada: "${ytmTrack.title}"`);

        // --- PASO 2: Obtener el enlace de descarga ---
        currentStep = "Obtención del enlace de descarga";
        const videoId = ytmTrack.videoId;
        if (!videoId) {
            throw new Error("El resultado de YT Music no contenía un Video ID.");
        }
        console.log(`[DIAGNÓSTICO] Iniciando Paso 2: ${currentStep} con ID: ${videoId}`);
        const downloadInfoUrl = `https://yt-downloader.onrender.com/download?id=${videoId}`;
        const downloadInfoResponse = await axios.get(downloadInfoUrl, { timeout: TIMEOUT });

        if (!downloadInfoResponse.data || !downloadInfoResponse.data.mp3 || !downloadInfoResponse.data.mp3.url) {
             throw new Error('La API de descarga no proporcionó un enlace de audio (mp3).');
        }
        const downloadTrack = downloadInfoResponse.data;
        console.log("[DIAGNÓSTICO] Paso 2 completado. Enlace de descarga obtenido.");

        // --- PASO 3: Devolver los datos ---
        return {
            title: ytmTrack.title,
            artists: ytmTrack.artists.map(artist => artist.name).join(', '),
            album: ytmTrack.album.name || 'Single',
            url: `http://googleusercontent.com/youtube.com/14{videoId}`,
            thumbnail: ytmTrack.thumbnails.slice(-1)[0].url, // Obtiene la imagen de mayor resolución
            downloadUrl: downloadTrack.mp3.url
        };

    } catch (error) {
        console.error(`[DIAGNÓSTICO] Fallo en el paso: "${currentStep}"`);
        console.error("[DIAGNÓSTICO] Detalles del error:", error);
        throw new Error(`Fallo en el paso: ${currentStep}. Razón: ${error.message}`);
    }
}
