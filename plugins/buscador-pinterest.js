
// Importamos 'fetch' ya que la API de Dorratz usa un método GET simple.
import fetch from 'node-fetch'; 
import baileys from '@whiskeysockets/baileys';

// Desestructuración de Baileys
const { generateWAMessageFromContent, generateWAMessage, delay } = baileys;

// --- FUNCIONES AUXILIARES (sendAlbumMessage) ---

async function sendAlbumMessage(conn, jid, medias, options = {}) {
  if (typeof jid !== "string") throw new TypeError(`⚠️ El JID debe ser un texto válido.`);
  if (medias.length < 2) throw new RangeError("⚠️ Se requieren al menos dos imágenes para crear un álbum.");

  for (const media of medias) {
    if (!['image', 'video'].includes(media.type))
      throw new TypeError(`❌ Tipo inválido: ${media.type}`);
    if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data)))
      throw new TypeError(`⚠️ Los datos de la imagen o video no son válidos.`);
  }

  const caption = options.text || options.caption || "";
  const albumDelay = !isNaN(options.delay) ? options.delay : 500; 
  
  // Capturamos la cita para el mensaje padre
  const quotedMessageOptions = options.quoted
    ? {
          contextInfo: {
            remoteJid: options.quoted.key.remoteJid,
            fromMe: options.quoted.key.fromMe,
            stanzaId: options.quoted.key.id,
            participant: options.quoted.key.participant || options.quoted.key.remoteJid,
            quotedMessage: options.quoted.message,
          },
        }
    : {};

  // Creación del mensaje padre del álbum (contenedor)
  const album = generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(m => m.type === "image").length,
        expectedVideoCount: medias.filter(m => m.type === "video").length,
        ...quotedMessageOptions,
      },
    },
    {}
  );

  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });

  // Envío de los mensajes individuales asociados al álbum
  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias[i];
    const img = await generateWAMessage(
      album.key.remoteJid,
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

// 🎯 FUNCIÓN PINS DORRATZ (API de Dorratz)
const pinsDorratz = async (query) => {
  try {
    const res = await fetch(`https://api.dorratz.com/v2/pinterest?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
        console.error(`💥 Error en la API de Dorratz: ${res.status} ${res.statusText}`);
        return [];
    }

    const data = await res.json();
    
    if (Array.isArray(data)) {
        return data.map(item => ({
            image_large_url: item.image_large_url || item.image_medium_url || item.image_small_url,
            image_medium_url: item.image_medium_url || item.image_large_url,
            image_small_url: item.image_small_url || item.image_large_url
        }));
    }
    return [];
  } catch (err) {
    console.error('💥 Error al obtener resultados de Pinterest (Dorratz API):', err.message);
    return [];
  }
};

let handler = async (m, { conn, text }) => {
  const dev = 'Emmax 🌸';
  const botname = 'MashaBot ✨';

  if (!text) {
    return conn.reply(
      m.chat,
      `📌 *Uso correcto:*\nEscribe el término que deseas buscar.\n\n✨ *Ejemplo:* #pin anime girl (o .pin anime girl)`,
      m
    );
  }

  try {
    await m.react('🔍');
    const results = await pinsDorratz(text); 
    
    if (!results.length)
      return conn.reply(m.chat, `❌ No se encontraron resultados para *${text}*. Intenta con otro término. (Vía Dorratz API)`, m);

    const max = Math.min(results.length, 15);
    const medias = [];

    for (let i = 0; i < max; i++) {
      medias.push({
        type: 'image',
        data: {
          url: results[i].image_large_url || results[i].image_medium_url || results[i].image_small_url
        }
      });
    }

    await sendAlbumMessage(conn, m.chat, medias, {
      caption: `🌸 *Masha Kujou* te trae los resultados:\n\n📌 *Búsqueda:* ${text}\n🖼️ *Resultados:* ${max}\n👤 *Creador:* ${dev}\n\n[Datos obtenidos vía Dorratz API]`,
      quoted: m
    });

    await conn.sendMessage(m.chat, { react: { text: '🌺', key: m.key } });

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, '⚠️ Ocurrió un error al procesar la búsqueda en Pinterest (Error de Dorratz API o conexión).', m);
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['buscador'];
handler.register = true;

export default handler;

