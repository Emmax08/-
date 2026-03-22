import fetch from 'node-fetch';

// --- Constantes de Configuración ---
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';
const emoji = '🎥';
const API_KEY = "causa-ee5ee31dcfc79da4"; // Tu API Key de apicausas.xyz

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
            `${emoji} *Rastro frío, Proxy ${name}.* Necesito un enlace de YouTube para proceder.\n\n_Ejemplo: ${usedPrefix + command} https://youtu.be/dQw4w9WgXcQ_`,
            m, { contextInfo, quoted: m }
        );
    }

    const youtubeUrl = args[0];

    try {
        // Validación de URL
        if (!youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/)) {
            return conn.reply(
                m.chat,
                `❌ *¡Rayos! Ese no parece un enlace de YouTube válido, Proxy ${name}.*`,
                m, { contextInfo, quoted: m }
            );
        }

        await m.react("⏳");
        await conn.reply(
            m.chat,
            `🔄 *Decodificando la señal de video, Proxy ${name}.* Conectando con apicausas.xyz...`,
            m, { contextInfo, quoted: m }
        );

        // --- Llamada a tu API específica (apicausas.xyz) ---
        const apiUrl = `https://rest.apicausas.xyz/api/v1/descargas/youtube?apikey=${API_KEY}&url=${encodeURIComponent(youtubeUrl)}&type=video`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (json.status && json.data?.download?.url) {
            const videoData = json.data;
            const downloadURL = videoData.download.url;
            
            // Extracción de metadatos de tu API
            const title = videoData.title || 'Video de YouTube';
            const duration = videoData.duration ? `${videoData.duration} segundos` : 'Desconocida';
            const uploader = videoData.uploader || 'Desconocido';
            
            // Caption adaptado con la info de tu API
            const caption = ` 
╭━━━━[ 𝚈𝚃𝙼𝙿𝟺 𝙳𝚎𝚌𝚘𝚍𝚎𝚍: 𝙵𝚕𝚞𝚓𝚘 𝚅𝚒𝚍𝚎𝚘 𝚂𝚎𝚐𝚞𝚛𝚘 ]━━━━⬣
📌 *Designación:* ${title}
👑 *Servidor:* apicausas.xyz
👤 *Autor:* ${uploader}
⏱️ *Duración:* ${duration}
📄 *Estado:* Enlace de descarga asegurado.
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣`;

            // Enviar video directamente
            await conn.sendMessage(
                m.chat, {
                    video: { url: downloadURL },
                    mimetype: 'video/mp4',
                    fileName: `${title}.mp4`,
                    caption
                }, { contextInfo, quoted: m }
            );
            await m.react("📽️");

        } else {
            throw new Error(json.msg || "La API no pudo asegurar la carga del video.");
        }
    } catch (e) {
        console.error(e);
        await m.react("❌");
        await conn.reply(
            m.chat,
            `⚠️ *Anomalía detectada, Proxy ${name}.*\nNo pude procesar el video.\nDetalles: ${e.message}`,
            m, { contextInfo, quoted: m }
        );
    }
};

handler.help = ['ytmp4'].map(v => v + ' <url>');
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'ytvideo', 'mp4'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
