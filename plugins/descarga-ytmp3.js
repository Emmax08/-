import fetch from 'node-fetch';

// --- Constantes de Configuración ---
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';
const emoji = '🎵';
const API_KEY = "causa-ee5ee31dcfc79da4"; // Tu API Key

var handler = async (m, { conn, args, usedPrefix, command }) => {
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
        // Validación de URL de YouTube
        if (!youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/)) {
            return conn.reply(
                m.chat,
                `❌ *¡Rayos! Ese no parece un enlace válido, Proxy ${name}.*`,
                m, { contextInfo, quoted: m }
            );
        }

        await m.react("⏳");
        await conn.reply(
            m.chat,
            `🔄 *Decodificando la señal de audio, Proxy ${name}.* Conectando con apicausas.xyz...`,
            m, { contextInfo, quoted: m }
        );
        
        // --- Llamada a tu API específica ---
        const apiUrl = `https://rest.apicausas.xyz/api/v1/descargas/youtube?apikey=${API_KEY}&url=${encodeURIComponent(youtubeUrl)}&type=audio`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (json.status && json.data?.download?.url) {
            const { title, download } = json.data;
            const downloadURL = download.url;
            
            const caption = ` 
╭━━━━[ 𝚈𝚃𝙼𝙿𝟹 𝙳𝚎𝚌𝚘𝚍𝚎𝚍: 𝙵𝚕𝚞𝚓𝚘 𝙰𝚞𝚍𝚒𝚘 𝚂𝚎𝚐𝚞𝚛𝚘 ]━━━━⬣ 
📌 *Designación:* ${title}
👑 *Servidor:* apicausas.xyz
📄 *Estado:* Enlace verificado.
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣`;

            // Enviar el audio
            await conn.sendMessage(
                m.chat, {
                    audio: { url: downloadURL }, 
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`,
                    ptt: false,
                    caption
                }, { contextInfo, quoted: m }
            );
            await m.react("🎧");

        } else {
            throw new Error(json.msg || "La API no devolvió un enlace válido.");
        }
    } catch (e) {
        console.error(e);
        await m.react("❌");
        await conn.reply(
            m.chat,
            `⚠️ *Anomalía detectada, Proxy ${name}.*\nNo pude procesar el audio.\nDetalles: ${e.message}`,
            m, { contextInfo, quoted: m }
        );
    }
};

handler.help = ['ytmp3'].map(v => v + ' <url>');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'mp3'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
