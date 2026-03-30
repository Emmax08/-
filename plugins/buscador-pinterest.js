import fetch from 'node-fetch'; 
import baileys from '@whiskeysockets/baileys';

const { generateWAMessageFromContent, generateWAMessage, delay } = baileys;

// --- FUNCIONES AUXILIARES (sendAlbumMessage) ---
async function sendAlbumMessage(conn, jid, medias, options = {}) {
  if (typeof jid !== "string") throw new TypeError(`⚠️ El JID debe ser un texto válido.`);
  if (medias.length < 2) throw new RangeError("⚠️ Se requieren al menos dos imágenes para crear un álbum.");

  const caption = options.text || options.caption || "";
  const albumDelay = !isNaN(options.delay) ? options.delay : 500; 
  
  const quotedMessageOptions = options.quoted ? {
    contextInfo: {
      remoteJid: options.quoted.key.remoteJid,
      fromMe: options.quoted.key.fromMe,
      stanzaId: options.quoted.key.id,
      participant: options.quoted.key.participant || options.quoted.key.remoteJid,
      quotedMessage: options.quoted.message,
    },
  } : {};

  const album = generateWAMessageFromContent(jid, {
    messageContextInfo: {},
    albumMessage: {
      expectedImageCount: medias.filter(m => m.type === "image").length,
      expectedVideoCount: medias.filter(m => m.type === "video").length,
      ...quotedMessageOptions,
    },
  }, {});

  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });

  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias[i];
    const img = await generateWAMessage(album.key.remoteJid,
      { [type]: data, ...(i === 0 ? { caption } : {}) },
      { upload: conn.waUploadToServer }
    );
    img.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
    };
    await conn.relayMessage(img.key.remoteJid, img.message, { messageId: img.key.id });
    await delay(albumDelay);
  }
  return album;
}

// 🎯 FUNCIÓN PINTEREST YUKI-WABOT
const pinterestYuki = async (query) => {
  try {
    // Usamos la API que proporcionaste
    const res = await fetch(`https://api.yuki-wabot.my.id/search/pinterestvideo?text=${encodeURIComponent(query)}`);

    if (!res.ok) return [];

    const data = await res.json();
    
    // Verificamos que la respuesta sea exitosa y contenga resultados
    if (data.status && Array.isArray(data.result)) {
        return data.result; // Retorna el array de URLs
    }
    return [];
  } catch (err) {
    console.error('💥 Error en Pinterest Yuki API:', err.message);
    return [];
  }
};

let handler = async (m, { conn, text }) => {
  const dev = 'Emmax 🌸';

  if (!text) {
    return conn.reply(m.chat, `📌 *Uso correcto:*\nEscribe lo que deseas buscar.\n\n✨ *Ejemplo:* .pin masha kujou`, m);
  }

  try {
    await m.react('🔍');
    const results = await pinterestYuki(text); 
    
    if (!results || results.length === 0)
      return conn.reply(m.chat, `❌ No encontré resultados para *${text}*.`, m);

    const max = Math.min(results.length, 15);
    const medias = [];

    for (let i = 0; i < max; i++) {
      const url = results[i]; // Yuki devuelve directamente los strings de las URLs en el array result
      if (url) {
        medias.push({
          type: 'image',
          data: { url }
        });
      }
    }

    // Validación mínima para el álbum
    if (medias.length < 2) {
        return conn.sendMessage(m.chat, { 
            image: { url: medias[0].data.url }, 
            caption: `🌸 *Masha Kujou* | Resultado Único\n📌 *Búsqueda:* ${text}` 
        }, { quoted: m });
    }

    await sendAlbumMessage(conn, m.chat, medias, {
      caption: `🌸 *Masha Kujou* - Resultados de Pinterest\n\n📌 *Búsqueda:* ${text}\n🖼️ *Imágenes:* ${medias.length}\n👤 *Dev:* ${dev}`,
      quoted: m
    });

    await conn.sendMessage(m.chat, { react: { text: '🌺', key: m.key } });

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, '⚠️ Ocurrió un error al procesar la búsqueda.', m);
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['buscador'];
handler.register = true;

export default handler;
