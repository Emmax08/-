//código creado por Dioneibi-rip
//modificado por nevi-dev

import fetch from 'node-fetch';
import axios from 'axios';

// --- Constantes y Configuración de Transmisión ---
const NEVI_API_KEY = 'maria'; // Asegúrate de que esta clave sea válida para la API de NEVI.
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ mᥲríᥲ k᥆ȷᥙ᥆\'s 𝐒ervice';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const name = conn.getName(m.sender); // Identificando al Proxy

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
      title: 'mᥲríᥲ k᥆ȷᥙ᥆: Pista localizada. 🪽',
      body: `Procesando solicitud para el/la Proxy ${name}...`,
      thumbnail: global.icons, // Asegúrate de que 'global.icons' y 'global.redes' estén definidos
      sourceUrl: global.redes,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  if (!args[0]) {
    return conn.reply(
      m.chat,
      `👑 *Rastro frío, Proxy ${name}.* Necesito un identificador de video para proceder. Dame el enlace.\n\n_Ejemplo: ${usedPrefix + command} https://youtube.com/watch?v=xxxxxxxxxxx_`,
      m,
      { contextInfo, quoted: m }
    );
  }

  const youtubeUrl = args[0];

  try {
    await conn.reply(
      m.chat,
      `🔄 *Decodificando la señal, Proxy ${name}.* Aguarda. La presa está al alcance.`,
      m,
      { contextInfo, quoted: m }
    );

    // Llamada a la API de NEVI
    const neviApiUrl = `http://neviapi.ddns.net:5000/download`;
    const res = await fetch(neviApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': NEVI_API_KEY,
      },
      body: JSON.stringify({
        url: youtubeUrl,
        format: "mp4"
      }),
    });

    const json = await res.json();

    // Verificación de la respuesta de la API de NEVI y extracción de todos los datos
    if (json.status === "success" && json.download_link) {
      const {
        title,
        description,
        ago,
        views,
        duration,
        author,
        quality
      } = json;

      await conn.sendMessage(
        m.chat,
        {
          video: { url: json.download_link },
          caption:
`╭━━━━[ 𝚈𝚃𝙼𝙿𝟺 𝙳𝚎𝚌𝚘𝚍𝚎𝚍: 𝙿𝚛𝚎𝚜𝚊 𝙲𝚊𝚙𝚝𝚞𝚛𝚊𝚍𝚊 ]━━━━⬣
📹 *Designación:* ${title || 'Desconocido'}
🧑‍💻 *Fuente Operacional:* ${author?.name || 'Desconocida'}
🕒 *Duración del Flujo:* ${duration || 'Desconocida'}
📅 *Fecha de Registro:* ${ago || 'Desconocida'}
👁️ *Registros de Observación:* ${views?.toLocaleString() || '0'}
🎞️ *Calidad de Transmisión:* ${quality || 'Desconocida'}
📄 *Manifiesto de Carga:*
${description || 'Sin descripción disponible.'}
╰━━━━━━━━━━━━━━━━━━⬣`,
          mimetype: 'video/mp4',
          fileName: `${title || 'video'}.mp4`
        },
        { contextInfo, quoted: m }
      );

    } else {
      throw new Error(`No se pudo descargar el video usando la API de NEVI. Razón: ${json.message || 'Respuesta inválida del servidor.'}`);
    }

  } catch (e) {
    console.error(e);
    await conn.reply(
      m.chat,
      `⚠️ *Anomalía detectada, Proxy ${name}.*\nNo pude asegurar la carga de video. Repórtalo si persiste.\nDetalles: ${e.message}`,
      m,
      { contextInfo, quoted: m }
    );
  }
};

handler.help = ['ytmp4'].map(v => v + ' <enlace>');
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'ytvideo', 'ytmp4dl'];
handler.register = true;
handler.limit = true;
handler.coin = 3;

export default handler;
