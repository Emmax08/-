import fetch from 'node-fetch'; 
import baileys from '@whiskeysockets/baileys';

const { generateWAMessageFromContent, generateWAMessage, delay } = baileys;

// --- FUNCIONES AUXILIARES (sendAlbumMessage) ---
async function sendAlbumMessage(conn, jid, medias, options = {}) {
  if (typeof jid !== "string") throw new TypeError(`⚠️ JID inválido.`);
  if (medias.length < 2) throw new RangeError("⚠️ Se requieren al menos 2 imágenes para un álbum.");

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

  await conn.relayMessage(jid, album.message, { messageId: album.key.id });

  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias[i];
    const img = await generateWAMessage(jid, 
      { [type]: data, ...(i === 0 ? { caption } : {}) }, 
      { upload: conn.waUploadToServer }
    );
    img.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
    };
    await conn.relayMessage(jid, img.key.remoteJid, img.message, { messageId: img.key.id });
    await delay(albumDelay);
  }
  return album;
}

// 🎯 SCRAPER / API ALTERNATIVA (Sin Dorratz)
const pinterestSearch = async (query) => {
  try {
    // Ejemplo usando una API pública alternativa o scraper
    const res = await fetch(`https://api.vreden.my.id/api/pinterest?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    
    // Ajustamos según la estructura de la nueva API (usualmente data.result o data.data)
    if (data.status === 200 && Array.isArray(data.result)) {
        return data.result; // Retorna array de URLs
    }
    return [];
  } catch (err) {
    console.error('💥 Error en la búsqueda de Pinterest:', err.message);
    return [];
  }
};

let handler = async (m, { conn, text }) => {
  const dev = 'Emmax 🌸';

  if (!text) return conn.reply(m.chat, `📌 *Uso correcto:*\nEscribe lo que buscas.\n\n✨ *Ejemplo:* .pin masha kujou`, m);

  try {
    await m.react('🔍');
    const results = await pinterestSearch(text); 
    
    if (!results.length) return conn.reply(m.chat, `❌ No encontré resultados para *${text}*.`, m);

    const max = Math.min(results.length, 12);
    const medias = [];

    for (let i = 0; i < max; i++) {
      const url = typeof results[i] === 'string' ? results[i] : (results[i].url || results[i].image);
      if (url) {
        medias.push({ type: 'image', data: { url } });
      }
    }

    if (medias.length < 2) {
        return conn.sendMessage(m.chat, { image: medias[0].data, caption: `✨ Resultado para: ${text}` }, { quoted: m });
    }

    await sendAlbumMessage(conn, m.chat, medias, {
      caption: `🌸 *Masha Kujou* - Pinterest Search\n\n📌 *Búsqueda:* ${text}\n🖼️ *Resultados:* ${medias.length}\n👤 *Dev:* ${dev}`,
      quoted: m
    });

    await m.react('🌺');

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, '⚠️ Error al procesar las imágenes.', m);
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['buscador'];
handler.register = true;

export default handler;
