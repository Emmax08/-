import fetch from 'node-fetch';

// --- Constantes y Configuración de Transmisión ---
// ⚠️ SEGURIDAD: Se recomienda usar process.env.XFARR_API_KEY
// Aquí se usa una clave genérica de ejemplo. ¡Reemplázala!
const XFARR_API_KEY = 'Maria-Kojuo'; 
const API_URL = 'https://api.xfarr.com/api/ytmp3'; // Nueva API (ejemplo de endpoint)

const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';

var handler = async (m, { conn, args, usedPrefix, command }) => {
    const name = conn.getName(m.sender);
    const emoji = '🎵';

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
            `🔄 *Decodificando la señal de audio, Proxy ${name}.* Aguarda. El flujo de datos está siendo asegurado.`,
            m, {
                contextInfo,
                quoted: m
            }
        );

        // *** CAMBIO: Usando la Nueva API (ejemplo) ***
        const res = await fetch(`${API_URL}?url=${encodeURIComponent(youtubeUrl)}&apikey=${XFARR_API_KEY}`);

        const json = await res.json().catch(e => {
            console.error(`[ERROR] No se pudo parsear la respuesta JSON de la API: ${e.message}`);
            return null;
        });

        if (!json) {
            const rawText = await res.text().catch(() => "No se pudo obtener el texto de la respuesta.");
            return conn.reply(
                m.chat,
                `❌ *¡Rayos! La API no me dio una respuesta JSON válida, Proxy ${name}.*\nPodría ser un problema con el servicio externo.\nRespuesta cruda (si disponible, primeros 200 caracteres): ${rawText.substring(0, 200)}...`,
                m, {
                    contextInfo,
                    quoted: m
                }
            );
        }
        
        // *** CAMBIO: Adaptando la verificación de la respuesta y extracción de metadatos de la nueva API ***
        // Se asume que la nueva API devuelve los datos de descarga en json.result.download.mp3
        const result = json.result;

        if (json.status && result && result.download?.mp3) {
            const { 
                title, 
                desc, 
                duration, 
                views, 
                uploaded, 
                size 
            } = result;
            
            // La nueva API podría tener un objeto diferente para los metadatos.
            const downloadURL = result.download.mp3; 
            const filename = `${title || 'audio'}.mp3`;

            // Truncar descripción si es muy larga
            const shortDescription = desc 
                ? desc.substring(0, 500) + (desc.length > 500 ? '...' : '')
                : 'Sin descripción disponible.';

            // Caption con estilo María Kojuo (adaptado a los campos de la nueva API)
            const caption = ` 
╭━━━━[ 𝚈𝚃𝙼𝙿𝟹 𝙳𝚎𝚌𝚘𝚍𝚎𝚍: 𝙵𝚕𝚞𝚓𝚘 𝙰𝚞𝚍𝚒𝚘 𝚂𝚎𝚐𝚞𝚛𝚘 ]━━━━⬣
📌 *Designación de Audio:* ${title || 'Desconocido'}
⏱️ *Duración del Flujo:* ${duration || 'Desconocida'}
📂 *Tamaño del Archivo:* ${size || 'Desconocido'}
📅 *Fecha de Registro:* ${uploaded || 'Desconocida'}
👁️ *Registros de Observación:* ${views?.toLocaleString() || '0'}
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

        } else if (json.msg) {
             // Manejo de errores específicos que la nueva API pueda devolver en 'json.msg'
             throw new Error(`Error de la API: ${json.msg}`);
        } else {
            throw new Error(`No se pudo descargar el audio. Respuesta inválida del servidor.`);
        }
    } catch (e) {
        console.error(e);
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

handler.help = ['ytmp3'].map(v => v + ' ');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'mp3'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;