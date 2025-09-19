//código creado por Dioneibi-rip
//modificado por nevi-dev y Gemini

import fetch from 'node-fetch';

// --- Constantes y Configuración de Transmisión ---
const NEVI_API_KEY = 'maria'; // Asegúrate de que esta clave sea válida para la API de NEVI.
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice'; // Manteniendo el nombre de servicio original

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const name = conn.getName(m.sender); // Identificando al Proxy
  const emoji = '🎵'; // Manteniendo el emoji de música

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
      title: 'mᥲríᥲ k᥆ȷᥙ᥆: Pista localizada. 👑', // Manteniendo el título personalizado
      body: `Procesando solicitud para el/la Proxy ${name}...`, // Manteniendo el cuerpo personalizado
      thumbnail: global.icono, // Asegúrate de que 'global.icono' y 'global.redes' estén definidos
      sourceUrl: global.redes,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  if (!args[0]) {
    return conn.reply(
      m.chat,
      `${emoji} *Rastro frío, Proxy ${name}.* Necesito un identificador de audio para proceder. Dame el enlace.\n\n_Ejemplo: ${usedPrefix + command} https://youtu.be/KHgllosZ3kA`,
      m,
      { contextInfo, quoted: m }
    );
  }

  const youtubeUrl = args[0];

  try {
    // **Paso de Depuración 1: Validación de URL (opcional, pero recomendado)**
    if (!youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/)) {
        return conn.reply(
            m.chat,
            `❌ *¡Rayos! Ese no parece un enlace de YouTube válido, Proxy ${name}.*\nPor favor, proporciona un enlace correcto.`,
            m,
            { contextInfo, quoted: m }
        );
    }

    await conn.reply(
      m.chat,
      `🔄 *Decodificando la señal de audio, Proxy ${name}.* Aguarda. El flujo de datos está siendo asegurado.`,
      m,
      { contextInfo, quoted: m }
    );

    // *** CAMBIO: Usando la API de NEVI ***
    const neviApiUrl = `http://neviapi.ddns.net:5000/download`;
    const res = await fetch(neviApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': NEVI_API_KEY, // Usando la clave de API definida
      },
      body: JSON.stringify({
        url: youtubeUrl,
        format: "mp3" // Solicitando formato MP3
      }),
    });

    const json = await res.json().catch(e => {
        console.error(`[ERROR] No se pudo parsear la respuesta JSON de la API de NEVI: ${e.message}`);
        return null;
    });

    if (!json) {
        const rawText = await res.text().catch(() => "No se pudo obtener el texto de la respuesta.");
        return conn.reply(
            m.chat,
            `❌ *¡Rayos! La API de NEVI no me dio una respuesta JSON válida, Proxy ${name}.*\nPodría ser un problema con la API o un formato inesperado.\nRespuesta cruda (si disponible, primeros 200 caracteres): ${rawText.substring(0, 200)}...`,
            m,
            { contextInfo, quoted: m }
        );
    }

    // *** CAMBIO: Adaptando la verificación de la respuesta y extracción de metadatos de NEVI ***
    if (json.status === "success" && json.download_link) {
      const {
        title,
        description,
        duration, // La API de NEVI devuelve la duración como 'duration'
        views,
        author,
        quality, // La API de NEVI puede proporcionar la calidad directamente
        ago, // Fecha de subida relativa
      } = json;

      const downloadURL = json.download_link;
      const filename = `${title || 'audio'}.mp3`; // Nombre de archivo sugerido

      // Caption con estilo María Kojuo (adaptado para los campos de la API de NEVI)
      const caption = `
╭━━━━[ 𝚈𝚃𝙼𝙿𝟹 𝙳𝚎𝚌𝚘𝚍𝚎𝚍: 𝙵𝚕𝚞𝚓𝚘 𝙰𝚞𝚍𝚒𝚘 𝚂𝚎𝚐𝚞𝚛𝚘 ]━━━━⬣
📌 *Designación de Audio:* ${title || 'Desconocido'}
👤 *Fuente Operacional:* ${author?.name || 'Desconocido'}
⏱️ *Duración del Flujo:* ${duration || 'Desconocida'}
📅 *Fecha de Registro:* ${ago || 'Desconocida'}
👁️ *Registros de Observación:* ${views?.toLocaleString() || '0'}
🎚️ *Calidad de Transmisión:* ${quality || 'Desconocida'}
📄 *Manifiesto de Carga (Descripción):*
${description ? description.substring(0, 500) + (description.length > 500 ? '...' : '') : 'Sin descripción disponible.'}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣`;

      // Enviar audio directamente desde la URL de descarga de NEVI
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: downloadURL }, // Usa directamente el enlace de descarga
          mimetype: 'audio/mpeg',
          fileName: filename,
          ptt: false, // Mantener ptt en false para enviar como música
          caption
        },
        { contextInfo, quoted: m }
      );

    } else {
      throw new Error(`No se pudo descargar el audio usando la API de NEVI. Razón: ${json.message || 'Respuesta inválida del servidor.'}`);
    }

  } catch (e) {
    console.error(e);
    await conn.reply(
      m.chat,
      `⚠️ *Anomalía detectada, Proxy ${name}.*\nNo pude asegurar la carga de audio. Repórtalo si persiste.\nDetalles: ${e.message}`,
      m,
      { contextInfo, quoted: m }
    );
  }
};

handler.help = ['ytmp3'].map(v => v + ' <link>');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'mp3'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
